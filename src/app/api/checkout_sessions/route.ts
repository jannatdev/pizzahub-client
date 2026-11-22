
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { getSession } from "@/lib/core/server";

export async function POST() {
  const userSession = await getSession();

  if (!userSession?.user?.id) {
    return NextResponse.json(
      { error: "You must be signed in to upgrade your plan." },
      { status: 401 }
    );
  }

  try {
    const headersList = await headers();
    const origin =
      headersList.get("origin") || process.env.NEXT_PUBLIC_APP_URL;

    if (!origin) {
      return NextResponse.json(
        { error: "Application URL is not configured." },
        { status: 500 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: "price_1Uda9ME41iHEkyXYCcDBEqv2",
          quantity: 1,
        },
      ],

      mode: "payment",

      customer_email: userSession.user.email,

      metadata: {
        userId: userSession.user.id,
      },

      client_reference_id: userSession.user.id,

      success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: `${origin}/payment?canceled=true`,
    });

    if (!session.url) {
      throw new Error("Stripe Checkout URL was not generated.");
    }

    return NextResponse.redirect(session.url, 303);
  } catch (err) {
    console.error("Stripe Checkout Error:", err);

    const error =
      err instanceof Error ? err.message : "Payment initialization failed.";

    return NextResponse.json(
      { error },
      { status: 500 }
    );
  }
}
