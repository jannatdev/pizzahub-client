

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const VERIFY_URL = API_URL
  ? `${API_URL}/api/payment/checkout_verify`
  : null;

export const checkoutVerify = async (sessionId: string) => {
  if (!VERIFY_URL) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not set, so the payment API URL could not be built."
    );
  }

  let res: Response;

  try {
    res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sessionId }),
      cache: "no-store",
    });
  } catch (error) {
    // fetch only rejects on network problems (server down, wrong port, ...).
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Could not reach the payment API at ${VERIFY_URL} (${reason}). ` +
        "Make sure the backend server is running."
    );
  }

  const text = await res.text();

  console.log("Verification status:", res.status);
  console.log("Verification response:", text);

  let data;

  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(
      `Payment API returned a non-JSON response. ` +
        `Status: ${res.status}. URL: ${VERIFY_URL}. Response: ${text.slice(0, 300)}`
    );
  }

  if (!res.ok) {
    throw new Error(data.message || "Payment verification failed.");
  }

  return data;
};
