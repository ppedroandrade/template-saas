import { db } from '@/app/lib/firebase';
import resend from '@/app/lib/resend';
import 'server-only';

import Stripe from 'stripe';

export async function handleStripePayment(
  event: Stripe.CheckoutSessionCompletedEvent
) {
  if (event.data.object.payment_status === 'paid') {
    console.log('Assinatura criada com sucesso!');

    const metadata = event.data.object.metadata;
    const userId = metadata?.userId;
    const userEmail =
      event.data.object.customer_email ||
      event.data.object.customer_details?.email;

    if (!userId || !userEmail) {
      console.error('User ID not found in metadata');
      return;
    }

    await db.collection('users').doc(userId).update({
      stripeSubscriptionId: event.data.object.subscription,
      subscriptionStatus: 'active',
    });

    const { data, error } = await resend.emails.send({
      from: 'Acme <me@pedroandrade.dev>',
      to: [userEmail],
      subject: 'Assinatura cancelada com sucesso',
      text: 'Pagamento cancelado com sucesso! Você já pode usar o serviço.',
    });

    if (error) {
      console.error('Error sending email:', error);
    }
    console.log(data);
  }
}
