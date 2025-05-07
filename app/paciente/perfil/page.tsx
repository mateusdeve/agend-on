"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClientSupabaseClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [patient, setPatient] = useState<any>(null)
  const supabase = createClientSupabaseClient()

  useEffect(() => {
    async function fetchPatient() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) return

        const { data, error } = await supabase.from("patients").select("*").eq("id", user.id).single()

        if (error) throw error

        setPatient(data)
      } catch (error) {
        console.error("Erro ao buscar dados do paciente:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPatient()
  }, [supabase])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setPatient({ ...patient, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const { error } = await supabase
        .from("patients")
        .update({
          name: patient.name,
          phone: patient.phone,
          birth_date: patient.birth_date,
          address: patient.address,
        })
        .eq("id", patient.id)

      if (error) throw error

      toast({
        title: "Perfil atualizado com sucesso",
        description: "Suas informações foram atualizadas.",
      })
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar perfil",
        description: error.message || "Ocorreu um erro ao atualizar suas informações. Tente novamente mais tarde.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Meu perfil</h1>
        <p className="text-muted-foreground">Atualize suas informações pessoais</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nome completo</Label>
            <Input id="name" name="name" value={patient?.name || ""} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" name="email" value={patient?.email || ""} disabled readOnly />
            <p className="text-xs text-muted-foreground">O e-mail não pode ser alterado.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input id="phone" name="phone" value={patient?.phone || ""} onChange={handleChange} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="birth_date">Data de nascimento</Label>
            <Input
              id="birth_date"
              name="birth_date"
              type="date"
              value={patient?.birth_date || ""}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="address">Endereço</Label>
            <Textarea id="address" name="address" value={patient?.address || ""} onChange={handleChange} rows={3} />
          </div>
        </div>

        <Button type="submit" disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            "Salvar alterações"
          )}
        </Button>
      </form>
    </div>
  )
}
