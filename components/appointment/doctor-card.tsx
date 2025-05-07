"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Doctor {
  id: string
  name: string
  specialty: string
  image: string
  rating: number
  available: boolean
}

interface DoctorCardProps {
  doctor: Doctor
  isSelected: boolean
  onSelect: (doctorId: string) => void
}

export function DoctorCard({ doctor, isSelected, onSelect }: DoctorCardProps) {
  return (
    <Card className={cn("overflow-hidden transition-all", isSelected && "ring-2 ring-primary")}>
      <CardContent className="p-0">
        <div className="aspect-[3/2] relative">
          <img
            src={doctor.image || "/placeholder.svg?height=300&width=400"}
            alt={doctor.name}
            className="w-full h-full object-cover"
          />
          {!doctor.available && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <span className="text-sm font-medium text-muted-foreground">Indisponível</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold truncate">{doctor.name}</h3>
          <p className="text-sm text-muted-foreground mb-3">{doctor.specialty}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill={i < doctor.rating ? "currentColor" : "none"}
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={i < doctor.rating ? "text-yellow-500" : "text-muted"}
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
              </div>
              <span className="text-xs text-muted-foreground ml-1">({doctor.rating.toFixed(1)})</span>
            </div>
            <Button
              size="sm"
              variant={isSelected ? "default" : "outline"}
              onClick={() => onSelect(doctor.id)}
              disabled={!doctor.available}
            >
              {isSelected ? "Selecionado" : "Selecionar"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
