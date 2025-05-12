"use client";
import React, { useEffect, useRef } from "react";
import { loadMercadoPago } from "@mercadopago/sdk-js";
import { CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
// Declaração global para o objeto MercadoPago no window
declare global {
  interface Window {
    MercadoPago: any;
  }
}

interface Props {
  nameProduct: string;
  email: string;
  amount?: string;
  appointmentData: {
    doctorId: string;
    specialtyId: string;
    specialtyName: string;
    specialtyPrice: number;
    date: Date;
    time: string;
    patientName: string;
    patientEmail: string;
    notes?: string;
  };
  appointmentId?: string;
}

const Payments = ({
  nameProduct,
  email,
  amount,
  appointmentData,
  appointmentId,
}: Props) => {
  const [loading, setLoading] = React.useState(false);
  const router = useRouter(); // Hook para redirecionamento
  // useEffect(() => {
  //   const initializeMercadoPago = async () => {
  //     await loadMercadoPago();
  //     const mp = new window.MercadoPago(
  //       process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY || ""
  //     );

  //     const cardForm = mp.cardForm({
  //       amount: amount,
  //       iframe: true,
  //       form: {
  //         id: "form-checkout",
  //         cardNumber: {
  //           id: "form-checkout__cardNumber",
  //           placeholder: "Número do cartão",
  //           color: "#fff",
  //         },
  //         expirationDate: {
  //           id: "form-checkout__expirationDate",
  //           placeholder: "MM/YY",
  //         },
  //         securityCode: {
  //           id: "form-checkout__securityCode",
  //           placeholder: "Código de segurança",
  //         },
  //         cardholderName: {
  //           id: "form-checkout__cardholderName",
  //           placeholder: "Titular do cartão",
  //         },
  //         issuer: {
  //           id: "form-checkout__issuer",
  //           placeholder: "Banco emissor",
  //         },
  //         installments: {
  //           id: "form-checkout__installments",
  //           placeholder: "Parcelas",
  //         },
  //         identificationType: {
  //           id: "form-checkout__identificationType",
  //           placeholder: "Tipo de documento",
  //         },
  //         identificationNumber: {
  //           id: "form-checkout__identificationNumber",
  //           placeholder: "Número do documento",
  //         },
  //         cardholderEmail: {
  //           id: "form-checkout__cardholderEmail",
  //           placeholder: "E-mail",
  //         },
  //       },
  //       callbacks: {
  //         onFormMounted: (error: Error | null) => {
  //           if (error) {
  //             console.warn("Form Mounted handling error: ", error);
  //             return;
  //           }
  //           console.log("Form mounted");
  //         },
  //         onSubmit: (event: Event) => {
  //           setLoading(true);
  //           event.preventDefault();
  //           const {
  //             paymentMethodId: payment_method_id,
  //             issuerId: issuer_id,
  //             cardholderEmail: email,
  //             amount,
  //             token,
  //             installments,
  //             identificationNumber,
  //             identificationType,
  //           } = cardForm.getCardFormData();

  //           fetch("/api/payment/card", {
  //             method: "POST",
  //             headers: {
  //               "Content-Type": "application/json",
  //             },
  //             body: JSON.stringify({
  //               token,
  //               appointmentData,
  //               issuer_id,
  //               payment_method_id,
  //               transaction_amount: Number(amount),
  //               installments: Number(installments),
  //               description: nameProduct,
  //               payer: {
  //                 email: email,
  //                 identification: {
  //                   type: identificationType,
  //                   number: identificationNumber,
  //                 },
  //               },
  //             }),
  //           })
  //             .then(async (response) => {
  //               const result = await response.json();

  //               if (response.ok && result.status === "success") {
  //                 toast({
  //                   title: "Pagamento realizado com sucesso",
  //                   description: "Você será redirecionado.",
  //                 });
  //                 router.push("/paciente/agendamentos"); // Redireciona para a página de agendamentos
  //               } else {
  //                 toast({
  //                   title: "Erro ao realizar pagamento",
  //                   description: "Tente novamente mais tarde.",
  //                   variant: "destructive",
  //                 });
  //               }
  //             })
  //             .catch((error) => {
  //               console.error("Erro ao processar pagamento:", error);
  //               toast({
  //                 title: "Erro de conexão",
  //                 description: "Tente novamente mais tarde.",
  //                 variant: "destructive",
  //               });
  //             })
  //             .finally(() => {
  //               setLoading(false); // Desativa o loading
  //             });
  //         },
  //         onFetching: (resource: any) => {
  //           console.log("onFetching iniciado:", resource);
  //           // Durante a tokenização (por exemplo), exibe a barra de progresso em modo indeterminado
  //         },
  //       },
  //     });
  //   };

  //   initializeMercadoPago();
  // }, []);

  useEffect(() => {
    const initializeMercadoPago = async () => {
      try {
        // Carregar o SDK do MercadoPago
        await loadMercadoPago();
        const mp = new window.MercadoPago(
          process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY || ""
        );

        // Inicializar o formulário do cartão
        const cardForm = mp.cardForm({
          amount: amount,
          iframe: true,
          form: {
            id: "form-checkout",
            cardNumber: {
              id: "form-checkout__cardNumber",
              placeholder: "Número do cartão",
              color: "#fff",
            },
            expirationDate: {
              id: "form-checkout__expirationDate",
              placeholder: "MM/YY",
            },
            securityCode: {
              id: "form-checkout__securityCode",
              placeholder: "Código de segurança",
            },
            cardholderName: {
              id: "form-checkout__cardholderName",
              placeholder: "Titular do cartão",
            },
            issuer: {
              id: "form-checkout__issuer",
              placeholder: "Banco emissor",
            },
            installments: {
              id: "form-checkout__installments",
              placeholder: "Parcelas",
            },
            identificationType: {
              id: "form-checkout__identificationType",
              placeholder: "Tipo de documento",
            },
            identificationNumber: {
              id: "form-checkout__identificationNumber",
              placeholder: "Número do documento",
            },
            cardholderEmail: {
              id: "form-checkout__cardholderEmail",
              placeholder: "E-mail",
            },
          },
          callbacks: {
            onFormMounted: (error: Error | null) => {
              if (error) {
                console.warn("Form Mounted handling error: ", error);
              } else {
                console.log("Form mounted");
              }
            },
            onSubmit: async (event: Event) => {
              event.preventDefault();
              try {
                // Iniciar o loading
                setLoading(true);

                // Coletar os dados do formulário
                const {
                  paymentMethodId: payment_method_id,
                  issuerId: issuer_id,
                  cardholderEmail: email,
                  amount,
                  token,
                  installments,
                  identificationNumber,
                  identificationType,
                } = cardForm.getCardFormData();

                // Enviar os dados para a API
                const response = await fetch("/api/payment/card", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    token,
                    appointmentData,
                    appointmentId,
                    issuer_id,
                    payment_method_id,
                    transaction_amount: Number(amount),
                    installments: Number(installments),
                    description: nameProduct,
                    payer: {
                      email: email,
                      identification: {
                        type: identificationType,
                        number: identificationNumber,
                      },
                    },
                  }),
                });

                const result = await response.json();

                // Verificar a resposta da API
                if (response.ok) {
                  toast({
                    title: "Pagamento realizado com sucesso",
                    description: "Você será redirecionado.",
                  });

                  // Redirecionar após o pagamento

                  router.push("/paciente/agendamentos"); // Redireciona para a página de agendamentos
                } else {
                  toast({
                    title: "Erro ao realizar pagamento",
                    description: "Tente novamente mais tarde.",
                    variant: "destructive",
                  });
                }
              } catch (error) {
                console.error("Erro ao processar pagamento:", error);
                toast({
                  title: "Erro de conexão",
                  description: "Tente novamente mais tarde.",
                  variant: "destructive",
                });
              } finally {
                setLoading(false); // Desativa o loading
              }
            },
            onFetching: (resource: any) => {
              console.log("onFetching iniciado:", resource);
            },
          },
        });
      } catch (error) {
        console.error("Erro ao inicializar MercadoPago:", error);
      }
    };

    initializeMercadoPago();
  }, [amount, nameProduct, appointmentData, router]);
  return (
    <div className="w-full">
      <form id="form-checkout" className="mt-4 flex flex-col gap-4 w-full">
        <div
          id="form-checkout__cardNumber"
          className="container h-14 bg-red-50 rounded-md py-1 px-5"
        ></div>
        <div
          id="form-checkout__expirationDate"
          className="container h-14 bg-red-50 rounded-md py-1 px-5"
        ></div>
        <div
          id="form-checkout__securityCode"
          className="container h-14 bg-red-50 rounded-md py-1 px-5"
        ></div>

        <input
          type="text"
          id="form-checkout__cardholderName"
          className="h-14 bg-red-50 rounded-md py-1 px-5 placeholder:text-[#737373] text-black"
        />
        <div className="flex gap-4">
          <select
            id="form-checkout__issuer"
            className="placeholder:text-[#737373] text-black h-14 bg-red-50 rounded-md py-1 px-5 w-full"
          ></select>
          <select
            id="form-checkout__installments"
            className="placeholder:text-[#737373] text-black h-14 bg-red-50 rounded-md py-1 px-5 w-full"
          ></select>
        </div>
        <div className="flex gap-4">
          <select
            id="form-checkout__identificationType"
            className="placeholder:text-[#737373] text-black h-14 bg-red-50 rounded-md py-1 px-5 w-full"
          ></select>
          <input
            type="text"
            id="form-checkout__identificationNumber"
            className="placeholder:text-[#737373] text-black h-14 bg-red-50 rounded-md py-1 px-5 w-full"
          />
        </div>
        <input
          type="email"
          id="form-checkout__cardholderEmail"
          defaultValue={email}
          className="placeholder:text-[#737373] text-black h-14 bg-red-50 rounded-md py-1 px-5"
        />
        <button
          type="submit"
          id="form-checkout__submit"
          className="w-full bg-green-400 h-14 rounded-md"
          disabled={loading} // Desabilita o botão enquanto o pagamento está sendo processado
        >
          {loading ? (
            <span className="loader">Carregando...</span> // Exibe um loader enquanto o pagamento está sendo processado
          ) : (
            "Pagar com Cartão de Crédito"
          )}
        </button>
      </form>
    </div>
  );
};

export default Payments;
