import type React from "react"
import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { PatientSidebar } from "@/components/patient/patient-sidebar"

export default async function PatientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Se não estiver autenticado, redirecionar para a página de login
  if (!session) {
    redirect("/login")
  }

  // Verificar se o usuário tem um perfil de paciente
  const { data: patient, error } = await supabase.from("patients").select("*").eq("id", session.user.id).single()

  // Se não tiver perfil, criar um
  if (error || !patient) {
    try {
      // Criar perfil básico
      await supabase.from("patients").insert({
        id: session.user.id,
        name: session.user.user_metadata.name || "Paciente",
        email: session.user.email || "",
      })
    } catch (err) {
      console.error("Erro ao criar perfil de paciente:", err)
    }
  }

  return (
    <div className="container py-6 md:py-10">
      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
        <aside className="hidden md:block border rounded-lg p-4 h-fit">
          <PatientSidebar />
        </aside>
        <main>{children}</main>
      </div>
    </div>
  )
}
