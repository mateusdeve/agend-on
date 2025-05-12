import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import mercadopago from "mercadopago";

// Configurar o SDK do Mercado Pago com o Access Token
mercadopago.configure({
  access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN || "",
});

export async function POST(request: Request) {
  try {
    const supabase = createServerSupabaseClient();

    // Obter dados do webhook
    const body = await request.json();
    const { action, data } = body;

    // Verificar se é uma notificação de pagamento
    if (action === "payment.updated" || action === "payment.created") {
      const paymentId = data.id;

      // Obter detalhes do pagamento do Mercado Pago
      const { body: paymentInfo } = await mercadopago.payment.get(paymentId);

      // Buscar o pagamento no banco de dados
      const { data: payment, error: paymentError } = await supabase
        .from("payments")
        .select("id, appointment_id, status")
        .eq("external_id", paymentId.toString())
        .single();

      if (paymentError || !payment) {
        console.error("Pagamento não encontrado:", paymentId);
        return NextResponse.json({
          success: false,
          message: "Pagamento não encontrado",
        });
      }

      // Atualizar o status do pagamento
      await supabase
        .from("payments")
        .update({
          status: paymentInfo.status,
          payment_data: paymentInfo,
        })
        .eq("id", payment.id);

      // Se o pagamento foi aprovado, atualizar o status do agendamento
      if (paymentInfo.status === "approved" && payment.status !== "approved") {
        await supabase
          .from("appointments")
          .update({ status: "scheduled" })
          .eq("id", payment.appointment_id);
      }

      // Se o pagamento foi rejeitado ou cancelado, atualizar o status do agendamento
      if (["rejected", "cancelled", "refunded"].includes(paymentInfo.status)) {
        await supabase
          .from("appointments")
          .update({ status: "cancelled" })
          .eq("id", payment.appointment_id);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Erro ao processar webhook:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao processar webhook" },
      { status: 500 }
    );
  }
}
