"use client";

import { Pricing } from "@/components/pricing";
import { Nav } from "@/components/home/nav/Nav";
import { Footer } from "@/components/home/footer/Footer";

const PricingPage = () => {
  // Dados dos planos de preços
  const pricingPlans = [
    {
      name: "Free",
      price: "0",
      yearlyPrice: "0",
      period: "month",
      features: [
        "Até 3 workspaces",
        "Tarefas básicas",
        "Mapas mentais simples",
        "Suporte via comunidade"
      ],
      description: "Perfect for individuals getting started",
      buttonText: "Get Started",
      href: "/sign-up",
      isPopular: false,
    },
    {
      name: "Pro",
      price: "29",
      yearlyPrice: "278",
      period: "month",
      features: [
        "Workspaces ilimitados",
        "Gestão avançada de tarefas",
        "Mapas mentais colaborativos",
        "Timer Pomodoro",
        "Suporte prioritário",
        "Analytics avançado",
        "300 pontos/mês para IA"
      ],
      description: "Best for teams and professionals",
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
        "Tudo do Pro",
        "Segurança avançada",
        "Integrações customizadas",
        "Domínio próprio + branding",
        "Suporte dedicado",
        "Permissões avançadas",
        "500 pontos/mês para IA"
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