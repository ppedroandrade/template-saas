import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import stripe from '@/app/lib/stripe';

import { handleStripePayment } from '@/app/server/stripe/handle-payment';
import { handleStripeSubscription } from '@/app/server/stripe/handle-subscription';
import { handleStripeCancelSubscription } from '@/app/server/stripe/handle-cancel-subscription';

const secret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature || !secret) {
      return NextResponse.json(
        { error: 'Missing Stripe signature' },
        { status: 400 }
      );
    }

    const event = stripe.webhooks.constructEvent(body, signature, secret);

    switch (event.type) {
      case 'checkout.session.completed': // pagamento realizado se status == paid - pode ser tanto pagamento unico quanto assunatura
        const metadata = event.data.object.metadata;

        if (metadata?.price === process.env.STRIPE_PRODUCT_PRICE_ID) {
          await handleStripePayment(event);
        }
        if (metadata?.price === process.env.STRIPE_SUBSCRIPTION_PRICE_ID) {
          await handleStripeSubscription(event);
        }

        break;
      case 'checkout.session.expired': // Expirou o tempo de pagamento
        console.log('Enviar um email informando que o pagamento expirou');
        break;
      case 'checkout.session.async_payment_succeeded': // boleto pago
        console.log('Enviar um email informando que o pagamento foi realizado');
        break;
      case 'checkout.session.async_payment_failed': // boleto no pago
        console.log('Enviar um email informando que o pagamento falhou');
        break;
      case 'customer.subscription.created': //Criou a assinatura
        console.log(
          'Enviar um email que foi feita a assinatura ou msg de boas vindas'
        );
        break;
      case 'customer.subscription.deleted': //Cancelou a assinatura
        await handleStripeCancelSubscription(event);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ message: 'Webhook received' }, { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Webhook Error' }, { status: 500 });
  }
}
