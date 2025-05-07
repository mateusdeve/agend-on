import Link from "next/link"
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-muted/40">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">HealthClinic</h3>
            <p className="text-muted-foreground mb-4">
              Cuidando da sua saúde com excelência e dedicação. Nossa missão é proporcionar o melhor atendimento médico
              com profissionais qualificados.
            </p>
            <div className="flex space-x-4">
              <Link href="https://facebook.com" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="https://instagram.com" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="https://twitter.com" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/agendar" className="text-muted-foreground hover:text-primary">
                  Agende sua consulta
                </Link>
              </li>
              <li>
                <Link href="/sobre" className="text-muted-foreground hover:text-primary">
                  Sobre nós
                </Link>
              </li>
              <li>
                <Link href="/especialidades" className="text-muted-foreground hover:text-primary">
                  Especialidades
                </Link>
              </li>
              <li>
                <Link href="/contato" className="text-muted-foreground hover:text-primary">
                  Contate-nos
                </Link>
              </li>
              <li>
                <Link href="/paciente" className="text-muted-foreground hover:text-primary">
                  Área do Paciente
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-muted-foreground">
                  Av. Paulista, 1000 - Bela Vista, São Paulo - SP, 01310-100
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">(11) 9999-9999</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">contato@healthclinic.com.br</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-muted-foreground">
                  Segunda a Sexta: 8h às 20h
                  <br />
                  Sábado: 8h às 14h
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} HealthClinic. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
