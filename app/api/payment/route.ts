import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import mercadopago from "mercadopago"

// Configurar o SDK do Mercado Pago com o Access Token
mercadopago.configure({
  access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN || "",
})

export async function POST(request: Request) {
  try {
    const supabase = createServerSupabaseClient()

    // Verificar autenticação
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Obter dados do corpo da requisição
    const body = await request.json()
    const { appointmentId, paymentMethod, amount, cardData = null, description } = body

    // Verificar se o agendamento existe e pertence ao usuário
    const { data: appointment, error: appointmentError } = await supabase
      .from("appointments")
      .select("id, patient_id, specialty:specialties(name)")
      .eq("id", appointmentId)
      .single()

    if (appointmentError || !appointment) {
      return NextResponse.json({ error: "Agendamento não encontrado" }, { status: 404 })
    }

    if (appointment.patient_id !== session.user.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 })
    }

    // Obter dados do paciente
    const { data: patient, error: patientError } = await supabase
      .from("patients")
      .select("name, email")
      .eq("id", session.user.id)
      .single()

    if (patientError || !patient) {
      return NextResponse.json({ error: "Dados do paciente não encontrados" }, { status: 404 })
    }

    let paymentData
    let status = "pending"
    let externalId = ""

    // Processar pagamento de acordo com o método
    if (paymentMethod === "credit_card") {
      // Criar pagamento com cartão de crédito
      const payment = await mercadopago.payment.create({
        transaction_amount: Number(amount),
        token: cardData.token,
        description: description || `Consulta - ${appointment.specialty?.name}`,
        installments: 1,
        payment_method_id: cardData.paymentMethodId,
        payer: {
          email: patient.email,
          identification: {
            type: cardData.docType,
            number: cardData.docNumber,
          },
        },
      })

      externalId = payment.body.id.toString()
      status = payment.body.status
      paymentData = payment.body
    } else if (paymentMethod === "pix") {
      // Criar pagamento com PIX
      const payment = await mercadopago.payment.create({
        transaction_amount: Number(amount),
        description: description || `Consulta - ${appointment.specialty?.name}`,
        payment_method_id: "pix",
        payer: {
          email: patient.email,
          first_name: patient.name.split(" ")[0],
          last_name: patient.name.split(" ").slice(1).join(" ") || " ",
        },
      })

      externalId = payment.body.id.toString()
      status = payment.body.status
      paymentData = {
        ...payment.body,
        point_of_interaction: payment.body.point_of_interaction,
      }
    }

    // Registrar o pagamento no banco de dados
    const { data: paymentRecord, error: paymentError } = await supabase
      .from("payments")
      .insert({
        appointment_id: appointmentId,
        amount: amount,
        payment_method: paymentMethod,
        status: status,
        external_id: externalId,
        payment_data: paymentData,
      })
      .select()
      .single()

    if (paymentError) {
      console.error("Erro ao registrar pagamento:", paymentError)
      return NextResponse.json({ error: "Erro ao registrar pagamento" }, { status: 500 })
    }

    // Se o pagamento foi aprovado, atualizar o status do agendamento
    if (status === "approved") {
      await supabase.from("appointments").update({ status: "scheduled" }).eq("id", appointmentId)
    }

    return NextResponse.json({
      success: true,
      payment: paymentRecord,
      status: status,
    })
  } catch (error: any) {
    console.error("Erro ao processar pagamento:", error)
    return NextResponse.json({ error: error.message || "Erro ao processar pagamento" }, { status: 500 })
  }
}
