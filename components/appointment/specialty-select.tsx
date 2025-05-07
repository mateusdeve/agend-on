"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn, formatCurrency } from "@/lib/utils"
import { createClientSupabaseClient } from "@/lib/supabase/client"

interface Specialty {
  id: string
  name: string
  price: number
}

interface SpecialtySelectProps {
  onSelectSpecialty: (specialty: Specialty | null) => void
  selectedSpecialty: Specialty | null
}

export function SpecialtySelect({ onSelectSpecialty, selectedSpecialty }: SpecialtySelectProps) {
  const [open, setOpen] = useState(false)
  const [specialties, setSpecialties] = useState<Specialty[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientSupabaseClient()

  useEffect(() => {
    async function fetchSpecialties() {
      try {
        // Buscar especialidades incluindo o preço
        const { data, error } = await supabase.from("specialties").select("id, name, price").order("name")

        if (error) {
          console.error("Erro ao buscar especialidades:", error)
          return
        }

        setSpecialties(data || [])
      } catch (error) {
        console.error("Erro ao buscar especialidades:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSpecialties()
  }, [supabase])

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Especialidade</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={loading}
          >
            {loading
              ? "Carregando especialidades..."
              : selectedSpecialty
                ? selectedSpecialty.name
                : "Selecione uma especialidade"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Buscar especialidade..." />
            <CommandList>
              <CommandEmpty>Nenhuma especialidade encontrada.</CommandEmpty>
              <CommandGroup>
                {specialties.map((specialty) => (
                  <CommandItem
                    key={specialty.id}
                    value={specialty.name}
                    onSelect={() => {
                      onSelectSpecialty(specialty.id === selectedSpecialty?.id ? null : specialty)
                      setOpen(false)
                    }}
                  >
                    <div className="flex justify-between w-full items-center">
                      <div className="flex items-center">
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedSpecialty?.id === specialty.id ? "opacity-100" : "opacity-0",
                          )}
                        />
                        {specialty.name}
                      </div>
                      <span className="text-sm font-medium text-primary">
                        {specialty.price ? formatCurrency(specialty.price) : "Preço não definido"}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
