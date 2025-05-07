"use client"

import type React from "react"

import { useState } from "react"
import { createClientSupabaseClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

interface AuthFormProps {
  redirectUrl?: string
}

export function AuthForm({ redirectUrl }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const supabase = createClientSupabaseClient()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        toast({
          title: "Erro ao fazer login",
          description: error.message,
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      toast({
        title: "Login realizado com sucesso",
        description: "Você será redirecionado.",
      })

      // Redirecionar para a URL especificada ou para a área do paciente
      window.location.href = redirectUrl || "/paciente"
    } catch (error: any) {
      toast({
        title: "Erro ao fazer login",
        description: "Ocorreu um erro inesperado. Tente novamente mais tarde.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Criar o usuário no Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      })

      if (authError) {
        toast({
          title: "Erro ao criar conta",
          description: authError.message,
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      if (authData.user) {
        // Criar registro na tabela de pacientes
        const { error: profileError } = await supabase.from("patients").insert({
          id: authData.user.id,
          name,
          email,
          phone: phone || null,
        })

        if (profileError) {
          console.error("Erro ao criar perfil:", profileError)
          toast({
            title: "Erro ao criar perfil",
            description: "Ocorreu um erro ao criar seu perfil. Por favor, tente novamente mais tarde.",
            variant: "destructive",
          })
          setIsLoading(false)
          return
        }

        toast({
          title: "Conta criada com sucesso",
          description: "Você será redirecionado.",
        })

        // Redirecionar para a URL especificada ou para a área do paciente
        window.location.href = redirectUrl || "/paciente"
      }
    } catch (error: any) {
      console.error("Erro ao criar conta:", error)
      toast({
        title: "Erro ao criar conta",
        description: "Ocorreu um erro inesperado. Tente novamente mais tarde.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <Tabs defaultValue="login" className="w-full max-w-md">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="register">Cadastro</TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <form onSubmit={handleSignIn} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Senha</Label>
              <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                Esqueceu a senha?
              </Button>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </Button>
        </form>
      </TabsContent>
      <TabsContent value="register">
        <form onSubmit={handleSignUp} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome completo</Label>
            <Input
              id="name"
              type="text"
              placeholder="Seu nome completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="register-email">E-mail</Label>
            <Input
              id="register-email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(11) 99999-9999"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="register-password">Senha</Label>
            <Input
              id="register-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Criando conta...
              </>
            ) : (
              "Criar conta"
            )}
          </Button>
        </form>
      </TabsContent>
    </Tabs>
  )
}
