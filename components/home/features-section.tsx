import { Clock, Calendar, UserCheck, Shield } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: <Calendar className="h-10 w-10 text-primary" />,
      title: "Agendamento Online",
      description:
        "Marque suas consultas a qualquer momento, de forma rápida e prática, sem precisar ligar para a clínica.",
    },
    {
      icon: <Clock className="h-10 w-10 text-primary" />,
      title: "Horários Flexíveis",
      description: "Oferecemos horários estendidos para atender às necessidades de todos os nossos pacientes.",
    },
    {
      icon: <UserCheck className="h-10 w-10 text-primary" />,
      title: "Especialistas Qualificados",
      description: "Nossa equipe é formada por médicos especialistas com vasta experiência em suas áreas de atuação.",
    },
    {
      icon: <Shield className="h-10 w-10 text-primary" />,
      title: "Segurança e Privacidade",
      description:
        "Seus dados são protegidos com os mais altos padrões de segurança e privacidade, em conformidade com a LGPD.",
    },
  ]

  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Por que escolher nossa clínica?</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Oferecemos serviços de saúde de alta qualidade com foco no bem-estar e na satisfação dos nossos pacientes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-background rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
