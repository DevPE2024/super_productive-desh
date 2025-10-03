"use client";

import { Pricing } from "@/components/pricing";
import { Nav } from "@/components/home/nav/Nav";
import { Footer } from "@/components/home/footer/Footer";

const PricingPage = () => {
  // Dados dos planos de preços
  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      yearlyPrice: "$0",
      period: "month",
      features: [
        "Up to 3 workspaces",
        "Basic task management",
        "Simple mind maps",
        "Community support"
      ],
      description: "Perfect for individuals getting started",
      buttonText: "Get Started",
      href: "/sign-up",
      isPopular: false,
    },
    {
      name: "Pro",
      price: "$12",
      yearlyPrice: "$120",
      period: "month",
      features: [
        "Unlimited workspaces",
        "Advanced task management",
        "Collaborative mind maps",
        "Pomodoro timer",
        "Priority support",
        "Advanced analytics"
      ],
      description: "Best for teams and professionals",
      buttonText: "Start Free Trial",
      href: "/sign-up",
      isPopular: true,
    },
    {
      name: "Enterprise",
      price: "$29",
      yearlyPrice: "$290",
      period: "month",
      features: [
        "Everything in Pro",
        "Advanced security",
        "Custom integrations",
        "Dedicated support",
        "Custom branding",
        "Advanced permissions"
      ],
      description: "For large organizations",
      buttonText: "Contact Sales",
      href: "/contact",
      isPopular: false,
    },
  ];

  return (
    <>
      <Nav />
      <div className="w-full mx-auto max-w-screen-xl px-4 sm:px-6">
        <div className="py-12">
          <Pricing 
            plans={pricingPlans}
            title="Choose Your Plan"
            description="Select the perfect plan for your productivity needs"
          />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PricingPage;