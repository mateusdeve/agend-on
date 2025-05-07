"use client"

import type React from "react"

import { useState } from "react"
import { format, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar, Clock, FileText, AlertCircle, CheckCircle, XCircle, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { createClientSupabaseClient } from "@/lib/supabase/client"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface AppointmentCardProps {
  appointment: {
    id: string
    appointment_date: string
    start_time: string
    end_time: string
    status: string
    notes: string | null
    doctor: {
      name: string
      image_url: string | null
    }
    specialty: {
      name: string
      price?: number
    }
  }
  onStatusChange?: () => void
}

export function AppointmentCard({ appointment, onStatusChange }: AppointmentCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const supabase = createClientSupabaseClient()

  const statusMap: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    scheduled: {
      label: "Agendado",
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      icon: <Calendar className="h-4 w-4" />,
    },
    completed: {
      label: "Concluído",
      color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      icon: <CheckCircle className="h-4 w-4" />,
    },
    cancelled: {
      label: "Cancelado",
      color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
      icon: <XCircle className="h-4 w-4" />,
    },
    no_show: {
      label: "Não compareceu",
      color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
      icon: <AlertCircle className="h-4 w-4" />,
    },
    pending_payment: {
      label: "Pagamento pendente",
      color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
      icon: <CreditCard className="h-4 w-4" />,
    },
  }

  const status = statusMap[appointment.status] || statusMap.scheduled
  const appointmentDate = parseISO(appointment.appointment_date)
  const formattedDate = format(appointmentDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })

  const handleCancelAppointment = async () => {
    setIsLoading(true)

    try {
      const { error } = await supabase.from("appointments").update({ status: "cancelled" }).eq("id", appointment.id)

      if (error) throw error

      toast({
        title: "Consulta cancelada com sucesso",
        description: "Sua consulta foi cancelada. Você pode agendar uma nova consulta quando desejar.",
      })

      if (onStatusChange) {
        onStatusChange()
      }

      setIsDialogOpen(false)
    } catch (error: any) {
      toast({
        title: "Erro ao cancelar consulta",
        description: error.message || "Ocorreu um erro ao cancelar sua consulta. Tente novamente mais tarde.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const isPastAppointment = new Date() > new Date(`${appointment.appointment_date}T${appointment.end_time}`)
  const canCancel = appointment.status === "scheduled" && !isPastAppointment
  const isPendingPayment = appointment.status === "pending_payment"

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{appointment.specialty.name}</CardTitle>
            <CardDescription>Dr. {appointment.doctor.name}</CardDescription>
          </div>
          <div className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center gap-1", status.color)}>
            {status.icon}
            {status.label}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {appointment.start_time} - {appointment.end_time}
            </span>
          </div>
          {appointment.notes && (
            <div className="flex items-start gap-2 pt-2">
              <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
              <span className="text-sm text-muted-foreground">{appointment.notes}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        {isPendingPayment ? (
          <Button asChild className="w-full">
            <Link href={`/agendar/pagamento/${appointment.id}`}>Realizar pagamento</Link>
          </Button>
        ) : canCancel ? (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                Cancelar consulta
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cancelar consulta</DialogTitle>
                <DialogDescription>
                  Tem certeza que deseja cancelar esta consulta? Esta ação não pode ser desfeita.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Voltar
                </Button>
                <Button variant="destructive" onClick={handleCancelAppointment} disabled={isLoading}>
                  {isLoading ? "Cancelando..." : "Confirmar cancelamento"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ) : null}
      </CardFooter>
    </Card>
  )
}
