"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, ArrowRight, Shield, Headphones, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  SiGoogle, SiTiktok, SiYoutube, SiFacebook, SiInstagram, SiX,
  SiWhatsapp, SiTelegram, SiDiscord, SiSlack, SiLine, SiWechat, SiGithub, SiShopify, SiStripe, SiOpenai, SiGooglemaps, SiTwilio
} from "react-icons/si";
import { products, formatPrice } from "@/lib/products";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/hooks/use-toast";

export default function Pricing() {
  const { addItem } = useCart();
  const { toast } = useToast();

  type SortOption = "price-asc" | "price-desc" | "name-asc" | "name-desc";

  const [sortOption, setSortOption] = useState<SortOption>("price-asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(6);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return products;
    return products.filter((product) =>
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sortOption) {
      case "price-asc":
        return list.sort((a, b) => a.price - b.price);
      case "price-desc":
        return list.sort((a, b) => b.price - a.price);
      case "name-asc":
        return list.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return list.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return list;
    }
  }, [filteredProducts, sortOption]);

  const visibleProducts = sortedProducts.slice(0, visibleCount);
  const hasMore = visibleCount < sortedProducts.length;

  const handleAddToCart = (product: typeof products[0]) => {
    addItem(product);
    toast({
      title: "Added to cart",
      description: `${product.name} plan has been added to your cart.`,
    });
  };

  return (
    <div className="py-12 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            <Star className="mr-1.5 h-3.5 w-3.5" />
            Flexible Plans
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Choose Your Plan
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Select the perfect plan for your needs. All plans include instant API key delivery and full documentation access.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort by</span>
              <select
                className="rounded-md border bg-background px-3 py-1.5 text-sm"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
              >
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A → Z</option>
                <option value="name-desc">Name: Z → A</option>
              </select>
            </div>
            <Input
              className="w-full max-w-xs text-sm"
              placeholder="Search API keys (e.g. Google, Stripe, TikTok)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto mb-8">
          {visibleProducts.map((product) => {
            const Icon =
              product.id === "google"
                ? SiGoogle
                : product.id === "tiktok"
                ? SiTiktok
                : product.id === "youtube"
                ? SiYoutube
                : product.id === "facebook"
                ? SiFacebook
                : product.id === "instagram"
                ? SiInstagram
                : product.id === "twitter"
                ? SiX
                : product.id === "whatsapp"
                ? SiWhatsapp
                : product.id === "telegram"
                ? SiTelegram
                : product.id === "discord"
                ? SiDiscord
                : product.id === "slack"
                ? SiSlack
                : product.id === "line"
                ? SiLine
                : product.id === "wechat"
                ? SiWechat
                : product.id === "github"
                ? SiGithub
                : product.id === "shopify"
                ? SiShopify
                : product.id === "stripe"
                ? SiStripe
                : product.id === "openai"
                ? SiOpenai
                : product.id === "google-maps"
                ? SiGooglemaps
                : SiTwilio;

            return (
              <Card
                key={product.id}
                className="relative flex flex-col overflow-visible"
                data-testid={`card-pricing-${product.id}`}
              >
              <CardHeader className="text-center pt-8 space-y-3">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-2xl">{product.name}</CardTitle>
                <CardDescription className="min-h-[40px]">
                  {product.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="text-center mb-6">
                  <span className="text-4xl font-bold">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-muted-foreground">/month</span>
                </div>

                <div className="space-y-1 mb-6 text-center">
                  <p className="text-sm font-medium">
                    {product.requestsPerMonth.toLocaleString()} requests/month
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Rate limit: {product.rateLimit}
                  </p>
                </div>

                <div className="space-y-3">
                  {product.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-4">
                <Button
                  className="w-full"
                  variant="default"
                  onClick={() => handleAddToCart(product)}
                  data-testid={`button-add-${product.id}`}
                >
                  Purchase
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          );})}
        </div>

        {hasMore && (
          <div className="mb-16 flex justify-center">
            <Button
              variant="outline"
              onClick={() =>
                setVisibleCount((count) => Math.min(count + 6, sortedProducts.length))
              }
            >
              Show more API keys
            </Button>
          </div>
        )}

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                question: "How do I get my API key?",
                answer: "After completing your purchase, you'll receive your API key instantly. It will be displayed on the confirmation page and sent to your email.",
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept PayPal, Solana (SOL) cryptocurrency, and bank transfers. All payment methods are secure and processed instantly.",
              },
              {
                question: "Can I upgrade or downgrade my plan?",
                answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and billing is prorated.",
              },
              {
                question: "Is there a money-back guarantee?",
                answer: "Yes, we offer a 30-day money-back guarantee. If you're not satisfied, contact our support team for a full refund.",
              },
              {
                question: "Do you offer custom enterprise plans?",
                answer: "Yes, we offer custom plans for large-scale operations. Contact our sales team to discuss your specific requirements.",
              },
            ].map((faq) => (
              <Card key={faq.question} className="overflow-visible">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-muted-foreground">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <span className="text-sm">SSL Secured</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <span className="text-sm">Instant Delivery</span>
          </div>
          <div className="flex items-center gap-2">
            <Headphones className="h-5 w-5" />
            <span className="text-sm">24/7 Support</span>
          </div>
        </div>
      </div>
    </div>
  );
}
