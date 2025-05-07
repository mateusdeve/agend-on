import { createServerSupabaseClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default async function SpecialtiesPage() {
  const supabase = createServerSupabaseClient()

  const { data: specialties } = await supabase.from("specialties").select("*").order("name")

  // Dados de exemplo para especialidades
  const specialtiesData = specialties || [
    {
      id: "1",
      name: "Clínica Geral",
      description: "Atendimento médico para diagnóstico e tratamento de doenças comuns.",
    },
    {
      id: "2",
      name: "Cardiologia",
      description: "Especialidade médica que trata das doenças relacionadas ao coração e ao sistema circulatório.",
    },
    {
      id: "3",
      name: "Dermatologia",
      description: "Especialidade médica que trata das doenças relacionadas à pele, cabelos e unhas.",
    },
    {
      id: "4",
      name: "Ortopedia",
      description:
        "Especialidade médica que trata das doenças e lesões nos ossos, músculos, articulações e ligamentos.",
    },
    {
      id: "5",
      name: "Pediatria",
      description: "Especialidade médica dedicada à assistência à criança e ao adolescente.",
    },
    {
      id: "6",
      name: "Ginecologia",
      description: "Especialidade médica que trata da saúde do sistema reprodutor feminino.",
    },
  ]

  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Nossas Especialidades</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Oferecemos uma ampla gama de especialidades médicas para cuidar da sua saúde com excelência e
          profissionalismo.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {specialtiesData.map((specialty) => (
          <Card key={specialty.id}>
            <CardHeader>
              <CardTitle>{specialty.name}</CardTitle>
              <CardDescription>{specialty.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-md overflow-hidden">
                <img
                  src={`/placeholder.svg?height=300&width=600&text=${encodeURIComponent(specialty.name)}`}
                  alt={specialty.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={`/agendar?specialty=${specialty.id}`}>Agendar consulta</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
