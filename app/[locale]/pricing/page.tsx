"use client";

import { Pricing } from "@/components/pricing";
import { ToolsIntegrationInfo } from "@/components/tools-integration-info";
import { Nav } from "@/components/home/nav/Nav";
import { Footer } from "@/components/home/footer/Footer";

const PricingPage = () => {
  // Pricing plans data baseado no arquivo preco.txt
  const pricingPlans = [
    {
      name: "Free",
      price: "0",
      yearlyPrice: "0",
      period: "month",
      features: [
        "💲 US$ 0 / month",
        "⚡ 50 AI credits/month",
        "Up to 3 workspaces",
        "Super Productive: Basic tasks, simple mind maps, pomodoro, basic analytics",
        "Onlook: View only (no AI editing)",
        "Jaaz: Basic image generation (1 credit = 1 image)",
        "Perplexica: Basic search (2 credits per search)",
        "Open WebUI: Simple AI chat (1 credit per message)",
        "Hoppscotch: Basic API testing",
        "Community support"
      ],
      description: "Perfect for individuals getting started with productivity tools",
      buttonText: "Get Started Free",
      href: "/sign-up",
      isPopular: false,
    },
    {
      name: "Pro",
      price: "29",
      yearlyPrice: "278",
      period: "month",
      features: [
        "💲 US$ 29 / month",
        "⚡ 300 AI credits/month",
        "Unlimited workspaces",
        "Super Productive: All features (collaborative mind maps, advanced analytics)",
        "Onlook: Full AI code editing + Next.js project generation",
        "Jaaz: Images + advanced images + short videos",
        "Perplexica: All search modes (academic, YouTube, Reddit, etc.)",
        "Open WebUI: AI Chat + RAG on documents",
        "Hoppscotch: Real-time collaboration",
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
        "Everything in Pro",
        "Jaaz: Long videos + storyboard creation",
        "Open WebUI: External model integration (Groq, Gemini, Anthropic)",
        "Advanced permissions (Admin, Editor, Viewer)",
        "Custom branding and domain",
        "Custom integrations (Slack, GitHub, Drive)",
        "Dedicated support with SLA"
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