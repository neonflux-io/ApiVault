import { NextResponse } from "next/server";
import { storage } from "@/server/storage";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    
    if (!email) {
      return NextResponse.json(
        { error: "Email parameter is required" },
        { status: 400 }
      );
    }
    
    const orders = await storage.getOrdersByEmail(email);
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders by email:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

