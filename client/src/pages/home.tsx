import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, Shield, Clock, Code2, Headphones, Globe, 
  Check, ArrowRight, Key, Lock, RefreshCw, BarChart3,
  Star
} from "lucide-react";
import { 
  SiGoogle, SiTiktok, SiYoutube, SiFacebook, SiInstagram, SiX,
  SiWhatsapp, SiTelegram, SiDiscord, SiSlack, SiLine, SiWechat, SiGithub, SiShopify, SiStripe, SiOpenai, SiGooglemaps, SiTwilio
} from "react-icons/si";
import { products, formatPrice } from "@/lib/products";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (product: typeof products[0]) => {
    addItem(product);
    toast({
      title: "Added to cart",
      description: `${product.name} plan has been added to your cart.`,
    });
  };

  // Only show the six most popular API keys on the home page
  const popularProducts = products
    .filter((product) => product.popular)
    .slice(0, 6);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/30 py-20 lg:py-28">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-40" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            <div className="text-center lg:text-left">
              <Badge variant="secondary" className="mb-6" data-testid="badge-hero">
                <Zap className="mr-1.5 h-3.5 w-3.5" />
                Trusted by 10,000+ developers
              </Badge>
              
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
                Powerful APIs for{" "}
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Modern Developers
                </span>
              </h1>
              
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed lg:text-xl">
                Get instant access to reliable, scalable APIs with flexible pricing. 
                Multiple payment options including cryptocurrency, PayPal, and bank transfer.
              </p>
              
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
                <Link href="/pricing">
                  <Button size="lg" className="w-full sm:w-auto" data-testid="button-get-api-keys">
                    Get API Keys
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/docs">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto" data-testid="button-view-docs">
                    View Documentation
                  </Button>
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 lg:justify-start">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4 text-primary" />
                  <span>SSL Encrypted</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>99.9% Uptime</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Headphones className="h-4 w-4 text-primary" />
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="relative rounded-xl border bg-card p-6 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-3 w-3 rounded-full bg-destructive/60" />
                  <div className="h-3 w-3 rounded-full bg-chart-4/60" />
                  <div className="h-3 w-3 rounded-full bg-chart-3/60" />
                </div>
                <pre className="font-mono text-sm overflow-hidden">
                  <code className="text-muted-foreground">
{`// Quick Start Example
const response = await fetch(
  'https://api.apikeys.io/v1/data',
  {
    headers: {
      'Authorization': 'Bearer `}<span className="text-primary">sk_live_xxx...</span>{`',
      'Content-Type': 'application/json'
    }
  }
);

const data = await response.json();
console.log(data);`}
                  </code>
                </pre>
              </div>
              <div className="absolute -bottom-4 -right-4 rounded-lg border bg-card p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-chart-3/20">
                    <Check className="h-5 w-5 text-chart-3" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">API Key Generated</p>
                    <p className="text-xs text-muted-foreground">Ready to use in seconds</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="border-y bg-muted/30 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-muted-foreground mb-8">
            Trusted by developers at leading companies worldwide
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-60">
            {["TechCorp", "DevStudio", "CloudBase", "DataFlow", "CodeLabs", "BuildScale"].map((company) => (
              <div key={company} className="text-lg font-semibold tracking-tight text-muted-foreground">
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-24" id="features">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to build
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Our APIs come with all the features you need to build powerful applications
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Zap,
                title: "Instant API Key Delivery",
                description: "Get your API keys instantly after payment. No waiting, no delays.",
              },
              {
                icon: Shield,
                title: "Enterprise Security",
                description: "Bank-grade encryption and security measures to protect your data.",
              },
              {
                icon: Globe,
                title: "Global Infrastructure",
                description: "Servers distributed worldwide for low-latency API responses.",
              },
              {
                icon: Code2,
                title: "Developer Friendly",
                description: "Comprehensive documentation, SDKs, and code examples.",
              },
              {
                icon: RefreshCw,
                title: "99.9% Uptime",
                description: "Reliable infrastructure with guaranteed uptime SLA.",
              },
              {
                icon: BarChart3,
                title: "Real-time Analytics",
                description: "Monitor your API usage with detailed analytics dashboard.",
              },
            ].map((feature) => (
              <Card key={feature.title} className="relative overflow-visible">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

              {/* Pricing Section */}
      <section className="py-20 lg:py-24 bg-muted/30" id="pricing">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that fits your needs. All plans include our core features.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {popularProducts.map((product) => {
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
                  </Button>
                </CardFooter>
              </Card>
            );})}
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            All prices in USD. Cancel anytime. Money-back guarantee.
          </p>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Security you can trust
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Your security is our top priority. We use industry-leading measures.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Shield,
                title: "SSL Encryption",
                description: "256-bit SSL encryption for all data transfers",
              },
              {
                icon: Lock,
                title: "PCI Compliant",
                description: "Full PCI-DSS compliance for payment security",
              },
              {
                icon: RefreshCw,
                title: "Money-back Guarantee",
                description: "30-day money-back guarantee, no questions asked",
              },
              {
                icon: Headphones,
                title: "24/7 Support",
                description: "Round-the-clock support from our expert team",
              },
            ].map((item) => (
              <Card key={item.title} className="text-center overflow-visible">
                <CardContent className="pt-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 mx-auto mb-4">
                    <item.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 lg:py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Loved by developers
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              See what our customers have to say
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                name: "Sarah Chen",
                role: "CTO at TechStartup",
                content: "The API is incredibly reliable and the documentation is top-notch. Integration took less than an hour.",
              },
              {
                name: "Michael Torres",
                role: "Lead Developer at DevCo",
                content: "Multiple payment options made it easy for our international team. The Solana integration is seamless.",
              },
              {
                name: "Emily Johnson",
                role: "Founder at BuildScale",
                content: "Best developer experience I've had. The API keys are delivered instantly and support is always helpful.",
              },
            ].map((testimonial) => (
              <Card key={testimonial.name} className="overflow-visible">
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-chart-4 text-chart-4" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">
                        {testimonial.name.split(" ").map((n) => n[0]).join("")}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-gradient-to-r from-primary to-primary/80 p-8 md:p-12 lg:p-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
              Ready to get started?
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/90 max-w-2xl mx-auto">
              Join thousands of developers who trust APIKeys.io for their API needs.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/pricing">
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full sm:w-auto"
                  data-testid="button-cta-get-started"
                >
                  Get Your API Keys
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/docs">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                  data-testid="button-cta-docs"
                >
                  Read Documentation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
