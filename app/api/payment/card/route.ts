// pages/api/mercadopago.ts

import { v4 as uuidv4 } from "uuid";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const idempotencyKey = uuidv4();
  try {
    const bodyReq = await req.json();
    // Extraindo os dados enviados pelo formulário do componente
    const {
      token,
      issuer_id,
      payment_method_id,
      transaction_amount,
      installments,
      description,
      payer,
      appointmentData,
      appointmentId,
    } = bodyReq;

    // Inicialize o client usando a chave de acesso (recomenda-se armazenar em variável de ambiente)
    const client = new MercadoPagoConfig({
      accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || "",
      options: {
        timeout: 5000,
        // Pode utilizar um idempotencyKey vindo do header ou definir um padrão
        idempotencyKey,
      },
    });

    // Inicialize o objeto da API de pagamento
    const paymentSdk = new Payment(client);

    // Cria o objeto body utilizando os mesmos dados do componente
    const body = {
      token,
      issuer_id,
      payment_method_id,
      transaction_amount: Number(transaction_amount),
      installments: Number(installments),
      description, // "Descrição do produto"
      payer: payer, // { email, identification: { type, number } }0
      metadata: { appointmentData, appointmentId },
    };

    const requestOptions = {
      idempotencyKey,
    };

    // Realiza a criação do pagamento
    const response = await paymentSdk.create({ body, requestOptions });

    console.log("response", response);

    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    console.error("Erro na criação do pagamento: ", error);
    return NextResponse.json(
      { error: "Falha ao criar o pagamento" },
      { status: 500 }
    );
  }
}
