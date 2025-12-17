import type { Metadata } from "next";
import "./globals.css";
import { QueryClientProviderWrapper } from "./providers";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/lib/cart-context";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "APIKeys.io - Powerful APIs for Developers",
  description: "Get instant access to powerful APIs with flexible pricing. Secure API keys for developers with Solana, PayPal, and bank transfer payment options.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans">
        <QueryClientProviderWrapper>
          <ThemeProvider defaultTheme="light" storageKey="apikeys-theme">
            <TooltipProvider>
              <CartProvider>
                <div className="min-h-screen flex flex-col bg-background">
                  <Header />
                  <main className="flex-1">
                    {children}
                  </main>
                  <Footer />
                </div>
                <Toaster />
              </CartProvider>
            </TooltipProvider>
          </ThemeProvider>
        </QueryClientProviderWrapper>
      </body>
    </html>
  );
}

