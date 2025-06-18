"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { createClientSupabaseClient } from "@/lib/supabase/client";
import { Calendar } from "@/components/appointment/calendar";
import { TimeSlots } from "@/components/appointment/time-slots";
import { DoctorCard } from "@/components/appointment/doctor-card";
import { SpecialtySelect } from "@/components/appointment/specialty-select";
import { PaymentForm } from "@/components/payment/payment-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

export default function AppointmentPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("specialty");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState<{
    id: string;
    name: string;
    price: number;
  } | null>(null);
  const [timeSlots, setTimeSlots] = useState<
    { id: string; time: string; available: boolean }[]
  >([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [patientInfo, setPatientInfo] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [appointmentId, setAppointmentId] = useState<string | null>(null);
  const [paymentComplete, setPaymentComplete] = useState(false);

  const supabase = createClientSupabaseClient();

  // Verificar se o usuário está autenticado
  useEffect(() => {
    async function checkAuth() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        // Buscar informações do paciente
        const { data: patient, error } = await supabase
          .from("patients")
          .select("name, email, phone")
          .eq("id", session.user.id)
          .single();

        if (error) {
          console.error("Erro ao buscar informações do paciente:", error);
          return;
        }

        if (patient) {
          setPatientInfo({
            ...patientInfo,
            name: patient.name,
            email: patient.email,
            phone: patient.phone || "",
          });
        }
      }
    }

    checkAuth();
  }, [activeTab]); // Adicionar activeTab como dependência para recarregar quando a aba mudar

  // Buscar médicos quando a especialidade for selecionada
  useEffect(() => {
    async function fetchDoctors() {
      if (!selectedSpecialty) {
        setDoctors([]);
        return;
      }

      setLoading(true);

      try {
        const { data, error } = await supabase
          .from("doctors")
          .select(
            `
            id,
            name,
            image_url,
            available,
            specialty:specialties(name)
          `
          )
          .eq("specialty_id", selectedSpecialty.id)
          .eq("available", true);

        if (error) {
          throw error;
        }

        // Transformar os dados para o formato esperado pelo componente
        const formattedDoctors = data.map((doctor) => ({
          id: doctor.id,
          name: doctor.name,
          specialty: doctor.specialty?.name || selectedSpecialty.name,
          image: doctor.image_url || "/placeholder.svg?height=300&width=400",
          rating: 4.5, // Valor fixo para exemplo
          available: doctor.available,
        }));

        setDoctors(formattedDoctors);
      } catch (error) {
        console.error("Erro ao buscar médicos:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDoctors();
  }, [selectedSpecialty, supabase]);

  // Gerar horários disponíveis quando a data for selecionada
  // useEffect(() => {
  //   if (!selectedDate || !selectedDoctor) {
  //     setTimeSlots([]);
  //     setSelectedSlot(null);
  //     return;
  //   }

  //   const dayOfWeek = selectedDate.getDay();
  //   const availableSlots = [
  //     { id: "1", time: "08:00 - 09:00", available: true },
  //     { id: "2", time: "09:00 - 10:00", available: true },
  //     { id: "3", time: "10:00 - 11:00", available: false },
  //     { id: "4", time: "11:00 - 12:00", available: false },
  //     { id: "5", time: "14:00 - 15:00", available: true },
  //     { id: "6", time: "15:00 - 16:00", available: true },
  //     { id: "7", time: "16:00 - 17:00", available: false },
  //     { id: "8", time: "17:00 - 18:00", available: true },
  //   ];

  //   async function filterAvailableSlots() {
  //     try {
  //       const { data, error } = await supabase
  //         .from("doctor_availability")
  //         .select(
  //           `
  //           id,
  //           doctor_id,
  //           day_of_week,
  //           start_time,
  //           end_time
  //         `
  //         )
  //         .eq("doctor_id", selectedDoctor)
  //         .eq("day_of_week", dayOfWeek);

  //       console.log("data --------------->", data);
  //     } catch (e) {
  //       console.log("ERROR", e);
  //     }
  //   }

  //   filterAvailableSlots();

  //   setTimeSlots(availableSlots);
  // }, [selectedDate, selectedDoctor]);

  useEffect(() => {
    if (!selectedDate || !selectedDoctor) {
      setTimeSlots([]);
      setSelectedSlot(null);
      return;
    }

    const dayOfWeek = selectedDate.getDay(); // 0 = domingo, 1 = segunda...

    async function loadAvailableSlots() {
      try {
        // 1️⃣ Buscar a disponibilidade do médico
        const { data: availability, error: availabilityError } = await supabase
          .from("doctor_availability")
          .select(
            `
          start_time, end_time
        `
          )
          .eq("doctor_id", selectedDoctor)
          .eq("day_of_week", dayOfWeek);

        if (availabilityError || !availability.length) {
          console.error(
            "Erro ou disponibilidade não encontrada",
            availabilityError
          );
          setTimeSlots([]); // médico não atende nesse dia
          return;
        }

        const { start_time, end_time } = availability[0];

        // 2️⃣ Buscar agendamentos já feitos para esse dia
        const formattedDate =
          selectedDate && selectedDate.toISOString().split("T")[0]; // YYYY-MM-DD

        const { data: appointments, error: appointmentsError } = await supabase
          .from("appointments")
          .select(`start_time, end_time`)
          .eq("doctor_id", selectedDoctor)
          .eq("appointment_date", formattedDate);

        if (appointmentsError) {
          console.error("Erro ao buscar agendamentos", appointmentsError);
          setTimeSlots([]);
          return;
        }

        // 3️⃣ Slots fixos da interface
        const slots = [
          { id: "1", time: "08:00 - 09:00" },
          { id: "2", time: "09:00 - 10:00" },
          { id: "3", time: "10:00 - 11:00" },
          { id: "4", time: "11:00 - 12:00" },
          { id: "5", time: "14:00 - 15:00" },
          { id: "6", time: "15:00 - 16:00" },
          { id: "7", time: "16:00 - 17:00" },
          { id: "8", time: "17:00 - 18:00" },
        ];

        const startMinutes = toMinutes(start_time);
        const endMinutes = toMinutes(end_time);

        // 4️⃣ Montar os slots com "available"
        const availableSlots = slots.map((slot) => {
          const [slotStartStr, slotEndStr] = slot.time.split(" - ");
          const slotStart = toMinutes(slotStartStr);
          const slotEnd = toMinutes(slotEndStr);

          const isWithinAvailability =
            slotStart >= startMinutes && slotEnd <= endMinutes;

          const isBooked = appointments.some((appt) => {
            const apptStart = toMinutes(appt.start_time);
            const apptEnd = toMinutes(appt.end_time);

            return slotStart === apptStart && slotEnd === apptEnd;
          });

          return {
            ...slot,
            available: isWithinAvailability && !isBooked,
          };
        });

        setTimeSlots(availableSlots);
      } catch (e) {
        console.log("ERROR", e);
        setTimeSlots([]);
      }
    }

    loadAvailableSlots();
  }, [selectedDate, selectedDoctor]);

  function toMinutes(timeStr: any) {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  }

  const handleSelectDoctor = (doctorId: string) => {
    setSelectedDoctor(doctorId === selectedDoctor ? null : doctorId);
    setSelectedSlot(null);
  };

  // In the handleSelectSpecialty function, ensure we handle missing price
  const handleSelectSpecialty = (
    specialty: { id: string; name: string; price: number } | null
  ) => {
    setSelectedSpecialty(specialty);
    setSelectedDoctor(null);
    setSelectedSlot(null);
  };

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleSelectSlot = (slotId: string) => {
    setSelectedSlot(slotId);
  };

  const handlePatientInfoChange = (info: Partial<typeof patientInfo>) => {
    setPatientInfo({ ...patientInfo, ...info });
  };

  const handleCreateAppointment = async () => {
    if (
      !selectedDate ||
      !selectedSlot ||
      !selectedDoctor ||
      !selectedSpecialty
    ) {
      toast({
        title: "Erro ao agendar consulta",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      console.log("data ----------------->", session);

      if (!session) {
        toast({
          title: "Login necessário",
          description: "Você precisa fazer login para concluir o agendamento.",
        });

        router.push("/login?redirect=/agendar");
        return;
      }

      // Obter informações do slot selecionado
      const selectedTimeSlot = timeSlots.find(
        (slot) => slot.id === selectedSlot
      );
      const [startTime, endTime] = selectedTimeSlot
        ? selectedTimeSlot.time.split(" - ")
        : ["08:00", "09:00"];

      // Criar o agendamento com status "pending_payment"
      const { data: appointment, error } = await supabase
        .from("appointments")
        .insert({
          patient_id: session.user.id,
          doctor_id: selectedDoctor,
          specialty_id: selectedSpecialty.id,
          appointment_date: format(selectedDate, "yyyy-MM-dd"),
          start_time: startTime,
          end_time: endTime,
          status: "pending_payment", // Novo status para indicar pagamento pendente
          notes: patientInfo.notes || null,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      setAppointmentId(appointment.id);
      console.log("appointmentId ------------------>", appointment);
      setActiveTab("payment");
    } catch (error: any) {
      toast({
        title: "Erro ao agendar consulta",
        description:
          error.message ||
          "Ocorreu um erro ao agendar sua consulta. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentComplete = async (paymentId: string) => {
    if (!appointmentId) return;

    setLoading(true);

    try {
      // Atualizar o status do agendamento para "scheduled"
      const { error } = await supabase
        .from("appointments")
        .update({ status: "scheduled" })
        .eq("id", appointmentId);

      if (error) throw error;

      setPaymentComplete(true);

      toast({
        title: "Agendamento confirmado!",
        description:
          "Seu agendamento foi confirmado com sucesso após o pagamento.",
      });

      // Redirecionar para a página de agendamentos
      setTimeout(() => {
        router.push("/paciente/agendamentos");
      }, 2000);
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

  const handleNextTab = () => {
    if (activeTab === "specialty" && selectedSpecialty) {
      setActiveTab("doctor");
    } else if (activeTab === "doctor" && selectedDoctor) {
      setActiveTab("datetime");
    } else if (activeTab === "datetime" && selectedDate && selectedSlot) {
      checkAuthAndProceed();
    } else if (activeTab === "confirmation") {
      handleCreateAppointment();
    }
  };

  const checkAuthAndProceed = async () => {
    // Verificar se o usuário está autenticado
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error("Erro ao obter sessão:", error);
      toast({
        title: "Erro de autenticação",
        description:
          "Ocorreu um erro ao verificar sua sessão. Tente novamente.",
        variant: "destructive",
      });
      return;
    }

    if (!session) {
      // Salvar dados do agendamento no localStorage
      localStorage.setItem(
        "pendingAppointment",
        JSON.stringify({
          specialtyId: selectedSpecialty?.id,
          specialtyName: selectedSpecialty?.name,
          specialtyPrice: selectedSpecialty?.price,
          doctorId: selectedDoctor,
          doctorName: doctors.find((d) => d.id === selectedDoctor)?.name,
          date: selectedDate?.toISOString(),
          slotId: selectedSlot,
          slotTime: selectedSlotTime,
        })
      );

      // Redirecionar para a página de login
      toast({
        title: "Login necessário",
        description: "Você precisa fazer login para continuar o agendamento.",
      });

      router.push(`/login?redirect=${encodeURIComponent("/agendar")}`);
      return;
    }

    // Se estiver autenticado, prosseguir para a etapa de confirmação
    setActiveTab("confirmation");
  };

  const handlePrevTab = () => {
    if (activeTab === "payment") {
      setActiveTab("confirmation");
    } else if (activeTab === "confirmation") {
      setActiveTab("datetime");
    } else if (activeTab === "datetime") {
      setActiveTab("doctor");
    } else if (activeTab === "doctor") {
      setActiveTab("specialty");
    }
  };

  const selectedSlotTime = selectedSlot
    ? timeSlots.find((slot) => slot.id === selectedSlot)?.time
    : undefined;

  // Adicione este useEffect após os outros useEffects
  useEffect(() => {
    // Verificar se há um agendamento pendente no localStorage
    const pendingAppointment = localStorage.getItem("pendingAppointment");

    if (pendingAppointment) {
      try {
        const appointmentData = JSON.parse(pendingAppointment);

        // Restaurar os dados do agendamento
        if (appointmentData.specialtyId && appointmentData.specialtyName) {
          setSelectedSpecialty({
            id: appointmentData.specialtyId,
            name: appointmentData.specialtyName,
            price: appointmentData.specialtyPrice || 100.0,
          });

          // Buscar médicos para esta especialidade acontecerá automaticamente pelo useEffect
        }

        if (appointmentData.doctorId) {
          setSelectedDoctor(appointmentData.doctorId);
        }

        if (appointmentData.date) {
          setSelectedDate(new Date(appointmentData.date));
        }

        if (appointmentData.slotId) {
          setSelectedSlot(appointmentData.slotId);
        }

        // Definir a etapa ativa com base nos dados restaurados
        if (
          appointmentData.specialtyId &&
          appointmentData.doctorId &&
          appointmentData.date &&
          appointmentData.slotId
        ) {
          // Verificar se o usuário está autenticado
          const checkSession = async () => {
            const {
              data: { session },
            } = await supabase.auth.getSession();

            if (session) {
              // Se estiver autenticado, ir para a etapa de confirmação
              setActiveTab("confirmation");
            } else {
              // Se não estiver autenticado, ir para a etapa de data/hora
              setActiveTab("datetime");
            }
          };

          checkSession();
        } else if (appointmentData.specialtyId && appointmentData.doctorId) {
          setActiveTab("datetime");
        } else if (appointmentData.specialtyId) {
          setActiveTab("doctor");
        }

        // Limpar os dados pendentes
        localStorage.removeItem("pendingAppointment");
      } catch (error) {
        console.error("Erro ao restaurar agendamento pendente:", error);
        localStorage.removeItem("pendingAppointment");
      }
    }
  }, []);

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Agende sua consulta</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex flex-col sm:grid sm:grid-cols-3 lg:grid-cols-5 w-full gap-1">
          <TabsTrigger value="specialty" className="justify-start">
            <span className="flex items-center">
              <span className="bg-primary/10 text-primary w-6 h-6 rounded-full flex items-center justify-center mr-2 text-xs">
                1
              </span>
              Especialidade
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="doctor"
            disabled={!selectedSpecialty}
            className="justify-start"
          >
            <span className="flex items-center">
              <span className="bg-primary/10 text-primary w-6 h-6 rounded-full flex items-center justify-center mr-2 text-xs">
                2
              </span>
              Médico
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="datetime"
            disabled={!selectedDoctor}
            className="justify-start"
          >
            <span className="flex items-center">
              <span className="bg-primary/10 text-primary w-6 h-6 rounded-full flex items-center justify-center mr-2 text-xs">
                3
              </span>
              Data e Hora
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="confirmation"
            disabled={!selectedSlot}
            className="justify-start"
          >
            <span className="flex items-center">
              <span className="bg-primary/10 text-primary w-6 h-6 rounded-full flex items-center justify-center mr-2 text-xs">
                4
              </span>
              Confirmação
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="payment"
            disabled={!appointmentId}
            className="justify-start"
          >
            <span className="flex items-center">
              <span className="bg-primary/10 text-primary w-6 h-6 rounded-full flex items-center justify-center mr-2 text-xs">
                5
              </span>
              Pagamento
            </span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-8">
          <TabsContent value="specialty" className="space-y-8">
            <div className="max-w-md mx-auto">
              <SpecialtySelect
                onSelectSpecialty={handleSelectSpecialty}
                selectedSpecialty={selectedSpecialty}
              />
            </div>

            <div className="flex justify-end">
              <Button onClick={handleNextTab} disabled={!selectedSpecialty}>
                Próximo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="doctor">
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Selecione um médico
                </h2>

                {loading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : doctors.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {doctors.map((doctor) => (
                      <DoctorCard
                        key={doctor.id}
                        doctor={doctor}
                        isSelected={selectedDoctor === doctor.id}
                        onSelect={handleSelectDoctor}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      Nenhum médico disponível para esta especialidade.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={handlePrevTab}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar
                </Button>
                <Button onClick={handleNextTab} disabled={!selectedDoctor}>
                  Próximo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="datetime">
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <Calendar
                    onSelectDate={handleSelectDate}
                    selectedDate={selectedDate}
                  />
                </div>
                <div>
                  <TimeSlots
                    slots={timeSlots}
                    selectedSlot={selectedSlot}
                    onSelectSlot={handleSelectSlot}
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={handlePrevTab}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar
                </Button>
                <Button
                  onClick={handleNextTab}
                  disabled={!selectedDate || !selectedSlot}
                >
                  Próximo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="confirmation">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Resumo do agendamento
                </h2>

                <div className="bg-muted/50 p-6 rounded-lg space-y-4">
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">
                      Especialidade
                    </h3>
                    <p>{selectedSpecialty?.name}</p>
                  </div>

                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">
                      Médico
                    </h3>
                    <p>{doctors.find((d) => d.id === selectedDoctor)?.name}</p>
                  </div>

                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">
                      Data
                    </h3>
                    <p>
                      {selectedDate
                        ? format(selectedDate, "dd 'de' MMMM 'de' yyyy", {
                            locale: ptBR,
                          })
                        : ""}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">
                      Horário
                    </h3>
                    <p>{selectedSlotTime}</p>
                  </div>

                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">
                      Valor da consulta
                    </h3>
                    <p className="font-bold text-primary">
                      {selectedSpecialty?.price
                        ? formatCurrency(selectedSpecialty.price)
                        : "Preço não definido"}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Seus dados</h2>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome completo</Label>
                    <Input
                      id="name"
                      value={patientInfo.name}
                      onChange={(e) =>
                        handlePatientInfoChange({ name: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={patientInfo.email}
                      onChange={(e) =>
                        handlePatientInfoChange({ email: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={patientInfo.phone}
                      onChange={(e) =>
                        handlePatientInfoChange({ phone: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Motivo da consulta</Label>
                    <Textarea
                      id="notes"
                      value={patientInfo.notes}
                      onChange={(e) =>
                        handlePatientInfoChange({ notes: e.target.value })
                      }
                      placeholder="Descreva brevemente o motivo da sua consulta"
                    />
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 flex justify-between">
                <Button variant="outline" onClick={handlePrevTab}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar
                </Button>
                <Button
                  onClick={handleNextTab}
                  disabled={
                    !patientInfo.name ||
                    !patientInfo.email ||
                    !patientInfo.phone ||
                    loading
                  }
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      Prosseguir para pagamento
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="payment">
            <div className="max-w-2xl mx-auto">
              {paymentComplete ? (
                <div className="text-center py-12 space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h2 className="text-2xl font-bold">Pagamento confirmado!</h2>
                  <p className="text-muted-foreground">
                    Seu agendamento foi confirmado com sucesso. Você será
                    redirecionado para a página de agendamentos.
                  </p>
                  <div className="pt-4">
                    <Button asChild>
                      <Link href="/paciente/agendamentos">
                        Ver meus agendamentos
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <PaymentForm
                  appointmentData={{
                    doctorId: selectedDoctor || "",
                    specialtyId: selectedSpecialty?.id || "",
                    specialtyName: selectedSpecialty?.name || "",
                    specialtyPrice: selectedSpecialty?.price || 0,
                    date: selectedDate || new Date(),
                    time: selectedSlotTime || "",
                    patientName: patientInfo.name,
                    patientEmail: patientInfo.email,
                    notes: patientInfo.notes,
                  }}
                  onPaymentComplete={handlePaymentComplete}
                  appointmentId={appointmentId || undefined}
                />
              )}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
