"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Copy, CheckCircle2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface PixPaymentFormProps {
  amount: number;
  onPaymentComplete: () => void;
  isLoading: boolean;
  pixData?: {
    qrCode: string;
    qrCodeBase64: string;
    expirationDate: string;
  };
}

export function PixPaymentForm({
  amount,
  onPaymentComplete,
  isLoading,
  pixData,
}: PixPaymentFormProps) {
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState(900); // 15 minutos em segundos
  const [pixCode, setPixCode] = useState(
    pixData?.qrCode ||
      "00020126580014br.gov.bcb.pix0136a629532e-7693-4846-b028-f142a1415f6f5204000053039865802BR5913Teste Mercado6008Sao Paulo62070503***6304E2CA"
  );
  const [qrCodeImage, setQrCodeImage] = useState(
    pixData?.qrCodeBase64 ||
      "/placeholder.svg?height=200&width=200&text=QR+Code+PIX"
  );

  useEffect(() => {
    if (pixData) {
      setPixCode(pixData.qrCode);
      setQrCodeImage(pixData.qrCodeBase64);
    }
  }, [pixData]);

  useEffect(() => {
    if (countdown > 0 && !isLoading) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, isLoading]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleConfirmPayment = () => {
    onPaymentComplete();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mb-4">
          <div className="bg-muted inline-flex p-4 rounded-lg">
            {qrCodeImage.startsWith("data:image") ? (
              <img
                src={qrCodeImage || "/placeholder.svg"}
                alt="QR Code PIX"
                className="h-48 w-48"
              />
            ) : (
              <img
                src="/placeholder.svg?height=200&width=200&text=QR+Code+PIX"
                alt="QR Code PIX"
                className="h-48 w-48"
              />
            )}
          </div>
        </div>

        <div className="text-sm text-muted-foreground mb-2">
          Escaneie o QR code acima ou copie o código PIX abaixo
        </div>

        <div className="flex items-center justify-center mb-4">
          <div className="text-xs font-mono bg-muted p-2 rounded border truncate max-w-xs">
            {pixCode.length > 30 ? `${pixCode.substring(0, 30)}...` : pixCode}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopyCode}
            className="ml-2"
            disabled={isLoading}
          >
            {copied ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            <span className="sr-only">Copiar código PIX</span>
          </Button>
        </div>

        <div className="text-center space-y-2 mb-6">
          <p className="font-medium">Valor a pagar: {formatCurrency(amount)}</p>
          <p className="text-sm text-muted-foreground">
            O QR Code expira em:{" "}
            <span className="font-medium">{formatTime(countdown)}</span>
          </p>
        </div>
      </div>

      <div className="bg-muted/50 p-4 rounded-md text-sm space-y-2">
        <p className="font-medium">Como pagar com PIX:</p>
        <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
          <li>Abra o aplicativo do seu banco</li>
          <li>Acesse a área PIX ou escaneie QR Code</li>
          <li>Escaneie o QR code acima ou cole o código copiado</li>
          <li>Confirme as informações e finalize o pagamento</li>
        </ol>
      </div>

      <Button
        onClick={handleConfirmPayment}
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processando...
          </>
        ) : (
          "Já realizei o pagamento"
        )}
      </Button>
    </div>
  );
}
