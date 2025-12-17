"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Book, Code2, Key, ArrowRight, Terminal, 
  Zap, Shield, Clock, Copy, Check
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Docs() {
  const { toast } = useToast();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = async (code: string, id: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(id);
    toast({
      title: "Copied",
      description: "Code copied to clipboard",
    });
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const codeExamples = {
    javascript: `const response = await fetch('https://api.apikeys.io/v1/data', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data);`,
    python: `import requests

headers = {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
}

response = requests.get(
    'https://api.apikeys.io/v1/data',
    headers=headers
)

data = response.json()
print(data)`,
    curl: `curl -X GET 'https://api.apikeys.io/v1/data' \\
  -H 'Authorization: Bearer YOUR_API_KEY' \\
  -H 'Content-Type: application/json'`,
  };

  return (
    <div className="py-12 lg:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <Badge variant="secondary" className="mb-4">
            <Book className="mr-1.5 h-3.5 w-3.5" />
            Documentation
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            API Documentation
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Everything you need to integrate our API into your applications.
            Get started in minutes with our comprehensive guides and examples.
          </p>
        </div>

        {/* Quick Start */}
        <Card className="mb-8 overflow-visible">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <CardTitle>Quick Start</CardTitle>
            </div>
            <CardDescription>
              Get up and running with our API in just a few steps
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Get Your API Key</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Purchase an API key from our pricing page. Keys are delivered instantly.
                  </p>
                  <Link href="/pricing">
                    <Button variant="outline" size="sm" data-testid="button-get-api-key">
                      Get API Key
                      <ArrowRight className="ml-2 h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Set Up Authentication</h3>
                  <p className="text-sm text-muted-foreground">
                    Add your API key to the Authorization header of all requests.
                  </p>
                  <div className="mt-3 rounded-lg bg-muted p-3 font-mono text-sm">
                    Authorization: Bearer YOUR_API_KEY
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Make Your First Request</h3>
                  <p className="text-sm text-muted-foreground">
                    Use the code examples below to make your first API call.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Code Examples */}
        <Card className="mb-8 overflow-visible">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Code2 className="h-5 w-5 text-primary" />
              <CardTitle>Code Examples</CardTitle>
            </div>
            <CardDescription>
              Sample code in popular programming languages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="javascript" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                <TabsTrigger value="python">Python</TabsTrigger>
                <TabsTrigger value="curl">cURL</TabsTrigger>
              </TabsList>
              {Object.entries(codeExamples).map(([lang, code]) => (
                <TabsContent key={lang} value={lang}>
                  <div className="relative">
                    <pre className="rounded-lg bg-muted p-4 overflow-x-auto">
                      <code className="text-sm font-mono">{code}</code>
                    </pre>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => handleCopyCode(code, lang)}
                      data-testid={`button-copy-${lang}`}
                    >
                      {copiedCode === lang ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* API Endpoints */}
        <Card className="mb-8 overflow-visible">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Terminal className="h-5 w-5 text-primary" />
              <CardTitle>API Endpoints</CardTitle>
            </div>
            <CardDescription>
              Available endpoints and their usage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  method: "GET",
                  path: "/v1/data",
                  description: "Retrieve all available data",
                },
                {
                  method: "GET",
                  path: "/v1/data/:id",
                  description: "Retrieve specific data by ID",
                },
                {
                  method: "POST",
                  path: "/v1/data",
                  description: "Create new data entry",
                },
                {
                  method: "PUT",
                  path: "/v1/data/:id",
                  description: "Update existing data",
                },
                {
                  method: "DELETE",
                  path: "/v1/data/:id",
                  description: "Delete data entry",
                },
              ].map((endpoint) => (
                <div
                  key={`${endpoint.method}-${endpoint.path}`}
                  className="flex items-center gap-4 p-3 rounded-lg border"
                >
                  <Badge
                    variant={endpoint.method === "GET" ? "secondary" : endpoint.method === "POST" ? "default" : "outline"}
                    className="font-mono shrink-0"
                  >
                    {endpoint.method}
                  </Badge>
                  <code className="font-mono text-sm flex-1">{endpoint.path}</code>
                  <span className="text-sm text-muted-foreground hidden sm:block">
                    {endpoint.description}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Rate Limits & Authentication */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card className="overflow-visible">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Rate Limits</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Starter</span>
                  <span className="font-medium">100 req/min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Professional</span>
                  <span className="font-medium">500 req/min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Enterprise</span>
                  <span className="font-medium">Unlimited</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Rate limit headers are included in all API responses.
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-visible">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Authentication</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <p className="text-muted-foreground">
                  All API requests require authentication using a Bearer token.
                </p>
                <div className="rounded-lg bg-muted p-3 font-mono text-xs">
                  Authorization: Bearer sk_live_...
                </div>
                <p className="text-xs text-muted-foreground">
                  Keep your API key secure and never expose it in client-side code.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Support CTA */}
        <Card className="overflow-visible">
          <CardContent className="py-8">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Need Help?</h2>
              <p className="text-muted-foreground mb-6">
                Our support team is available 24/7 to help you with any questions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button data-testid="button-contact-support">
                  Contact Support
                </Button>
                <Button variant="outline" data-testid="button-view-faq">
                  View FAQ
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
