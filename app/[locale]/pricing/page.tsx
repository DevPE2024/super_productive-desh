"use client";

import { Pricing } from "@/components/pricing";
import { ToolsIntegrationInfo } from "@/components/tools-integration-info";
import { Nav } from "@/components/home/nav/Nav";
import { Footer } from "@/components/home/footer/Footer";

const PricingPage = () => {
  // Pricing plans data baseado no novo sistema de créditos
  const pricingPlans = [
    {
      name: "Free",
      price: "0",
      yearlyPrice: "0",
      period: "month",
      features: [
        "💲 US$ 0 / month",
        "⚡ 40 AI credits/month (10 per app)",
        "Up to 3 workspaces",
        "OnScope: 10 credits (2 projects)",
        "JazzUp: 10 credits (2 images)",
        "DeepQuest: 10 credits (5 searches)",
        "OpenUIX: 10 credits (10 chats)",
        "Prodify Hub: Unlimited (tasks, pomodoro, analytics)",
        "TestPath: Unlimited (API testing)",
        "Community support"
      ],
      description: "Perfect for individuals getting started with productivity tools",
      buttonText: "Get Started Free",
      href: "/sign-up",
      isPopular: false,
    },
    {
      name: "Pro",
      price: "25",
      yearlyPrice: "240",
      period: "month",
      features: [
        "💲 US$ 25 / month",
        "⚡ 400 AI credits/month (100 per app)",
        "Unlimited workspaces",
        "OnScope: 100 credits (20+ projects)",
        "JazzUp: 100 credits (20 images/videos)",
        "DeepQuest: 100 credits (50 searches)",
        "OpenUIX: 100 credits (100 chats or 25 RAG)",
        "Prodify Hub: Unlimited (all features)",
        "TestPath: Unlimited (real-time collaboration)",
        "Priority support"
      ],
      description: "Most popular - Best for teams and professionals",
      buttonText: "Start Free Trial",
      href: "/api/stripe/checkout?priceId=price_pro_monthly",
      isPopular: true,
    },
    {
      name: "Max",
      price: "60",
      yearlyPrice: "576",
      period: "month",
      features: [
        "💲 US$ 60 / month",
        "⚡ 800 AI credits/month (200 per app)",
        "Everything in Pro",
        "OnScope: 200 credits (40+ projects)",
        "JazzUp: 200 credits (40+ advanced media)",
        "DeepQuest: 200 credits (100+ searches)",
        "OpenUIX: 200 credits (200 chats or 50 RAG)",
        "Advanced permissions & custom branding",
        "External model integrations",
        "Dedicated support with SLA"
      ],
      description: "For large organizations with advanced needs",
      buttonText: "Start Free Trial",
      href: "/api/stripe/checkout?priceId=price_max_monthly",
      isPopular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <Pricing 
        plans={pricingPlans}
        title="Choose Your Perfect Plan"
        description="Select the ideal plan for your productivity needs with Prodify + Onlook + Jaaz + Perplexica + Open WebUI + Hoppscotch integrated suite"
      />
      <ToolsIntegrationInfo />
      <Footer />
    </div>
  );
};

export default PricingPage;