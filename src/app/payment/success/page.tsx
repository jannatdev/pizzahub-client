
import { checkoutVerify } from "@/lib/api/payment";
import { getSession } from "@/lib/core/server";
import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";
import { Suspense } from "react";

type PaymentSuccessProps = {
  searchParams: Promise<{
    session_id?: string;
  }>;
};

const PaymentSuccessContent = async ({
  searchParams,
}: PaymentSuccessProps) => {
  const { session_id } = await searchParams;

  const userSession = await getSession();

  if (!userSession?.user) {
    redirect("/sign-in");
  }

  if (!session_id) {
    redirect("/payment");
  }

  const { status, payment_status, customer_email } =
    await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items", "payment_intent"],
    });

  if (status === "open") {
    redirect("/payment");
  }

  if (status === "complete" && payment_status === "paid") {
    // Ask the backend to record the payment and upgrade the vendor.
    // The backend is the source of truth — the frontend never activates
    // Premium itself. If verification fails we still show the (Stripe
    // confirmed) result instead of crashing the page.
    let verificationError: string | null = null;

    try {
      await checkoutVerify(session_id);
    } catch (error) {
      verificationError =
        error instanceof Error ? error.message : "Payment verification failed.";
      console.error("Payment verification failed:", verificationError);
    }

    return (
      <section
        id="success"
        className="flex min-h-screen flex-col items-center bg-red-50/25 justify-center px-6 text-center"
      >
        <h1 className="text-3xl font-bold text-red-600">
          Payment Successful!
        </h1>

        <p className="mt-4 text-gray-600">
          We appreciate your business! Your payment was successful.
        </p>

        <p className="mt-2 text-gray-500">
          A confirmation email will be sent to {customer_email}.
        </p>

        {verificationError ? (
          <div className="mt-6 max-w-md rounded-xl border border-orange-200 bg-orange-50 p-4 text-sm text-orange-700">
            Your payment was confirmed by Stripe, but we could not activate
            your Premium plan yet ({verificationError}). Please refresh this
            page to try again.
          </div>
        ) : (
          <p className="mt-6 text-sm font-medium text-green-600">
            Your Premium plan is now active.
          </p>
        )}
      </section>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p>Payment is being processed. Please check again shortly.</p>
    </div>
  );
};

const PaymentSuccessPage = ({
  searchParams,
}: PaymentSuccessProps) => {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <p>Loading payment confirmation...</p>
        </div>
      }
    >
      <PaymentSuccessContent searchParams={searchParams} />
    </Suspense>
  );
};

export default PaymentSuccessPage;


