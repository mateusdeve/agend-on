import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 -z-10" />
      <div
        className="absolute inset-0 -z-20 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-10"
        aria-hidden="true"
      />
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Cuidando da sua saúde com excelência
            </h1>
            <p className="text-xl text-muted-foreground">
              Agende sua consulta online de forma rápida e fácil com os melhores especialistas da região.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild size="lg" className="text-base">
                <Link href="/agendar">Agende sua consulta</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base">
                <Link href="/especialidades">Nossas especialidades</Link>
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-xl">
              <img
                src="/placeholder.svg?height=800&width=1000"
                alt="Médicos da clínica"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-background rounded-lg p-6 shadow-lg max-w-xs">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">Atendimento humanizado</h3>
              </div>
              <p className="text-muted-foreground">
                Nossa equipe é treinada para oferecer um atendimento acolhedor e personalizado.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
