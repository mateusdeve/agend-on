"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface CreditCardFormProps {
  onSubmit: (data: any) => void
  isLoading: boolean
  amount: number
}

declare global {
  interface Window {
    MercadoPago: any
  }
}

export function CreditCardForm({ onSubmit, isLoading, amount }: CreditCardFormProps) {
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [docType, setDocType] = useState("CPF")
  const [docNumber, setDocNumber] = useState("")
  const [mp, setMp] = useState<any>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    // Carregar o script do Mercado Pago
    const script = document.createElement("script")
    script.src = "https://sdk.mercadopago.com/js/v2"
    script.onload = () => {
      const mp = new window.MercadoPago(process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY || "")
      setMp(mp)
    }
    document.body.appendChild(script)

    return () => {
      // Remover o script quando o componente for desmontado
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!mp) {
      toast({
        title: "Erro no processamento",
        description: "O serviço de pagamento não está disponível no momento. Tente novamente mais tarde.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      // Obter o mês e ano de expiração
      const [month, year] = expiryDate.split("/")

      // Criar o token do cartão
      const cardTokenData = await mp.createCardToken({
        cardNumber: cardNumber.replace(/\s/g, ""),
        cardholderName: cardName,
        cardExpirationMonth: month,
        cardExpirationYear: `20${year}`,
        securityCode: cvv,
        identificationType: docType,
        identificationNumber: docNumber.replace(/[^\d]/g, ""), // Remove todos os caracteres não numéricos
      })

      if (cardTokenData.error) {
        throw new Error(cardTokenData.error)
      }

      // Determinar o método de pagamento com base nos primeiros dígitos do cartão
      const bin = cardNumber.replace(/\s/g, "").substring(0, 6)

      // Mapeamento simplificado de BIN para bandeiras de cartão
      // Na implementação real, isso seria feito pelo backend
      let paymentMethodId = "master"
      if (/^4/.test(bin)) {
        paymentMethodId = "visa"
      } else if (/^5[1-5]/.test(bin)) {
        paymentMethodId = "master"
      } else if (/^3[47]/.test(bin)) {
        paymentMethodId = "amex"
      } else if (/^6(?:011|5)/.test(bin)) {
        paymentMethodId = "discover"
      } else if (/^(30[0-5]|36|38)/.test(bin)) {
        paymentMethodId = "diners"
      } else if (/^(60|6521)/.test(bin)) {
        paymentMethodId = "hipercard"
      } else if (/^(636368|438935|504175|451416|636297)/.test(bin)) {
        paymentMethodId = "elo"
      }

      // Enviar os dados para o componente pai
      onSubmit({
        token: cardTokenData.id,
        paymentMethodId: paymentMethodId,
        docType,
        docNumber: docNumber.replace(/[^\d]/g, ""), // Enviar CPF sem formatação
      })
    } catch (error: any) {
      console.error("Erro ao processar cartão:", error)
      toast({
        title: "Erro no processamento do cartão",
        description: error.message || "Ocorreu um erro ao processar seu cartão. Verifique os dados e tente novamente.",
        variant: "destructive",
      })
      setIsProcessing(false)
    }
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")

    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`
    }

    return v
  }

  const formatCPF = (value: string) => {
    const v = value.replace(/\D/g, "")

    if (v.length <= 3) {
      return v
    } else if (v.length <= 6) {
      return `${v.substring(0, 3)}.${v.substring(3)}`
    } else if (v.length <= 9) {
      return `${v.substring(0, 3)}.${v.substring(3, 6)}.${v.substring(6)}`
    } else {
      return `${v.substring(0, 3)}.${v.substring(3, 6)}.${v.substring(6, 9)}-${v.substring(9, 11)}`
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="cardNumber">Número do Cartão</Label>
        <Input
          id="cardNumber"
          placeholder="0000 0000 0000 0000"
          value={cardNumber}
          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
          maxLength={19}
          required
          disabled={isLoading || isProcessing}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cardName">Nome no Cartão</Label>
        <Input
          id="cardName"
          placeholder="NOME COMO ESTÁ NO CARTÃO"
          value={cardName}
          onChange={(e) => setCardName(e.target.value.toUpperCase())}
          required
          disabled={isLoading || isProcessing}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="expiryDate">Validade</Label>
          <Input
            id="expiryDate"
            placeholder="MM/AA"
            value={expiryDate}
            onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
            maxLength={5}
            required
            disabled={isLoading || isProcessing}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cvv">CVV</Label>
          <Input
            id="cvv"
            placeholder="123"
            value={cvv}
            onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, ""))}
            maxLength={4}
            required
            disabled={isLoading || isProcessing}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="docNumber">CPF do Titular</Label>
        <Input
          id="docNumber"
          placeholder="000.000.000-00"
          value={docNumber}
          onChange={(e) => setDocNumber(formatCPF(e.target.value))}
          maxLength={14}
          required
          disabled={isLoading || isProcessing}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading || isProcessing}>
        {isLoading || isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processando...
          </>
        ) : (
          "Pagar com Cartão de Crédito"
        )}
      </Button>
    </form>
  )
}
