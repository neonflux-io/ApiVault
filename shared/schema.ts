import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// API Key Products/Tiers
export const products = pgTable("products", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // in cents
  requestsPerMonth: integer("requests_per_month").notNull(),
  rateLimit: text("rate_limit").notNull(),
  features: text("features").array().notNull(),
  popular: boolean("popular").default(false),
});

export const insertProductSchema = createInsertSchema(products);
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

// Orders
export const orders = pgTable("orders", {
  id: varchar("id").primaryKey(),
  productId: varchar("product_id").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerName: text("customer_name").notNull(),
  paymentMethod: text("payment_method").notNull(), // 'paypal' | 'solana' | 'bitcoin' | 'ethereum' | 'bnb' | 'bep20' | 'bank_transfer'
  paymentStatus: text("payment_status").notNull().default("pending"), // 'pending' | 'completed' | 'failed'
  transactionLink: text("transaction_link"),
  amount: integer("amount").notNull(), // in cents
  currency: text("currency").notNull().default("USD"),
  apiKey: text("api_key"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertOrderSchema = createInsertSchema(orders).pick({
  productId: true,
  customerEmail: true,
  customerName: true,
  paymentMethod: true,
  transactionLink: true,
  amount: true,
  currency: true,
}).extend({
  quantity: z.number().int().positive().default(1),
});

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

// Users (for future account features)
export const users = pgTable("users", {
  id: varchar("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Cart item type (client-side only)
export interface CartItem {
  product: Product;
  quantity: number;
}

// Checkout form schema
export const checkoutFormSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerEmail: z.string().email("Please enter a valid email address"),
  paymentMethod: z.enum([
    "paypal",
    "solana",
    "bitcoin",
    "ethereum",
    "bnb",
    "bep20",
    "bank_transfer",
  ]),
  transactionLink: z.string().optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutFormSchema>;
