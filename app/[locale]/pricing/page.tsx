"use client";

import { Pricing } from "@/components/pricing";
import { ToolsIntegrationInfo } from "@/components/tools-integration-info";
import { Nav } from "@/components/home/nav/Nav";
import { Footer } from "@/components/home/footer/Footer";

const PricingPage = () => {
  // Pricing plans data
  const pricingPlans = [
    {
      name: "Starter",
      price: "0",
      yearlyPrice: "0",
      period: "month",
      features: [
        "💲 US$ 0 / month",
        "Up to 3 workspaces (Super Productive)",
        "Basic task management",
        "Simple mind maps",
        "Basic Hoppscotch (API testing)",
        "⚡ 10 AI credits/month for testing:",
        "• Search in Perplexica",
        "• Generate 1–2 images in Jaaz",
        "• Simple AI chat (Open WebUI)",
        "Community support"
      ],
      description: "Perfect for individuals getting started with productivity tools",
      buttonText: "Get Started Free",
      href: "/sign-up",
      isPopular: false,
    },
    {
      name: "Professional",
      price: "29",
      yearlyPrice: "278",
      period: "month",
      features: [
        "💲 US$ 29 / month",
        "⚡ 300 AI credits/month",
        "Unlimited workspaces",
        "Super Productive complete (advanced tasks, pomodoro, analytics)",
        "Onlook → AI for code (editing, Next.js generation, Figma/GitHub integration)",
        "Jaaz → images, advanced images, short videos",
        "Perplexica → all modes (academic, YouTube, Reddit, Wolfram etc.)",
        "Open WebUI → AI Chat + RAG on documents + image generation",
        "Hoppscotch → real-time collaboration",
        "Priority support"
      ],
      description: "Most popular - Best for teams and professionals",
      buttonText: "Start Free Trial",
      href: "/sign-up",
      isPopular: true,
    },
    {
      name: "Enterprise",
      price: "59",
      yearlyPrice: "566",
      period: "month",
      features: [
        "💲 US$ 59 / month",
        "⚡ 500 AI credits/month",
        "Everything in Professional",
        "Long videos and storyboard in Jaaz",
        "Open WebUI with external model integration (Groq, Gemini, Anthropic, etc.)",
        "Advanced permissions (Admin, Editor, Viewer)",
        "Custom branding and own domain",
        "Custom integrations (Slack, GitHub, Drive)",
        "Dedicated support (SLA, guaranteed response time)"
      ],
      description: "For large organizations with advanced needs",
      buttonText: "Contact Sales",
      href: "/contact",
      isPopular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <Pricing 
        plans={pricingPlans}
        title="Choose Your Perfect Plan"
        description="Select the ideal plan for your productivity needs with Super Productive + Onlook + Jaaz + Perplexica + Open WebUI + Hoppscotch integrated suite"
      />
      <ToolsIntegrationInfo />
      <Footer />
    </div>
  );
};

export default PricingPage;