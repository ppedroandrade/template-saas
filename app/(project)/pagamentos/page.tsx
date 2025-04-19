'use client';

import { useStripe } from '@/app/hooks/useStripe';

export default function Pagamentos() {
  const {
    createPaymentStripeCheckout,
    createSubscriptionStripeCheckout,
    handleCreateStripPortal,
  } = useStripe();

  return (
    <div className="flex flex-col gap-10 items-center justify-center h-screen w-full">
      <h1 className="text-2xl font-bold">Pagamentos</h1>
      <button
        className="border rounded-md px-2"
        onClick={() =>
          createPaymentStripeCheckout({
            testeId: 'testeId',
          })
        }
      >
        Criar pagamentos Stripe
      </button>
      <button
        className="border rounded-md px-2"
        onClick={() =>
          createSubscriptionStripeCheckout({
            testeId: 'testeId',
          })
        }
      >
        Criar assinaturas Stripe
      </button>
      <button
        className="border rounded-md px-2"
        onClick={() => handleCreateStripPortal()}
      >
        Criar Portal de Pagamentos
      </button>
    </div>
  );
}
