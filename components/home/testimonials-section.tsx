import { Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Ana Silva",
      image: "/placeholder.svg?height=100&width=100",
      rating: 5,
      text: "Excelente atendimento! Consegui agendar minha consulta rapidamente e o médico foi muito atencioso. Recomendo a todos.",
    },
    {
      name: "Carlos Oliveira",
      image: "/placeholder.svg?height=100&width=100",
      rating: 5,
      text: "A clínica tem uma estrutura moderna e confortável. O sistema de agendamento online é muito prático e facilitou muito minha vida.",
    },
    {
      name: "Mariana Santos",
      image: "/placeholder.svg?height=100&width=100",
      rating: 4,
      text: "Profissionais muito qualificados e atenciosos. O atendimento foi rápido e eficiente. Voltarei com certeza!",
    },
  ]

  return (
    <section className="py-16">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">O que nossos pacientes dizem</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A satisfação dos nossos pacientes é nossa prioridade. Confira alguns depoimentos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-full overflow-hidden">
                    <img
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <div className="flex">
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < testimonial.rating ? "text-yellow-500 fill-yellow-500" : "text-muted"}`}
                          />
                        ))}
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground">{testimonial.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
