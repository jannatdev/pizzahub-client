
import { NextResponse } from "next/server";
import { authFetch } from "@/lib/session";

// GET customer profile
export async function GET() {
  try {
    const data = await authFetch("/customer/profile");

    return NextResponse.json(data);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch customer profile.";

    return NextResponse.json(
      { success: false, message },
      { status: 401 }
    );
  }
}

// UPDATE customer profile
export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    const data = await authFetch("/customer/profile", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    return NextResponse.json(data);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to update customer profile.";

    const status =
      error instanceof Error && "status" in error
        ? Number(error.status) || 500
        : 500;

    return NextResponse.json(
      { success: false, message },
      { status }
    );
  }
}
