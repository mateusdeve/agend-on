"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { createClientSupabaseClient } from "@/lib/supabase/client";
import { PaymentForm } from "@/components/payment/payment-form";
import { parseISO } from "date-fns";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "@/components/ui/use-toast";

export default function PaymentPage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true);
  const [appointment, setAppointment] = useState<any>(null);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const router = useRouter();
  const supabase = createClientSupabaseClient();
  const { id } = params;
  useEffect(() => {
    async function fetchAppointment() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          router.push("/login?redirect=/agendar/pagamento/" + params.id);
          return;
        }

        const { data, error } = await supabase
          .from("appointments")
          .select(
            `
            id,
            appointment_date,
            start_time,
            end_time,
            status,
            notes,
            doctor:doctors(id, name),
            specialty:specialties(id, name, price),
            patient:patients(id, name, email)
          `
          )
          .eq("id", params.id)
          .single();

        if (error) throw error;

        if (!data) {
          toast({
            title: "Agendamento não encontrado",
            description: "O agendamento solicitado não foi encontrado.",
            variant: "destructive",
          });
          router.push("/paciente/agendamentos");
          return;
        }

        if (data.status !== "pending_payment") {
          toast({
            title: "Pagamento já realizado",
            description: "Este agendamento já foi pago ou cancelado.",
          });
          router.push("/paciente/agendamentos");
          return;
        }

        if (data.patient.id !== session.user.id) {
          toast({
            title: "Acesso negado",
            description:
              "Você não tem permissão para acessar este agendamento.",
            variant: "destructive",
          });
          router.push("/paciente/agendamentos");
          return;
        }

        setAppointment(data);
      } catch (error) {
        console.error("Erro ao buscar agendamento:", error);
        toast({
          title: "Erro ao carregar agendamento",
          description: "Ocorreu um erro ao carregar os dados do agendamento.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchAppointment();
  }, [id, router, supabase]);

  const handlePaymentComplete = async (paymentId: string) => {
    if (!appointment) return;

    setLoading(true);

    try {
      // Atualizar o status do agendamento para "scheduled"
      const { error } = await supabase
        .from("appointments")
        .update({ status: "scheduled" })
        .eq("id", appointment.id);

      if (error) throw error;

      setPaymentComplete(true);

      toast({
        title: "Agendamento confirmado!",
        description:
          "Seu agendamento foi confirmado com sucesso após o pagamento.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao confirmar agendamento",
        description:
          error.message ||
          "Ocorreu um erro ao confirmar seu agendamento. Entre em contato com o suporte.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-12 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Agendamento não encontrado</h1>
        <p className="text-muted-foreground mb-6">
          O agendamento solicitado não foi encontrado ou você não tem permissão
          para acessá-lo.
        </p>
        <Button asChild>
          <Link href="/paciente/agendamentos">Ver meus agendamentos</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <h1 className="text-2xl font-bold mb-8">Pagamento de Consulta</h1>

      <div className="max-w-2xl mx-auto">
        {paymentComplete ? (
          <div className="text-center py-12 space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold">Pagamento confirmado!</h2>
            <p className="text-muted-foreground">
              Seu agendamento foi confirmado com sucesso.
            </p>
            <div className="pt-4">
              <Button asChild>
                <Link href="/paciente/agendamentos">Ver meus agendamentos</Link>
              </Button>
            </div>
          </div>
        ) : (
          <PaymentForm
            appointmentId={appointment.id}
            appointmentData={{
              doctorId: appointment.doctor.id,
              specialtyId: appointment.specialty.id,
              specialtyName: appointment.specialty.name,
              specialtyPrice: appointment.specialty.price,
              date: parseISO(appointment.appointment_date),
              time: `${appointment.start_time} - ${appointment.end_time}`,
              patientName: appointment.patient.name,
              patientEmail: appointment.patient.email,
              notes: appointment.notes,
            }}
            onPaymentComplete={handlePaymentComplete}
          />
        )}
      </div>
    </div>
  );
}
