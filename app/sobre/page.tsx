import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export default function AboutPage() {
  const values = [
    {
      title: "Excelência",
      description: "Buscamos a excelência em tudo o que fazemos, desde o atendimento até os procedimentos médicos.",
    },
    {
      title: "Humanização",
      description: "Tratamos cada paciente com respeito, empatia e atenção individualizada.",
    },
    {
      title: "Inovação",
      description: "Investimos em tecnologia e métodos inovadores para oferecer o melhor tratamento possível.",
    },
    {
      title: "Ética",
      description: "Seguimos os mais altos padrões éticos em todas as nossas práticas médicas e administrativas.",
    },
  ]

  const team = [
    {
      name: "Dr. Carlos Silva",
      role: "Diretor Clínico",
      image: "/placeholder.svg?height=400&width=400",
      description: "Cardiologista com mais de 20 anos de experiência, formado pela USP com especialização em Harvard.",
    },
    {
      name: "Dra. Ana Oliveira",
      role: "Diretora Médica",
      image: "/placeholder.svg?height=400&width=400",
      description:
        "Clínica geral com especialização em gestão de saúde, responsável pela qualidade dos serviços médicos.",
    },
    {
      name: "Dr. Roberto Santos",
      role: "Coordenador de Especialidades",
      image: "/placeholder.svg?height=400&width=400",
      description: "Ortopedista com vasta experiência em gestão de equipes médicas multidisciplinares.",
    },
  ]

  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Sobre a HealthClinic</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Conheça nossa história, valores e a equipe que faz da HealthClinic referência em saúde.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h2 className="text-2xl font-bold mb-4">Nossa História</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Fundada em 2010, a HealthClinic nasceu do sonho de um grupo de médicos que acreditavam que o atendimento
              médico de qualidade deveria ser acessível a todos.
            </p>
            <p>
              Começamos com apenas 5 especialidades e hoje contamos com mais de 20 especialidades médicas, atendendo
              milhares de pacientes mensalmente.
            </p>
            <p>
              Nossa missão é proporcionar um atendimento humanizado e de excelência, utilizando tecnologia de ponta e
              profissionais altamente qualificados.
            </p>
            <p>
              Ao longo dos anos, nos tornamos referência em saúde na região, sendo reconhecidos pela qualidade do nosso
              atendimento e pela satisfação dos nossos pacientes.
            </p>
          </div>
        </div>
        <div className="relative">
          <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-xl">
            <img
              src="/placeholder.svg?height=800&width=1000"
              alt="Fachada da clínica"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -right-6 bg-background rounded-lg p-6 shadow-lg max-w-xs">
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
                  <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0"></path>
                  <path d="M12 8v8"></path>
                  <path d="M8 12h8"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Desde 2010</h3>
            </div>
            <p className="text-muted-foreground">
              Mais de uma década dedicada à saúde e bem-estar dos nossos pacientes.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-8 text-center">Nossos Valores</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{value.title}</h3>
                </div>
                <p className="text-muted-foreground">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-8 text-center">Nossa Equipe</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <div key={index} className="text-center">
              <div className="aspect-square rounded-full overflow-hidden w-48 h-48 mx-auto mb-4">
                <img
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold">{member.name}</h3>
              <p className="text-primary font-medium mb-2">{member.role}</p>
              <p className="text-muted-foreground">{member.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
