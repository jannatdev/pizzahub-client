

import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe';
import { getSession } from '@/lib/core/server';



export async function POST() {

    const userSession = await getSession()

  if (!userSession?.user?.id) {
    return NextResponse.json(
      { error: "You must be signed in to upgrade your plan." },
      { status: 401 }
    )
  }

  try {
    const headersList = await headers()
    const origin = headersList.get('origin')

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, price_1234) of the product you want to sell
         price: 'price_1Uda9ME41iHEkyXYCcDBEqv2',
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email:userSession.user.email,
      // The backend's /api/payment/checkout_verify reads metadata.userId to
      // know WHICH user to upgrade to premium — without it, verification
      // always fails with "Payment verification failed."
      metadata: { userId: userSession.user.id },
      client_reference_id: userSession.user.id,
      success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      // Where Stripe's "Cancel" button returns the customer — the payment
      // page renders a friendly notice for ?canceled=true.
      cancel_url: `${origin}/payment?canceled=true`,
      // Provide a name (for example, hosted_web_0001) to label this Checkout integration and measure its conversion independently
      integration_identifier: 'Pizza_Hub_web00',
    });
    return NextResponse.redirect(session.url as string, 303)
  } catch (err) {

    const error = err instanceof Error? err:new Error(String(err))
    return NextResponse.json(
      { error: error.message },
      { status:500 }
    )
  }
}