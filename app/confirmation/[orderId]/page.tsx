"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  CheckCircle2, Copy, Check, ArrowRight, 
  Mail, Clock, Shield, Key, FileText, Headphones, AlertCircle
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { formatPrice, getProductById } from "@/lib/products";
import type { Order } from "@shared/schema";

// Helper function to parse API keys (handles both single string and JSON array)
function parseApiKeys(apiKey: string | null | undefined): string[] {
  if (!apiKey) return [];
  
  try {
    // Try to parse as JSON array
    const parsed = JSON.parse(apiKey);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch {
    // If not JSON, treat as single string
  }
  
  // Return as single-item array for consistent handling
  return [apiKey];
}

export default function Confirmation() {
  const params = useParams();
  const orderId = params.orderId as string;
  const { toast } = useToast();
  const [copiedIndex, setCopiedIndex] = useState<{ orderId: string; keyIndex: number } | null>(null);

  // Fetch the initial order to get customer email
  const { data: order, isLoading: orderLoading, error: orderError } = useQuery<Order>({
    queryKey: ["/api/orders", orderId],
  });

  // Fetch all orders for this customer's email to show all purchased products
  const { data: allOrders, isLoading: allOrdersLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders/email", order?.customerEmail],
    queryFn: async () => {
      if (!order?.customerEmail) return [];
      const response = await fetch(`/api/orders/email?email=${encodeURIComponent(order.customerEmail)}`);
      if (!response.ok) return [];
      return response.json();
    },
    enabled: !!order?.customerEmail,
  });

  const isLoading = orderLoading || allOrdersLoading;
  const error = orderError;
  
  // Group orders by product and collect all API keys
  const ordersByProduct = allOrders?.reduce((acc, order) => {
    const product = getProductById(order.productId);
    const productName = product?.name || "API";
    const apiKeys = parseApiKeys(order.apiKey);
    
    if (!acc[productName]) {
      acc[productName] = [];
    }
    acc[productName].push({ order, apiKeys });
    return acc;
  }, {} as Record<string, Array<{ order: Order; apiKeys: string[] }>>) || {};

  const totalApiKeys = allOrders?.reduce((sum, order) => {
    return sum + parseApiKeys(order.apiKey).length;
  }, 0) || 0;

  const handleCopyApiKey = async (key: string, orderId: string, keyIndex: number) => {
    await navigator.clipboard.writeText(key);
    setCopiedIndex({ orderId, keyIndex });
    toast({
      title: "Copied",
      description: "API key copied to clipboard",
    });
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="py-20 lg:py-32">
        <div className="mx-auto max-w-2xl px-4">
          <div className="text-center mb-8">
            <Skeleton className="h-20 w-20 rounded-full mx-auto mb-6" />
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="py-20 lg:py-32">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 mx-auto mb-6">
            <AlertCircle className="h-10 w-10 text-destructive" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-4">Order Not Found</h1>
          <p className="text-muted-foreground mb-8">
            We couldn't find the order you're looking for.
          </p>
          <Link href="/">
            <Button size="lg" data-testid="button-go-home">
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isPending = order.paymentStatus === "pending";

  return (
    <div className="py-12 lg:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-10">
          <div className={`flex h-20 w-20 items-center justify-center rounded-full mx-auto mb-6 ${
            isPending ? "bg-chart-4/10" : "bg-chart-3/10"
          }`}>
            {isPending ? (
              <Clock className="h-10 w-10 text-chart-4" />
            ) : (
              <CheckCircle2 className="h-10 w-10 text-chart-3" />
            )}
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            {isPending ? "Order Received!" : "Payment Successful!"}
          </h1>
          <p className="text-muted-foreground">
            {isPending
              ? "Your order has been received and is pending payment confirmation."
              : "Thank you for your purchase. Your API key is ready to use."}
          </p>
        </div>

        {/* Order Details */}
        <Card className="mb-6 overflow-visible">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <CardTitle>Order Details</CardTitle>
                <CardDescription>Order ID: {order.id}</CardDescription>
              </div>
              <Badge variant={isPending ? "secondary" : "default"}>
                {isPending ? "Pending" : "Completed"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Customer</p>
                <p className="font-medium">{order.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{order.customerEmail}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Payment Method</p>
                <p className="font-medium capitalize">
                  {order.paymentMethod.replace("_", " ")}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="font-medium">
                  {allOrders && allOrders.length > 1
                    ? formatPrice(allOrders.reduce((sum, o) => sum + o.amount, 0))
                    : formatPrice(order.amount)}
                </p>
              </div>
            </div>

            {Object.keys(ordersByProduct).length > 0 && (
              <>
                <Separator />
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <Key className="h-5 w-5 text-primary" />
                    <p className="font-semibold">
                      {totalApiKeys === 1 
                        ? "Your API Key" 
                        : `Your API Keys (${totalApiKeys})`}
                    </p>
                  </div>
                  
                  {/* Display API keys grouped by product */}
                  {Object.entries(ordersByProduct).map(([productName, orderGroups]) => {
                    // Flatten all API keys for this product
                    const allKeysForProduct: Array<{ key: string; orderId: string; keyIndex: number }> = [];
                    orderGroups.forEach(({ order, apiKeys }) => {
                      apiKeys.forEach((key, idx) => {
                        allKeysForProduct.push({ key, orderId: order.id, keyIndex: idx });
                      });
                    });
                    
                    return (
                      <div key={productName} className="space-y-3">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{productName}</p>
                          <Badge variant="outline" className="text-xs">
                            {allKeysForProduct.length} {allKeysForProduct.length === 1 ? 'key' : 'keys'}
                          </Badge>
                        </div>
                        <div className="space-y-2 pl-4 border-l-2 border-muted">
                          {allKeysForProduct.map(({ key, orderId, keyIndex }, globalIndex) => (
                            <div key={`${orderId}-${keyIndex}`} className="space-y-2">
                              {allKeysForProduct.length > 1 && (
                                <p className="text-xs text-muted-foreground font-medium">
                                  {productName} API Key #{globalIndex + 1}
                                </p>
                              )}
                              {allKeysForProduct.length === 1 && (
                                <p className="text-xs text-muted-foreground font-medium">
                                  {productName} API Key
                                </p>
                              )}
                              <div className="flex gap-2">
                                <div className="flex-1 rounded-md bg-muted p-3 font-mono text-sm overflow-x-auto">
                                  {key}
                                </div>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleCopyApiKey(key, orderId, keyIndex)}
                                  data-testid={`button-copy-api-key-${orderId}-${keyIndex}`}
                                >
                                  {copiedIndex?.orderId === orderId && copiedIndex?.keyIndex === keyIndex ? (
                                    <Check className="h-4 w-4" />
                                  ) : (
                                    <Copy className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  
                  <p className="text-xs text-muted-foreground">
                    Keep these keys secure. Do not share them publicly.
                  </p>
                </div>
              </>
            )}
            
            {/* Fallback: Show single order API keys if allOrders hasn't loaded yet */}
            {Object.keys(ordersByProduct).length === 0 && order?.apiKey && parseApiKeys(order.apiKey).length > 0 && (
              <>
                <Separator />
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Key className="h-5 w-5 text-primary" />
                    <p className="font-semibold">
                      {parseApiKeys(order.apiKey).length === 1 
                        ? `Your ${getProductById(order.productId)?.name || "API"} API Key` 
                        : `Your ${getProductById(order.productId)?.name || "API"} API Keys (${parseApiKeys(order.apiKey).length})`}
                    </p>
                  </div>
                  <div className="space-y-3">
                    {parseApiKeys(order.apiKey).map((key, index) => (
                      <div key={index} className="space-y-2">
                        {parseApiKeys(order.apiKey).length > 1 && (
                          <p className="text-xs text-muted-foreground font-medium">
                            {getProductById(order.productId)?.name || "API"} API Key #{index + 1}
                          </p>
                        )}
                        {parseApiKeys(order.apiKey).length === 1 && (
                          <p className="text-xs text-muted-foreground font-medium">
                            {getProductById(order.productId)?.name || "API"} API Key
                          </p>
                        )}
                        <div className="flex gap-2">
                          <div className="flex-1 rounded-md bg-muted p-3 font-mono text-sm overflow-x-auto">
                            {key}
                          </div>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleCopyApiKey(key, order.id, index)}
                            data-testid={`button-copy-api-key-${index}`}
                          >
                            {copiedIndex?.orderId === order.id && copiedIndex?.keyIndex === index ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Keep these keys secure. Do not share them publicly.
                  </p>
                </div>
              </>
            )}

            {isPending && !order.apiKey && (
              <>
                <Separator />
                <div className="rounded-lg bg-chart-4/10 p-4">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-chart-4 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Awaiting Payment Confirmation</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Your API key will be generated and sent to your email once we confirm your payment.
                        {order.paymentMethod === "bank_transfer" && (
                          " Bank transfers typically take 1-3 business days to process."
                        )}
                        {order.paymentMethod === "solana" && (
                          " Solana payments are usually confirmed within a few minutes."
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-6 overflow-visible">
          <CardHeader>
            <CardTitle className="text-lg">Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 shrink-0">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Check Your Email</p>
                  <p className="text-sm text-muted-foreground">
                    We've sent a confirmation email to {order.customerEmail}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 shrink-0">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Read the Documentation</p>
                  <p className="text-sm text-muted-foreground">
                    Learn how to integrate the API into your application
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 shrink-0">
                  <Headphones className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Need Help?</p>
                  <p className="text-sm text-muted-foreground">
                    Our support team is available 24/7 to assist you
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/docs">
            <Button size="lg" className="w-full sm:w-auto" data-testid="button-view-docs">
              View Documentation
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" size="lg" className="w-full sm:w-auto" data-testid="button-return-home">
              Return Home
            </Button>
          </Link>
        </div>

        {/* Trust Badge */}
        <div className="mt-10 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Shield className="h-4 w-4" />
          <span>Your transaction is secured with 256-bit SSL encryption</span>
        </div>
      </div>
    </div>
  );
}
