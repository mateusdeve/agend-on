"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TimeSlot {
  id: string
  time: string
  available: boolean
}

interface TimeSlotsProps {
  slots: TimeSlot[]
  selectedSlot: string | null
  onSelectSlot: (slotId: string) => void
}

export function TimeSlots({ slots, selectedSlot, onSelectSlot }: TimeSlotsProps) {
  if (slots.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Selecione uma data para ver os horários disponíveis.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Horários disponíveis</h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {slots.map((slot) => (
          <Button
            key={slot.id}
            variant="outline"
            className={cn(
              "h-auto py-2",
              selectedSlot === slot.id && "border-primary bg-primary/10",
              !slot.available && "opacity-50 cursor-not-allowed hover:bg-transparent",
            )}
            disabled={!slot.available}
            onClick={() => onSelectSlot(slot.id)}
          >
            {slot.time}
          </Button>
        ))}
      </div>
    </div>
  )
}
