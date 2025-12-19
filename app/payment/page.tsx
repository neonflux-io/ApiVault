"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  ArrowLeft, ArrowRight, Shield, Lock, Copy, Check,
  Loader2, Wallet, Building2, CreditCard, QrCode, AlertTriangle
} from "lucide-react";
import { SiPaypal, SiSolana, SiBitcoin, SiEthereum, SiBinance, SiTether } from "react-icons/si";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/products";
import { checkoutFormSchema, type CheckoutFormData } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import PayPalButton from "@/components/PayPalButton";

type PaymentMethod =
  | "paypal"
  | "solana"
  | "bitcoin"
  | "ethereum"
  | "bnb"
  | "bep20"
  | "bank_transfer";

const SOLANA_WALLET_ADDRESS = "3uZL1rwJ9Df7Ah8eMd7tFTLcyPz6rEmrmJ9sLYZksKfZ";
const BITCOIN_WALLET_ADDRESS = "bc1p5v0ym35mxtpmxqa7k6athmj65kwrhjl3nezgtl07zl69x50rulsscygk34";
const ETHEREUM_WALLET_ADDRESS = "0xCaa09287482B6a0662d824700BF9911ff654bC89";
const BNB_WALLET_ADDRESS = "0xd76c48c24a1d8baff9101b55f3a792e7647668e3";
const BEP20_WALLET_ADDRESS = "0x32373844928ddCe6991f8f3EcDC4948839B69a9f";

export default function Payment() {
  const { items, getTotal, clearCart } = useCart();
  const router = useRouter();
  const { toast } = useToast();
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
  const [copied, setCopied] = useState(false);
  const [showTransactionInput, setShowTransactionInput] = useState(false);
  const [transactionLink, setTransactionLink] = useState("");
  const total = getTotal();

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      paymentMethod: "paypal",
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: async (data: CheckoutFormData) => {
      // Calculate total quantity from all cart items
      const quantity = items.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0);
      
      console.log(`[Payment] Cart items:`, items);
      console.log(`[Payment] Calculated quantity: ${quantity}`);
      console.log(`[Payment] Sending order with quantity: ${quantity}`);
      
      const response = await apiRequest("POST", "/api/orders", {
        productId: items[0]?.product.id,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        paymentMethod: data.paymentMethod,
        amount: total,
        currency: "USD",
        quantity: quantity,
      });
      return response.json();
    },
    onSuccess: (data) => {
      clearCart();
      router.push(`/confirmation/${data.id}`);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create order. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCopyAddress = async (address: string) => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    toast({
      title: "Copied",
      description: "Wallet address copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const showMaintenanceToast = (methodLabel: string) => {
    toast({
      title: "Site Under Renovation",
      description: `The site is currently undergoing renovations and ${methodLabel} payments are not working. Please use cryptocurrency to complete your purchase.`,
      variant: "destructive",
    });
  };

  const handleSubmitBankTransfer = () => {
    showMaintenanceToast("Bank transfer");
  };

  const handleSubmitCrypto = (method: Exclude<PaymentMethod, "paypal" | "bank_transfer">) => {
    if (!form.getValues("customerName") || !form.getValues("customerEmail")) {
      toast({
        title: "Missing Information",
        description: "Please fill in your name and email address.",
        variant: "destructive",
      });
      return;
    }
    createOrderMutation.mutate({
      ...form.getValues(),
      transactionLink,
    });
  };

  const handleSubmitSolana = () => {
    handleSubmitCrypto("solana");
  };

  // Prevent submitting PayPal form – always show maintenance
  const handleSelectPaypal = () => {
    setSelectedPayment("paypal");
    setShowTransactionInput(false);
    setTransactionLink("");
    showMaintenanceToast("PayPal");
  };

  if (items.length === 0) {
    return (
      <div className="py-20 lg:py-32">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-4">No items in cart</h1>
          <p className="text-muted-foreground mb-8">
            Please add an API plan to your cart to continue.
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
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/checkout">
            <Button variant="ghost" size="sm" data-testid="button-back-cart">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Cart
            </Button>
          </Link>
        </div>

        <h1 className="text-3xl font-bold tracking-tight mb-2">Complete Your Purchase</h1>
        <p className="text-muted-foreground mb-8">
          Choose your preferred payment method to complete the order
        </p>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Payment Options */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <Card className="overflow-visible">
              <CardHeader>
                <CardTitle className="text-lg">Customer Information</CardTitle>
                <CardDescription>
                  Enter your details to receive your API key
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="customerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Your Name" 
                              {...field} 
                              data-testid="input-name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="customerEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="Your email address" 
                              {...field}
                              data-testid="input-email"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </Form>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">Select Payment Method</h2>

              {/* Cryptocurrency Payments */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">Cryptocurrency Payments</h3>
                {/* Solana */}
                  <Card
                    className={`cursor-pointer transition-all overflow-visible ${
                      selectedPayment === "solana" ? "border-primary ring-1 ring-primary" : ""
                    }`}
                    onClick={() => {
                      setSelectedPayment("solana");
                      setShowTransactionInput(false);
                      setTransactionLink("");
                    }}
                    data-testid="card-payment-solana"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#9945FF]/10 to-[#14F195]/10">
                            <SiSolana className="h-5 w-5 text-[#9945FF]" />
                          </div>
                          <div>
                            <CardTitle className="text-base">Pay with Solana</CardTitle>
                            <CardDescription className="text-xs">
                              Fast cryptocurrency payment
                            </CardDescription>
                          </div>
                        </div>
                        <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                          selectedPayment === "solana" ? "border-primary bg-primary" : "border-muted"
                        }`}>
                          {selectedPayment === "solana" && (
                            <Check className="h-3 w-3 text-primary-foreground" />
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    {selectedPayment === "solana" && (
                      <CardContent className="pt-0">
                        <Separator className="mb-4" />
                        {!showTransactionInput ? (
                          <div className="space-y-4">
                            <div className="flex items-center justify-center p-6 bg-muted rounded-lg">
                              <div className="text-center space-y-3">
                                <div className="h-32 w-32 bg-background rounded-lg flex items-center justify-center mx-auto border">
                                  <QrCode className="h-24 w-24 text-muted-foreground/50" />
                                </div>
                                <p className="text-xs text-muted-foreground">Scan with your Solana wallet</p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs text-muted-foreground">Wallet Address</Label>
                              <div className="flex gap-2">
                                <Input
                                  value={SOLANA_WALLET_ADDRESS}
                                  readOnly
                                  className="font-mono text-xs"
                                  data-testid="input-solana-address"
                                />
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleCopyAddress(SOLANA_WALLET_ADDRESS)}
                                  data-testid="button-copy-address"
                                >
                                  {copied ? (
                                    <Check className="h-4 w-4" />
                                  ) : (
                                    <Copy className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </div>
                            <Button
                              className="w-full"
                              onClick={() => setShowTransactionInput(true)}
                              disabled={createOrderMutation.isPending}
                              data-testid="button-confirm-solana"
                            >
                              {createOrderMutation.isPending ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <Wallet className="mr-2 h-4 w-4" />
                                  I've Sent the Payment
                                </>
                              )}
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="transaction-link">Transaction Link</Label>
                              <Input
                                id="transaction-link"
                                placeholder="Please input transaction link"
                                value={transactionLink}
                                onChange={(e) => setTransactionLink(e.target.value)}
                              />
                            </div>
                            <Button
                              className="w-full"
                              onClick={handleSubmitSolana}
                              disabled={createOrderMutation.isPending || !transactionLink.trim()}
                            >
                              {createOrderMutation.isPending ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <Check className="mr-2 h-4 w-4" />
                                  Confirm Transaction
                                </>
                              )}
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    )}
                  </Card>

                  {/* Bitcoin */}
                  <Card
                    className={`cursor-pointer transition-all overflow-visible ${
                      selectedPayment === "bitcoin" ? "border-primary ring-1 ring-primary" : ""
                    }`}
                    onClick={() => {
                      setSelectedPayment("bitcoin");
                      setShowTransactionInput(false);
                      setTransactionLink("");
                    }}
                    data-testid="card-payment-bitcoin"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F7931A]/10">
                            <SiBitcoin className="h-5 w-5 text-[#F7931A]" />
                          </div>
                          <div>
                            <CardTitle className="text-base">Pay with Bitcoin</CardTitle>
                            <CardDescription className="text-xs">
                              Global BTC payment
                            </CardDescription>
                          </div>
                        </div>
                        <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                          selectedPayment === "bitcoin" ? "border-primary bg-primary" : "border-muted"
                        }`}>
                          {selectedPayment === "bitcoin" && (
                            <Check className="h-3 w-3 text-primary-foreground" />
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    {selectedPayment === "bitcoin" && (
                      <CardContent className="pt-0">
                        <Separator className="mb-4" />
                        {!showTransactionInput ? (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">Bitcoin Address</Label>
                            <div className="flex gap-2">
                              <Input
                                value={BITCOIN_WALLET_ADDRESS}
                                readOnly
                                className="font-mono text-xs"
                              />
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleCopyAddress(BITCOIN_WALLET_ADDRESS)}
                              >
                                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                              </Button>
                            </div>
                          </div>
                          <Button
                            className="w-full"
                            onClick={() => setShowTransactionInput(true)}
                            disabled={createOrderMutation.isPending}
                          >
                            {createOrderMutation.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <Wallet className="mr-2 h-4 w-4" />
                                I've Sent the Payment
                              </>
                            )}
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="transaction-link">Transaction Link</Label>
                            <Input
                              id="transaction-link"
                              placeholder="Please input transaction link"
                              value={transactionLink}
                              onChange={(e) => setTransactionLink(e.target.value)}
                            />
                          </div>
                          <Button
                            className="w-full"
                            onClick={() => handleSubmitCrypto("bitcoin")}
                            disabled={createOrderMutation.isPending || !transactionLink.trim()}
                          >
                            {createOrderMutation.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <Check className="mr-2 h-4 w-4" />
                                Confirm Transaction
                              </>
                            )}
                          </Button>
                        </div>
                      )
                  }                     </CardContent>
                  )                   } </Card>

                  {/* Ethereum */}
                  <Card
                    className={`cursor-pointer transition-all overflow-visible ${
                      selectedPayment === "ethereum" ? "border-primary ring-1 ring-primary" : ""
                    }`}
                    onClick={() => {
                      setSelectedPayment("ethereum");
                      setShowTransactionInput(false);
                      setTransactionLink("");
                    }}
                    data-testid="card-payment-ethereum"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#627EEA]/10">
                            <SiEthereum className="h-5 w-5 text-[#627EEA]" />
                          </div>
                          <div>
                            <CardTitle className="text-base">Pay with Ethereum</CardTitle>
                            <CardDescription className="text-xs">
                              ETH on mainnet
                            </CardDescription>
                          </div>
                        </div>
                        <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                          selectedPayment === "ethereum" ? "border-primary bg-primary" : "border-muted"
                        }`}>
                          {selectedPayment === "ethereum" && (
                            <Check className="h-3 w-3 text-primary-foreground" />
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    {selectedPayment === "ethereum" && (
                      <CardContent className="pt-0">
                        <Separator className="mb-4" />
                        {!showTransactionInput ? (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">Ethereum Address</Label>
                            <div className="flex gap-2">
                              <Input
                                value={ETHEREUM_WALLET_ADDRESS}
                                readOnly
                                className="font-mono text-xs"
                              />
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleCopyAddress(ETHEREUM_WALLET_ADDRESS)}
                              >
                                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                              </Button>
                            </div>
                          </div>
                          <Button
                            className="w-full"
                            onClick={() => setShowTransactionInput(true)}
                            disabled={createOrderMutation.isPending}
                          >
                            {createOrderMutation.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <Wallet className="mr-2 h-4 w-4" />
                                I've Sent the Payment
                              </>
                            )}
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="transaction-link">Transaction Link</Label>
                            <Input
                              id="transaction-link"
                              placeholder="Please input transaction link"
                              value={transactionLink}
                              onChange={(e) => setTransactionLink(e.target.value)}
                            />
                          </div>
                          <Button
                            className="w-full"
                            onClick={() => handleSubmitCrypto("ethereum")}
                            disabled={createOrderMutation.isPending || !transactionLink.trim()}
                          >
                            {createOrderMutation.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <Check className="mr-2 h-4 w-4" />
                                Confirm Transaction
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </CardContent>
                    )}
                  </Card>

                  {/* BNB */}
                  <Card
                    className={`cursor-pointer transition-all overflow-visible ${
                      selectedPayment === "bnb" ? "border-primary ring-1 ring-primary" : ""
                    }`}
                    onClick={() => {
                      setSelectedPayment("bnb");
                      setShowTransactionInput(false);
                      setTransactionLink("");
                    }}
                    data-testid="card-payment-bnb"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F3BA2F]/10">
                            <SiBinance className="h-5 w-5 text-[#F3BA2F]" />
                          </div>
                          <div>
                            <CardTitle className="text-base">Pay with BNB</CardTitle>
                            <CardDescription className="text-xs">
                              BNB on BNB Chain
                            </CardDescription>
                          </div>
                        </div>
                        <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                          selectedPayment === "bnb" ? "border-primary bg-primary" : "border-muted"
                        }`}>
                          {selectedPayment === "bnb" && (
                            <Check className="h-3 w-3 text-primary-foreground" />
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    {selectedPayment === "bnb" && (
                      <CardContent className="pt-0">
                        <Separator className="mb-4" />
                        {!showTransactionInput ? (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">BNB Address</Label>
                            <div className="flex gap-2">
                              <Input
                                value={BNB_WALLET_ADDRESS}
                                readOnly
                                className="font-mono text-xs"
                              />
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleCopyAddress(BNB_WALLET_ADDRESS)}
                              >
                                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                              </Button>
                            </div>
                          </div>
                          <Button
                            className="w-full"
                            onClick={() => setShowTransactionInput(true)}
                            disabled={createOrderMutation.isPending}
                          >
                            {createOrderMutation.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <Wallet className="mr-2 h-4 w-4" />
                                I've Sent the Payment
                              </>
                            )}
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="transaction-link">Transaction Link</Label>
                            <Input
                              id="transaction-link"
                              placeholder="Please input transaction link"
                              value={transactionLink}
                              onChange={(e) => setTransactionLink(e.target.value)}
                            />
                          </div>
                          <Button
                            className="w-full"
                            onClick={() => handleSubmitCrypto("bnb")}
                            disabled={createOrderMutation.isPending || !transactionLink.trim()}
                          >
                            {createOrderMutation.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <Check className="mr-2 h-4 w-4" />
                                Confirm Transaction
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </CardContent>
                    )}
                  </Card>

                  {/* BEP20 */}
                  <Card
                    className={`cursor-pointer transition-all overflow-visible ${
                      selectedPayment === "bep20" ? "border-primary ring-1 ring-primary" : ""
                    }`}
                    onClick={() => {
                      setSelectedPayment("bep20");
                      setShowTransactionInput(false);
                      setTransactionLink("");
                    }}
                    data-testid="card-payment-bep20"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#26A17B]/10">
                            <SiTether className="h-5 w-5 text-[#26A17B]" />
                          </div>
                          <div>
                            <CardTitle className="text-base">Pay with BEP20</CardTitle>
                            <CardDescription className="text-xs">
                              BEP20 tokens on BNB Chain
                            </CardDescription>
                          </div>
                        </div>
                        <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                          selectedPayment === "bep20" ? "border-primary bg-primary" : "border-muted"
                        }`}>
                          {selectedPayment === "bep20" && (
                            <Check className="h-3 w-3 text-primary-foreground" />
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    {selectedPayment === "bep20" && (
                      <CardContent className="pt-0">
                        <Separator className="mb-4" />
                        {!showTransactionInput ? (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">BEP20 Address</Label>
                            <div className="flex gap-2">
                              <Input
                                value={BEP20_WALLET_ADDRESS}
                                readOnly
                                className="font-mono text-xs"
                              />
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleCopyAddress(BEP20_WALLET_ADDRESS)}
                              >
                                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                              </Button>
                            </div>
                          </div>
                          <Button
                            className="w-full"
                            onClick={() => setShowTransactionInput(true)}
                            disabled={createOrderMutation.isPending}
                          >
                            {createOrderMutation.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <Wallet className="mr-2 h-4 w-4" />
                                I've Sent the Payment
                              </>
                            )}
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="transaction-link">Transaction Link</Label>
                            <Input
                              id="transaction-link"
                              placeholder="Please input transaction link"
                              value={transactionLink}
                              onChange={(e) => setTransactionLink(e.target.value)}
                            />
                          </div>
                          <Button
                            className="w-full"
                            onClick={() => handleSubmitCrypto("bep20")}
                            disabled={createOrderMutation.isPending || !transactionLink.trim()}
                          >
                            {createOrderMutation.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <Check className="mr-2 h-4 w-4" />
                                Confirm Transaction
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </CardContent>
                    )}
                  </Card>
              </div>

              {/* Traditional Payments */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">Traditional Payments</h3>

              {/* PayPal */}
              <Card
                className={`cursor-pointer transition-all overflow-visible ${
                  selectedPayment === "paypal" ? "border-primary ring-1 ring-primary" : ""
                }`}
                onClick={handleSelectPaypal}
                data-testid="card-payment-paypal"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#003087]/10">
                        <SiPaypal className="h-5 w-5 text-[#003087]" />
                      </div>
                      <div>
                        <CardTitle className="text-base">Pay with PayPal</CardTitle>
                        <CardDescription className="text-xs">
                          Secure payment via PayPal
                        </CardDescription>
                      </div>
                    </div>
                    <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                      selectedPayment === "paypal" ? "border-primary bg-primary" : "border-muted"
                    }`}>
                      {selectedPayment === "paypal" && (
                        <Check className="h-3 w-3 text-primary-foreground" />
                      )}
                    </div>
                  </div>
                </CardHeader>
                {selectedPayment === "paypal" && (
                  <CardContent className="pt-0">
                    <Separator className="mb-4" />
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 rounded-md bg-destructive/10 border border-destructive/40 p-3">
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                        <p className="text-sm text-destructive">
                          The site is currently undergoing renovations and PayPal payments are not working. Please use cryptocurrency to complete your purchase.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Bank Transfer */}
              <Card
                className={`cursor-pointer transition-all overflow-visible ${
                  selectedPayment === "bank_transfer" ? "border-primary ring-1 ring-primary" : ""
                }`}
                onClick={() => {
                  setSelectedPayment("bank_transfer");
                  setShowTransactionInput(false);
                  setTransactionLink("");
                  showMaintenanceToast("Bank transfer");
                }}
                data-testid="card-payment-bank"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <Building2 className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <CardTitle className="text-base">Bank Transfer</CardTitle>
                        <CardDescription className="text-xs">
                          Wire transfer to our bank account
                        </CardDescription>
                      </div>
                    </div>
                    <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                      selectedPayment === "bank_transfer" ? "border-primary bg-primary" : "border-muted"
                    }`}>
                      {selectedPayment === "bank_transfer" && (
                        <Check className="h-3 w-3 text-primary-foreground" />
                      )}
                    </div>
                  </div>
                </CardHeader>
                {selectedPayment === "bank_transfer" && (
                  <CardContent className="pt-0">
                    <Separator className="mb-4" />
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 rounded-md bg-destructive/10 border border-destructive/40 p-3">
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                        <p className="text-sm text-destructive">
                          The site is currently undergoing renovations and bank account payments are not working. Please use cryptocurrency to complete your purchase.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            </div>
          </div>
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
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.product.requestsPerMonth.toLocaleString()} requests/mo
                      </p>
                    </div>
                    <span>{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Billed monthly. Cancel anytime.
                </p>
                
                <Separator />
                
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span>SSL Secured Checkout</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    <span>PCI Compliant</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    <span>30-day Money Back Guarantee</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
