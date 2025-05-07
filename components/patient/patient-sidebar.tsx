"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calendar, User, FileText, Settings, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { createClientSupabaseClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

export function PatientSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClientSupabaseClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    toast({
      title: "Logout realizado com sucesso",
      description: "Você foi desconectado da sua conta.",
    })
    router.push("/")
    router.refresh()
  }

  const links = [
    {
      href: "/paciente",
      label: "Dashboard",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      href: "/paciente/agendamentos",
      label: "Meus agendamentos",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      href: "/paciente/perfil",
      label: "Meu perfil",
      icon: <User className="h-5 w-5" />,
    },
    {
      href: "/paciente/historico",
      label: "Histórico médico",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      href: "/paciente/configuracoes",
      label: "Configurações",
      icon: <Settings className="h-5 w-5" />,
    },
  ]

  return (
    <div className="flex flex-col h-full">
      <div className="space-y-1 py-2">
        {links.map((link) => (
          <Button
            key={link.href}
            asChild
            variant="ghost"
            className={cn("w-full justify-start", pathname === link.href && "bg-muted")}
          >
            <Link href={link.href}>
              {link.icon}
              <span className="ml-2">{link.label}</span>
            </Link>
          </Button>
        ))}
      </div>
      <div className="mt-auto py-2">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
          onClick={handleSignOut}
        >
          <LogOut className="h-5 w-5" />
          <span className="ml-2">Sair</span>
        </Button>
      </div>
    </div>
  )
}
