import { NextResponse } from "next/server";
import { getClientToken } from "@/server/paypal";

export async function GET() {
  try {
    const clientToken = await getClientToken();
    return NextResponse.json({ clientToken });
  } catch (error) {
    console.error("Failed to get PayPal client token:", error);
    return NextResponse.json(
      { error: "Failed to initialize PayPal" },
      { status: 500 }
    );
  }
}
