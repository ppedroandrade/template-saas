import mpClient, { validadeMercadoPagoWebhook } from '@/app/lib/mercado-pago';
import { handleMercadoPagoPayment } from '@/app/server/mercado-pago/handle-payment';
import { Payment } from 'mercadopago';
import { NextResponse, NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    validadeMercadoPagoWebhook(req);
    const body = await req.json();

    const { type, data } = body;

    switch (type) {
      case 'payment':
        const payment = new Payment(mpClient);
        const paymentData = await payment.get({ id: data.id });
        if (paymentData.status === 'approved' || paymentData.status !== null) {
          await handleMercadoPagoPayment(paymentData);
        }
        break;
      case 'subscription_preapproval':
        break;
      default:
        console.log('Esse evento nao é suportado');
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
