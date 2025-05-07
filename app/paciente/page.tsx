import { createServerSupabaseClient } from "@/lib/supabase/server"
import { AppointmentCard } from "@/components/patient/appointment-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function PatientDashboard() {
  const supabase = createServerSupabaseClient()

  // Buscar informações do usuário
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Buscar informações do paciente
  const { data: patient } = await supabase.from("patients").select("*").eq("id", user?.id).single()

  // Buscar próximos agendamentos
  const { data: upcomingAppointments } = await supabase
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
    .eq("patient_id", user?.id)
    .eq("status", "scheduled")
    .gte("appointment_date", new Date().toISOString().split("T")[0])
    .order("appointment_date", { ascending: true })
    .order("start_time", { ascending: true })
    .limit(3)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Olá, {patient?.name?.split(" ")[0] || "Paciente"}</h1>
          <p className="text-muted-foreground">Bem-vindo à sua área do paciente</p>
        </div>
        <Button asChild>
          <Link href="/agendar">Agendar nova consulta</Link>
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Próximas consultas</h2>
          <Button variant="link" asChild>
            <Link href="/paciente/agendamentos">Ver todas</Link>
          </Button>
        </div>

        {upcomingAppointments && upcomingAppointments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingAppointments.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border rounded-lg bg-muted/20">
            <h3 className="text-lg font-medium mb-2">Nenhuma consulta agendada</h3>
            <p className="text-muted-foreground mb-6">Você não possui consultas agendadas no momento.</p>
            <Button asChild>
              <Link href="/agendar">Agendar consulta</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
