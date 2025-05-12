"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientSupabaseClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { CreditCard, QrCode } from "lucide-react";
import { CreditCardForm } from "./credit-card-form";
import { PixPaymentForm } from "./pix-payment-form";
import { formatCurrency } from "@/lib/utils";
import Payments from "./credi-card-new";

interface PaymentFormProps {
  appointmentData: {
    doctorId: string;
    specialtyId: string;
    specialtyName: string;
    specialtyPrice: number;
    date: Date;
    time: string;
    patientName: string;
    patientEmail: string;
    notes?: string;
  };
  onPaymentComplete: (paymentId: string) => void;
  appointmentId?: string;
}

export function PaymentForm({
  appointmentData,
  onPaymentComplete,
  appointmentId,
}: PaymentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"credit_card" | "pix">(
    "credit_card"
  );
  const [pixData, setPixData] = useState<any>(null);
  const router = useRouter();
  const supabase = createClientSupabaseClient();

  console.log("appointmentData", appointmentData);

  const handlePayWithCreditCard = async (cardData: any) => {
    setIsLoading(true);
    try {
      // Enviar dados para a API de pagamento
      const response = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appointmentId: appointmentId,
          paymentMethod: "credit_card",
          amount: appointmentData.specialtyPrice,
          cardData,
          description: `Consulta - ${appointmentData.specialtyName}`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao processar pagamento");
      }

      if (data.status === "approved") {
        toast({
          title: "Pagamento aprovado!",
          description: "Seu pagamento foi processado com sucesso.",
        });

        onPaymentComplete(data.payment.id);
      } else {
        toast({
          title: "Pagamento pendente",
          description:
            "Seu pagamento está sendo processado. Você receberá uma confirmação em breve.",
        });

        // Redirecionar para a página de agendamentos
        // router.push("/paciente/agendamentos");
      }
    } catch (error: any) {
      toast({
        title: "Erro no pagamento",
        description:
          error.message ||
          "Ocorreu um erro ao processar seu pagamento. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      // setIsLoading(false);
    }
  };

  const handlePayWithPix = async () => {
    setIsLoading(true);
    try {
      // Enviar dados para a API de pagamento
      const response = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appointmentId: appointmentId,
          paymentMethod: "pix",
          amount: appointmentData.specialtyPrice,
          description: `Consulta - ${appointmentData.specialtyName}`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao gerar pagamento PIX");
      }

      // Extrair dados do QR code PIX
      const pixInfo =
        data.payment.payment_data.point_of_interaction?.transaction_data;

      if (pixInfo) {
        setPixData({
          qrCode: pixInfo.qr_code,
          qrCodeBase64: pixInfo.qr_code_base64,
          expirationDate: pixInfo.expiration_date,
        });
      }

      toast({
        title: "PIX gerado com sucesso",
        description:
          "Escaneie o QR code ou copie o código PIX para realizar o pagamento.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao gerar PIX",
        description:
          error.message ||
          "Ocorreu um erro ao gerar o pagamento PIX. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePixPaymentComplete = async () => {
    setIsLoading(true);
    try {
      // Verificar status do pagamento
      const response = await fetch(
        `/api/payment/check?appointmentId=${appointmentId}`,
        {
          method: "GET",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao verificar pagamento");
      }

      if (data.status === "approved") {
        toast({
          title: "Pagamento confirmado!",
          description: "Seu pagamento PIX foi confirmado com sucesso.",
        });

        onPaymentComplete(data.payment.id);
      } else {
        toast({
          title: "Pagamento pendente",
          description:
            "Seu pagamento ainda não foi confirmado. Aguarde alguns instantes e tente novamente.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro ao verificar pagamento",
        description:
          error.message ||
          "Ocorreu um erro ao verificar seu pagamento. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Pagamento da Consulta</CardTitle>
        <CardDescription>
          Escolha a forma de pagamento para confirmar seu agendamento
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            Resumo do agendamento
          </h3>
          <div className="bg-muted/50 p-4 rounded-md space-y-2">
            <div className="flex justify-between">
              <span>Especialidade:</span>
              <span className="font-medium">
                {appointmentData.specialtyName}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Data:</span>
              <span className="font-medium">
                {appointmentData.date.toLocaleDateString("pt-BR")}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Horário:</span>
              <span className="font-medium">{appointmentData.time}</span>
            </div>
            <div className="flex justify-between border-t pt-2 mt-2">
              <span className="font-medium">Valor total:</span>
              <span className="font-bold text-primary">
                {appointmentData.specialtyPrice
                  ? formatCurrency(appointmentData.specialtyPrice)
                  : "Preço não definido"}
              </span>
            </div>
          </div>
        </div>

        <Tabs
          defaultValue="credit_card"
          onValueChange={(value) =>
            setPaymentMethod(value as "credit_card" | "pix")
          }
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="credit_card" disabled={isLoading}>
              <CreditCard className="h-4 w-4 mr-2" />
              Cartão de Crédito
            </TabsTrigger>
            <TabsTrigger value="pix" disabled={isLoading}>
              <QrCode className="h-4 w-4 mr-2" />
              PIX
            </TabsTrigger>
          </TabsList>
          <TabsContent value="credit_card" className="mt-4">
            {/* <CreditCardForm
              onSubmit={handlePayWithCreditCard}
              isLoading={isLoading}
              amount={appointmentData.specialtyPrice}
            /> */}
            <Payments
              email={appointmentData.patientEmail}
              nameProduct={appointmentData.specialtyName}
              amount={String(appointmentData.specialtyPrice)}
              appointmentData={appointmentData}
              appointmentId={appointmentId}
            />
          </TabsContent>
          <TabsContent value="pix" className="mt-4">
            <PixPaymentForm
              amount={appointmentData.specialtyPrice}
              onPaymentComplete={handlePixPaymentComplete}
              isLoading={isLoading}
              pixData={pixData}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          disabled={isLoading}
          onClick={() => router.back()}
        >
          Voltar
        </Button>
      </CardFooter>
    </Card>
  );
}
