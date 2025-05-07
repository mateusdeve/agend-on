"use client"

import { useState } from "react"
import { format, addDays, startOfWeek, addWeeks, subWeeks, isSameDay } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CalendarProps {
  onSelectDate: (date: Date) => void
  selectedDate: Date | null
  disabledDates?: Date[]
}

export function Calendar({ onSelectDate, selectedDate, disabledDates = [] }: CalendarProps) {
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date(), { weekStartsOn: 0 }))

  const nextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1))
  }

  const prevWeek = () => {
    setCurrentWeek(subWeeks(currentWeek, 1))
  }

  const isDateDisabled = (date: Date) => {
    // Verifica se a data está no passado
    if (date < new Date(new Date().setHours(0, 0, 0, 0))) {
      return true
    }

    // Verifica se a data está na lista de datas desabilitadas
    return disabledDates.some((disabledDate) => isSameDay(disabledDate, date))
  }

  const weekDays = [...Array(7)].map((_, i) => {
    const date = addDays(currentWeek, i)
    const isDisabled = isDateDisabled(date)
    const isSelected = selectedDate ? isSameDay(date, selectedDate) : false

    return (
      <Button
        key={i}
        variant="outline"
        className={cn(
          "flex flex-col h-auto py-3 px-2 hover:bg-primary/10",
          isSelected && "border-primary bg-primary/10",
          isDisabled && "opacity-50 cursor-not-allowed hover:bg-transparent",
        )}
        disabled={isDisabled}
        onClick={() => onSelectDate(date)}
      >
        <span className="text-xs font-medium">{format(date, "EEE", { locale: ptBR })}</span>
        <span className={cn("text-2xl font-bold", isSelected && "text-primary")}>{format(date, "dd")}</span>
        <span className="text-xs text-muted-foreground">{format(date, "MMM", { locale: ptBR })}</span>
      </Button>
    )
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Selecione uma data</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={prevWeek}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Semana anterior</span>
          </Button>
          <Button variant="outline" size="icon" onClick={nextWeek}>
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Próxima semana</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">{weekDays}</div>
    </div>
  )
}
