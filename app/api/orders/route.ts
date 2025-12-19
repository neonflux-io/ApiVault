import { NextResponse } from "next/server";
import { storage } from "@/server/storage";
import { insertOrderSchema } from "@shared/schema";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Received order request body:", body);
    
    // Check if it's an array of orders (multiple products) or a single order
    if (Array.isArray(body)) {
      // Create multiple orders - one per cart item
      const orders = [];
      for (const orderData of body) {
        const validatedData = insertOrderSchema.parse(orderData);
        const order = await storage.createOrder(validatedData);
        orders.push(order);
      }
      // Return the first order ID for redirect, but all orders are created
      return NextResponse.json(orders[0], { status: 201 });
    } else {
      // Single order (backward compatibility)
      const validatedData = insertOrderSchema.parse(body);
      console.log("Validated order data:", validatedData);
      console.log("Quantity in validated data:", validatedData.quantity);
      const order = await storage.createOrder(validatedData);
      return NextResponse.json(order, { status: 201 });
    }
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Invalid order data" },
      { status: 400 }
    );
  }
}

