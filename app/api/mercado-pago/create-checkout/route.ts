import { NextRequest, NextResponse } from 'next/server';
import { Preference } from 'mercadopago';
import mpClient from '@/app/lib/mercado-pago';

export async function POST(req: NextRequest) {
  const { testeId, userEmail } = await req.json();

  try {
    const preference = new Preference(mpClient);

    const createdPreference = await preference.create({
      body: {
        external_reference: testeId, //id do pedido no sistema e impacta na pontuacao do mercado pago
        metadata: {
          testeId, // Essa variavel é convertida para snake_case -> teste_id
        },
        ...(userEmail && { payer: { email: userEmail } }),
        items: [
          {
            id: testeId,
            description: 'Teste de integração com o Mercado Pago',
            title: 'Teste de integração',
            quantity: 1,
            currency_id: 'BRL',
            unit_price: 1,
            category_id: 'Teste',
          },
        ],
        payment_methods: {
          installments: 1,
          // exclused_payments_methods: [{ id: 'bolvradesco' }, { id: 'pec' }],
          // excludesd_payment_types: [
          //   { id: 'debit_card' },
          //   { id: 'credit_card' },
          // ],
        },
        auto_return: 'approved',
        back_urls: {
          success: `${req.headers.get('origin')}/api/mercado-pago/pending`,
          pending: `${req.headers.get('origin')}/api/mercado-pago/pending`,
          failure: `${req.headers.get('origin')}/api/mercado-pago/pending`,
        },
      },
    });

    if (!createdPreference.id) {
      return NextResponse.json(
        { error: 'Failed to create preference' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      preferenceId: createdPreference.id,
      initPoint: createdPreference.init_point,
    });
  } catch (error) {
    console.error('Error creating checkout:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
