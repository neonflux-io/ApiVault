import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Trash2, ArrowRight, ArrowLeft, Package } from "lucide-react";
import { SiGoogle, SiTiktok, SiYoutube, SiFacebook, SiInstagram, SiX } from "react-icons/si";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/products";

export default function Checkout() {
  const { items, removeItem, getTotal, clearCart } = useCart();
  const [, setLocation] = useLocation();
  const total = getTotal();

  if (items.length === 0) {
    return (
      <div className="py-20 lg:py-32">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mx-auto mb-6">
            <ShoppingCart className="h-10 w-10 text-muted-foreground" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">
            Browse our API plans and add one to get started.
          </p>
          <Link href="/pricing">
            <Button size="lg" data-testid="button-browse-plans">
              Browse Plans
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 lg:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/pricing">
            <Button variant="ghost" size="sm" data-testid="button-back-pricing">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Pricing
            </Button>
          </Link>
        </div>

        <h1 className="text-3xl font-bold tracking-tight mb-8">Your Cart</h1>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const id = item.product.id;
              const Icon =
                id === "google"
                  ? SiGoogle
                  : id === "tiktok"
                  ? SiTiktok
                  : id === "youtube"
                  ? SiYoutube
                  : id === "facebook"
                  ? SiFacebook
                  : id === "instagram"
                  ? SiInstagram
                  : SiX;

              return (
                <Card
                  key={item.product.id}
                  className="overflow-visible"
                  data-testid={`cart-item-${item.product.id}`}
                >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{item.product.name} Plan</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {item.product.requestsPerMonth.toLocaleString()} requests/month
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Rate limit: {item.product.rateLimit}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatPrice(item.product.price)}</p>
                      <p className="text-xs text-muted-foreground">per month</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 text-destructive hover:text-destructive"
                        onClick={() => removeItem(item.product.id)}
                        data-testid={`button-remove-${item.product.id}`}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );})}

            <Button
              variant="outline"
              size="sm"
              onClick={clearCart}
              className="text-muted-foreground"
              data-testid="button-clear-cart"
            >
              Clear Cart
            </Button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 overflow-visible">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span>{item.product.name} x {item.quantity}</span>
                    <span>{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Billed monthly. Cancel anytime.
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => setLocation("/payment")}
                  data-testid="button-proceed-payment"
                >
                  Proceed to Payment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
