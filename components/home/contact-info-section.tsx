import { Phone, Mail, MapPin, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function ContactInfoSection() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold mb-6">Entre em contato</h2>
            <p className="text-muted-foreground text-lg mb-8">
              Estamos à disposição para esclarecer suas dúvidas e ajudar no que for preciso. Entre em contato conosco
              pelos canais abaixo.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Endereço</h3>
                  <p className="text-muted-foreground">
                    Av. Paulista, 1000 - Bela Vista
                    <br />
                    São Paulo - SP, 01310-100
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Telefone</h3>
                  <p className="text-muted-foreground">(11) 9999-9999</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">E-mail</h3>
                  <p className="text-muted-foreground">contato@healthclinic.com.br</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Horário de funcionamento</h3>
                  <p className="text-muted-foreground">
                    Segunda a Sexta: 8h às 20h
                    <br />
                    Sábado: 8h às 14h
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Button asChild size="lg">
                <Link href="/contato">Fale conosco</Link>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-lg overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.0976951624297!2d-46.65390508502164!3d-23.563273284681532!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c8da0aa315%3A0xd59f9431f2c9776a!2sAv.%20Paulista%20-%20Bela%20Vista%2C%20S%C3%A3o%20Paulo%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1651271396695!5m2!1spt-BR!2sbr"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização da clínica"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
