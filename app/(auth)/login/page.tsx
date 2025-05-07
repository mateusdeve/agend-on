import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { AuthForm } from "@/components/auth/auth-form"

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: { redirect?: string }
}) {
  const supabase = createServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Se já estiver autenticado, redirecionar para a área do paciente
  if (session) {
    redirect(searchParams?.redirect || "/paciente")
  }

  return (
    <div className="container py-12">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Área do Paciente</h1>
          <p className="text-muted-foreground mt-2">Faça login ou crie uma conta para acessar sua área do paciente</p>
        </div>

        <AuthForm redirectUrl={searchParams?.redirect} />
      </div>
    </div>
  )
}
