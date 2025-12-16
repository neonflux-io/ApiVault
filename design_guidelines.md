# API Key Marketplace Design Guidelines

## Design Approach
**Reference-Based**: Drawing inspiration from Stripe, RapidAPI, and Vercel for professional API marketplace aesthetics that build trust through clarity, polish, and modern design patterns.

## Core Design Principles
1. **Trust Through Polish**: Every detail should signal legitimacy and professionalism
2. **Developer-Focused Clarity**: Clean, technical aesthetic without unnecessary decoration
3. **Payment Confidence**: Clear, secure-feeling transaction flows
4. **Conversion-Optimized**: Guide users smoothly from landing to purchase

## Typography System

**Font Families**:
- Primary: Inter or DM Sans (headings and UI)
- Secondary: JetBrains Mono or Fira Code (API keys, code snippets)

**Hierarchy**:
- Hero Headline: text-5xl to text-7xl, font-bold, tracking-tight
- Section Headings: text-3xl to text-4xl, font-semibold
- Subheadings: text-xl to text-2xl, font-medium
- Body Text: text-base to text-lg, leading-relaxed
- Small Print/Labels: text-sm, font-medium
- Code/Keys: font-mono, text-sm

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24
- Component padding: p-6, p-8
- Section spacing: py-20, py-24
- Card spacing: space-y-4, gap-6
- Tight groupings: space-y-2

**Container Strategy**:
- Full-width sections with inner max-w-7xl containers
- Form containers: max-w-2xl for focused experiences
- Content sections: max-w-6xl

## Component Library

### Navigation
- Sticky header with max-w-7xl container
- Logo left, navigation center/right, CTA button (Sign Up/Login)
- Mobile: Hamburger menu with slide-out drawer
- Height: h-16 to h-20, with subtle bottom border

### Hero Section
- **Layout**: Two-column split on desktop (60/40 ratio)
- **Left**: Headline, subheadline, dual CTAs (primary "Get API Keys", secondary "View Pricing")
- **Right**: Animated dashboard preview or code snippet visualization showing API key integration
- **Background**: Subtle gradient mesh or grid pattern for technical feel
- **Height**: 80vh to create impact without forcing scroll

### Trust Indicators Section
Immediately below hero:
- Logo grid of recognizable companies/brands (social proof)
- Single row: "Trusted by 10,000+ developers" with 4-6 company logos
- Padding: py-12

### Product Catalog / Pricing Tiers
- 3-column grid (single column mobile): grid-cols-1 md:grid-cols-3
- Each tier card includes:
  - Tier name and badge (Popular, Enterprise, etc.)
  - Large price display with currency
  - Feature list with checkmarks
  - Request limits and specifications
  - CTA button ("Get Started")
- Featured tier: Enhanced border, slight scale transform, or glow effect
- Card design: Rounded corners (rounded-xl), subtle shadow, hover lift effect

### Features Section
- Alternating two-column layouts: grid-cols-1 lg:grid-cols-2
- Text + illustration/icon pattern
- Features to highlight:
  - Instant API key delivery
  - Multiple payment methods
  - Developer documentation
  - 99.9% uptime guarantee
  - Dedicated support
- Icon strategy: Use Heroicons for consistency

### Security/Trust Section
- 4-column grid showcasing: grid-cols-2 lg:grid-cols-4
  - SSL encryption badge
  - PCI compliance indicator
  - Money-back guarantee
  - 24/7 support
- Each with icon, heading, brief description
- Background: Subtle contrast from main sections

### Payment Page Design
**Layout**: Centered card design (max-w-3xl)

**Order Summary Panel** (sticky on scroll):
- Selected API tier details
- Price breakdown
- Total amount prominent

**Payment Options Section**:
Three distinct option cards in vertical stack:

1. **Solana Card**:
   - Crypto icon + "Pay with Solana" heading
   - Wallet connection button
   - QR code display area
   - Wallet address with copy button
   - Transaction status indicator

2. **PayPal Card**:
   - PayPal logo + "Pay with PayPal" heading
   - Integrated PayPal checkout button
   - Security badge indicators

3. **Bank Transfer Card**:
   - Bank icon + "Bank Transfer" heading
   - Account details in bordered box with copy buttons:
     - Bank name
     - Account number
     - Routing number
     - Reference code
   - Payment instructions list
   - Expected processing time notice

**Card Treatment**:
- Border on hover to show selection
- Single selection radio button pattern
- Expanded state shows payment details
- Collapsed state shows just title + icon

### Confirmation Page
- Large success checkmark icon
- Order summary
- API key delivery timeline
- Next steps card with documentation links
- Support contact information

### Footer
- 4-column grid: grid-cols-2 lg:grid-cols-4
  - Product links
  - Resources (Documentation, API Reference, Status Page)
  - Company (About, Contact, Terms)
  - Newsletter signup with email input
- Bottom bar: Copyright, social links, security badges
- Background: Subtle contrast, well-separated from content

## Images Strategy

**Hero Image**: YES - Dashboard preview or code editor visualization
- Placement: Right side of hero section (40% width)
- Type: Screenshot of dashboard UI or animated code snippet showing API integration
- Treatment: Slight shadow, rounded corners, subtle glow effect

**Feature Section Images**: 
- Illustrations or icons representing security, speed, reliability
- Clean, modern line-art style or isometric illustrations
- Alternating left/right placement in feature rows

**Trust Section**:
- Company logos (grayscale, equal sizing)
- Security badge icons

**Payment Page**:
- Payment method logos (Solana, PayPal, bank icons)
- QR code placeholder for crypto payments

## Buttons on Images
When placing CTAs over hero background:
- Background: backdrop-blur-sm with semi-transparent background
- No custom hover states - rely on Button component's built-in interactions

## Animations
**Minimal and Purposeful**:
- Hero: Subtle fade-in on load
- Cards: Gentle hover lift (translate-y-1)
- Payment selection: Smooth expand/collapse transitions
- No scroll-triggered animations
- Loading states for payment processing

## Professional Trust Elements
- Prominent security badges throughout
- Clear terms and refund policy links
- SSL indicator in header
- Customer testimonials with avatars and company names
- Live chat support bubble (bottom-right)
- Transparent pricing with no hidden fees
- Money-back guarantee highlighted
- Professional error states and loading indicators for all payment flows