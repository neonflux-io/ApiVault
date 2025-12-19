import { NextResponse } from "next/server";
import { storage } from "@/server/storage";
import { insertOrderSchema } from "@shared/schema";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Received order request body:", body);
    const validatedData = insertOrderSchema.parse(body);
    console.log("Validated order data:", validatedData);
    console.log("Quantity in validated data:", validatedData.quantity);
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

