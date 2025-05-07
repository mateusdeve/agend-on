import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import mercadopago from "mercadopago"

// Configurar o SDK do Mercado Pago com o Access Token
mercadopago.configure({
  access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN || "",
})

export async function GET(request: Request) {
  try {
    const supabase = createServerSupabaseClient()

    // Verificar autenticação
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Obter o ID do agendamento da URL
    const url = new URL(request.url)
    const appointmentId = url.searchParams.get("appointmentId")

    if (!appointmentId) {
      return NextResponse.json({ error: "ID do agendamento não fornecido" }, { status: 400 })
    }

    // Verificar se o agendamento existe e pertence ao usuário
    const { data: appointment, error: appointmentError } = await supabase
      .from("appointments")
      .select("id, patient_id, status")
      .eq("id", appointmentId)
      .single()

    if (appointmentError || !appointment) {
      return NextResponse.json({ error: "Agendamento não encontrado" }, { status: 404 })
    }

    if (appointment.patient_id !== session.user.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 })
    }

    // Se o agendamento já estiver confirmado, retornar sucesso
    if (appointment.status === "scheduled") {
      return NextResponse.json({
        success: true,
        status: "approved",
        message: "Pagamento já confirmado",
      })
    }

    // Buscar o pagamento mais recente para este agendamento
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .select("*")
      .eq("appointment_id", appointmentId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (paymentError || !payment) {
      return NextResponse.json({ error: "Pagamento não encontrado" }, { status: 404 })
    }

    // Se o pagamento for via PIX, verificar o status no Mercado Pago
    if (payment.payment_method === "pix" && payment.external_id) {
      try {
        const { body: paymentInfo } = await mercadopago.payment.get(payment.external_id)

        // Atualizar o status do pagamento no banco de dados
        await supabase
          .from("payments")
          .update({
            status: paymentInfo.status,
            payment_data: paymentInfo,
          })
          .eq("id", payment.id)

        // Se o pagamento foi aprovado, atualizar o status do agendamento
        if (paymentInfo.status === "approved") {
          await supabase.from("appointments").update({ status: "scheduled" }).eq("id", appointmentId)

          return NextResponse.json({
            success: true,
            status: "approved",
            payment: {
              id: payment.id,
              status: paymentInfo.status,
            },
          })
        }

        return NextResponse.json({
          success: true,
          status: paymentInfo.status,
          payment: {
            id: payment.id,
            status: paymentInfo.status,
          },
        })
      } catch (error) {
        console.error("Erro ao verificar pagamento no Mercado Pago:", error)
        return NextResponse.json({
          success: false,
          status: payment.status,
          payment: {
            id: payment.id,
            status: payment.status,
          },
        })
      }
    }

    // Para outros métodos de pagamento, retornar o status atual
    return NextResponse.json({
      success: true,
      status: payment.status,
      payment: {
        id: payment.id,
        status: payment.status,
      },
    })
  } catch (error: any) {
    console.error("Erro ao verificar pagamento:", error)
    return NextResponse.json({ error: error.message || "Erro ao verificar pagamento" }, { status: 500 })
  }
}
