import { db } from '@/app/lib/firebase';
import resend from '@/app/lib/resend';
import 'server-only';

import Stripe from 'stripe';

export async function handleStripeCancelSubscription(
  event: Stripe.CustomerSubscriptionDeletedEvent
) {
  console.log('Assinatura cancelada com sucesso!');
  const customerId = event.data.object.customer;

  const userRef = await db
    .collection('users')
    .where('stripeCustomerId', '==', customerId)
    .get();
  if (userRef.empty) {
    console.error('User not found for customer ID:', customerId);
    return;
  }

  const userId = userRef.docs[0].id;
  const userEmail = userRef.docs[0].data().email;

  await db.collection('users').doc(userId).update({
    subscriptionStatus: 'inactive',
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
