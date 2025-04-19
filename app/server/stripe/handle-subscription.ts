import 'server-only';

import Stripe from 'stripe';
import { db } from '@/app/lib/firebase';

export async function handleStripeSubscription(
  event: Stripe.CheckoutSessionCompletedEvent
) {
  if (event.data.object.payment_status === 'paid') {
    console.log('Assinatura criada com sucesso!');

    const metadata = event.data.object.metadata;
    const userId = metadata?.userId;

    if (!userId) {
      console.error('User ID not found in metadata');
      return;
    }

    await db.collection('users').doc(userId).update({
      stripeSubscriptionId: event.data.object.subscription,
      subscriptionStatus: 'active',
    });
  }
}
