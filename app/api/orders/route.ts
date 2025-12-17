import { NextResponse } from "next/server";
import { storage } from "@/server/storage";
import { insertOrderSchema } from "@shared/schema";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = insertOrderSchema.parse(body);
    const order = await storage.createOrder(validatedData);
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Invalid order data" },
      { status: 400 }
    );
  }
}

