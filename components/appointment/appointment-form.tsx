"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { createClientSupabaseClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

interface AppointmentFormProps {
  selectedDate: Date | null
  selectedSlot: string | null
  selectedDoctor: string | null
  selectedSpecialty: string | null
  slotTime?: string
}

export function AppointmentForm({
  selectedDate,
  selectedSlot,
  selectedDoctor,
  selectedSpecialty,
  slotTime,
}: AppointmentFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [notes, setNotes] = useState("")
  const supabase = createClientSupabaseClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedDate || !selectedSlot || !selectedDoctor || !selectedSpecialty) {
      toast({
        title: "Erro ao agendar consulta",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Verificar se o usuário está autenticado
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        // Salvar dados do agendamento no localStorage para recuperar após o login
        localStorage.setItem(
          "pendingAppointment",
          JSON.stringify({
            date: selectedDate,
            slotId: selectedSlot,
            doctorId: selectedDoctor,
            specialtyId: selectedSpecialty,
            notes,
          }),
        )

        toast({
          title: "Login necessário",
          description: "Você precisa fazer login para concluir o agendamento.",
        })

        router.push("/paciente/login?redirect=/agendar")
        return
      }

      // Obter informações do slot selecionado
      const [startTime, endTime] = slotTime ? slotTime.split(" - ") : ["08:00", "09:00"]

      // Criar o agendamento
      const { error } = await supabase.from("appointments").insert({
        patient_id: session.user.id,
        doctor_id: selectedDoctor,
        specialty_id: selectedSpecialty,
        appointment_date: format(selectedDate, "yyyy-MM-dd"),
        start_time: startTime,
        end_time: endTime,
        status: "scheduled",
        notes: notes || null,
      })

      if (error) {
        throw error
      }

      toast({
        title: "Agendamento realizado com sucesso!",
        description: `Sua consulta foi agendada para ${format(selectedDate, "dd/MM/yyyy", { locale: ptBR })} às ${startTime}.`,
      })

      router.push("/paciente/agendamentos")
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Erro ao agendar consulta",
        description: error.message || "Ocorreu um erro ao agendar sua consulta. Tente novamente mais tarde.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome completo</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required disabled={isLoading} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Telefone</Label>
        <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required disabled={isLoading} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Motivo da consulta</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Descreva brevemente o motivo da sua consulta"
          disabled={isLoading}
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || !selectedDate || !selectedSlot || !selectedDoctor}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Agendando...
          </>
        ) : (
          "Confirmar agendamento"
        )}
      </Button>
    </form>
  )
}
