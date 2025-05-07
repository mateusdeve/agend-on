"use client"

import { useState, useEffect } from "react"
import { createClientSupabaseClient } from "@/lib/supabase/client"
import { AppointmentCard } from "@/components/patient/appointment-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"

export default function AppointmentsPage() {
  const [activeTab, setActiveTab] = useState("upcoming")
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientSupabaseClient()

  const fetchAppointments = async () => {
    setLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const today = new Date().toISOString().split("T")[0]

      let query = supabase
        .from("appointments")
        .select(`
          id,
          appointment_date,
          start_time,
          end_time,
          status,
          notes,
          doctor:doctors(name, image_url),
          specialty:specialties(name)
        `)
        .eq("patient_id", user.id)

      if (activeTab === "upcoming") {
        query = query
          .eq("status", "scheduled")
          .gte("appointment_date", today)
          .order("appointment_date", { ascending: true })
          .order("start_time", { ascending: true })
      } else if (activeTab === "past") {
        query = query
          .or(
            `status.eq.completed,status.eq.cancelled,status.eq.no_show,and(status.eq.scheduled,appointment_date.lt.${today})`,
          )
          .order("appointment_date", { ascending: false })
          .order("start_time", { ascending: false })
      }

      const { data, error } = await query

      if (error) throw error

      setAppointments(data || [])
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAppointments()
  }, [activeTab])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Meus agendamentos</h1>
        <p className="text-muted-foreground">Gerencie suas consultas agendadas</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="upcoming">Próximas</TabsTrigger>
          <TabsTrigger value="past">Anteriores</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="upcoming" className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : appointments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {appointments.map((appointment) => (
                  <AppointmentCard key={appointment.id} appointment={appointment} onStatusChange={fetchAppointments} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border rounded-lg bg-muted/20">
                <h3 className="text-lg font-medium mb-2">Nenhuma consulta agendada</h3>
                <p className="text-muted-foreground">Você não possui consultas agendadas no momento.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : appointments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {appointments.map((appointment) => (
                  <AppointmentCard key={appointment.id} appointment={appointment} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border rounded-lg bg-muted/20">
                <h3 className="text-lg font-medium mb-2">Nenhum histórico de consultas</h3>
                <p className="text-muted-foreground">Você ainda não possui histórico de consultas.</p>
              </div>
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
