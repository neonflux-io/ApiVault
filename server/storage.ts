import { type User, type InsertUser, type Order, type InsertOrder, type Product } from "@shared/schema";
import { randomUUID } from "crypto";

// Generate a random API key
function generateApiKey(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let key = "sk_live_";
  for (let i = 0; i < 32; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
}

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Orders
  getOrder(id: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: string, status: string, apiKey?: string): Promise<Order | undefined>;
  getOrdersByEmail(email: string): Promise<Order[]>;
  
  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private orders: Map<string, Order>;
  private products: Map<string, Product>;

  constructor() {
    this.users = new Map();
    this.orders = new Map();
    this.products = new Map();
    
    // Initialize with default API key products (mirrors client/lib/products)
    const defaultProducts: Product[] = [
      {
        id: "google",
        name: "Google API Key",
        description: "High‑quota access for Google services and analytics.",
        price: 9900,
        requestsPerMonth: 250000,
        rateLimit: "2,000 requests/minute",
        features: [
          "Search, Maps & Analytics ready",
          "Priority dashboard & usage insights",
          "Production‑grade rate limits",
        ],
        popular: true,
      },
      {
        id: "tiktok",
        name: "TikTok API Key",
        description: "Creator and campaign analytics for TikTok.",
        price: 6900,
        requestsPerMonth: 150000,
        rateLimit: "1,000 requests/minute",
        features: [
          "Audience & engagement metrics",
          "Hashtag and trend lookups",
          "Campaign reporting endpoints",
        ],
        popular: true,
      },
      {
        id: "youtube",
        name: "YouTube API Key",
        description: "Channel, video, and live analytics at scale.",
        price: 7900,
        requestsPerMonth: 200000,
        rateLimit: "1,500 requests/minute",
        features: [
          "Channel & playlist insights",
          "Real‑time performance metrics",
          "Comment & engagement data",
        ],
        popular: true,
      },
      {
        id: "facebook",
        name: "Facebook API Key",
        description: "Graph API access for pages, ads, and insights.",
        price: 8900,
        requestsPerMonth: 220000,
        rateLimit: "1,500 requests/minute",
        features: [
          "Page & post analytics",
          "Ads performance metrics",
          "Audience demographics",
        ],
        popular: true,
      },
      {
        id: "instagram",
        name: "Instagram API Key",
        description: "Insights for creators, stories, and reels.",
        price: 7400,
        requestsPerMonth: 180000,
        rateLimit: "1,200 requests/minute",
        features: [
          "Profile & media analytics",
          "Stories and reels insights",
          "Hashtag discovery data",
        ],
        popular: true,
      },
      {
        id: "twitter",
        name: "Twitter/X API Key",
        description: "Real‑time stream and historical tweet analytics.",
        price: 8400,
        requestsPerMonth: 200000,
        rateLimit: "2,000 requests/minute",
        features: [
          "Search & filtered streams",
          "User & timeline lookups",
          "Engagement and reach metrics",
        ],
        popular: true,
      },
      {
        id: "whatsapp",
        name: "WhatsApp Business API Key",
        description: "Two‑way messaging and notifications via WhatsApp.",
        price: 7800,
        requestsPerMonth: 150000,
        rateLimit: "1,000 messages/minute",
        features: [
          "Session and template messages",
          "Delivery & read receipt tracking",
          "Rich media attachments",
        ],
        popular: false,
      },
      {
        id: "telegram",
        name: "Telegram Bot API Key",
        description: "Global chat automation with Telegram bots.",
        price: 4900,
        requestsPerMonth: 120000,
        rateLimit: "900 requests/minute",
        features: [
          "Bot webhooks & polling",
          "Inline queries and commands",
          "Groups and channel automation",
        ],
        popular: false,
      },
      {
        id: "discord",
        name: "Discord API Key",
        description: "Bots, moderation, and community automation on Discord.",
        price: 5200,
        requestsPerMonth: 140000,
        rateLimit: "1,000 requests/minute",
        features: [
          "Guild & member management",
          "Slash commands and interactions",
          "Rich embeds and webhooks",
        ],
        popular: false,
      },
      {
        id: "slack",
        name: "Slack API Key",
        description: "Workflow and notification integrations for Slack.",
        price: 6100,
        requestsPerMonth: 130000,
        rateLimit: "900 requests/minute",
        features: [
          "Events API & webhooks",
          "Slash commands and bots",
          "Workflow automation hooks",
        ],
        popular: false,
      },
      {
        id: "line",
        name: "LINE Messaging API Key",
        description: "Messaging automation for LINE users in Asia.",
        price: 5600,
        requestsPerMonth: 120000,
        rateLimit: "800 requests/minute",
        features: [
          "Push & reply messages",
          "Rich menu customization",
          "Webhook‑based events",
        ],
        popular: false,
      },
      {
        id: "wechat",
        name: "WeChat Official Account API Key",
        description: "Messaging and mini‑program integrations on WeChat.",
        price: 9200,
        requestsPerMonth: 220000,
        rateLimit: "1,500 requests/minute",
        features: [
          "Official account messaging",
          "QR code and menu flows",
          "Mini‑program integrations",
        ],
        popular: false,
      },
      {
        id: "github",
        name: "GitHub API Key",
        description: "Automation and analytics for GitHub repositories.",
        price: 6800,
        requestsPerMonth: 160000,
        rateLimit: "1,000 requests/minute",
        features: [
          "Repo & PR analytics",
          "Actions and CI insights",
          "Webhooks and automation",
        ],
        popular: false,
      },
      {
        id: "shopify",
        name: "Shopify API Key",
        description: "Storefront, orders, and inventory access for Shopify.",
        price: 9900,
        requestsPerMonth: 180000,
        rateLimit: "1,200 requests/minute",
        features: [
          "Orders & customer data",
          "Inventory and catalog sync",
          "Webhook‑driven automations",
        ],
        popular: false,
      },
      {
        id: "stripe",
        name: "Stripe API Key",
        description: "Global payments and billing integration with Stripe.",
        price: 8800,
        requestsPerMonth: 200000,
        rateLimit: "1,500 requests/minute",
        features: [
          "Payments and subscriptions",
          "Invoicing and payouts",
          "Radar & fraud insights",
        ],
        popular: false,
      },
      {
        id: "openai",
        name: "OpenAI API Key",
        description: "Access to GPT‑style models and embeddings.",
        price: 11900,
        requestsPerMonth: 300000,
        rateLimit: "2,500 tokens/second",
        features: [
          "Chat completion endpoints",
          "Embeddings and vector search",
          "Moderation tools",
        ],
        popular: false,
      },
      {
        id: "google-maps",
        name: "Google Maps API Key",
        description: "Geocoding, routing, and map tiles for global apps.",
        price: 8700,
        requestsPerMonth: 210000,
        rateLimit: "1,800 requests/minute",
        features: [
          "Geocoding & directions",
          "Place search & details",
          "Static & dynamic maps",
        ],
        popular: false,
      },
      {
        id: "twilio",
        name: "Twilio API Key",
        description: "SMS, voice, and WhatsApp communications via Twilio.",
        price: 8300,
        requestsPerMonth: 190000,
        rateLimit: "1,400 requests/minute",
        features: [
          "Programmable SMS & voice",
          "WhatsApp messaging",
          "Verify and auth flows",
        ],
        popular: false,
      },
    ];
    
    defaultProducts.forEach((product) => {
      this.products.set(product.id, product);
    });
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id, email: null };
    this.users.set(id, user);
    return user;
  }

  // Order methods
  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const now = new Date();
    
    // Generate multiple API keys based on quantity purchased
    // In production, this would happen after payment confirmation
    // The quantity field is included in the InsertOrder type from the extended schema
    // Access it safely since TypeScript may not recognize the extended field
    const orderWithQuantity = insertOrder as typeof insertOrder & { quantity?: number };
    const quantity = orderWithQuantity.quantity && orderWithQuantity.quantity > 0 
      ? orderWithQuantity.quantity 
      : 1;
    
    console.log(`[createOrder] Quantity received: ${quantity}, generating ${quantity} API key(s)`);
    
    const apiKeys: string[] = [];
    for (let i = 0; i < quantity; i++) {
      apiKeys.push(generateApiKey());
    }
    
    console.log(`[createOrder] Generated ${apiKeys.length} API key(s)`);
    
    // Store API keys as JSON array string for backward compatibility
    // If only one key, store as single string; if multiple, store as JSON array
    const apiKey = quantity === 1 
      ? apiKeys[0] 
      : JSON.stringify(apiKeys);
    
    console.log(`[createOrder] Storing API key(s) as: ${quantity === 1 ? 'single string' : 'JSON array'}`);
    
    const order: Order = {
      id,
      productId: insertOrder.productId,
      customerEmail: insertOrder.customerEmail,
      customerName: insertOrder.customerName,
      paymentMethod: insertOrder.paymentMethod,
      paymentStatus: insertOrder.paymentMethod === "paypal" ? "completed" : "pending",
      transactionLink: insertOrder.transactionLink || null,
      amount: insertOrder.amount,
      currency: insertOrder.currency || "USD",
      apiKey: apiKey,
      createdAt: now,
    };
    
    this.orders.set(id, order);
    return order;
  }

  async updateOrderStatus(id: string, status: string, apiKey?: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder: Order = {
      ...order,
      paymentStatus: status,
      apiKey: apiKey || order.apiKey,
    };
    
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  async getOrdersByEmail(email: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      (order) => order.customerEmail === email
    );
  }

  // Product methods
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }
}

export const storage = new MemStorage();
