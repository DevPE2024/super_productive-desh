"use client";

import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";

interface EcosystemApp {
  name: string;
  description: string;
  features: string[];
  gradient: string;
  icon: string;
}

const ecosystemApps: EcosystemApp[] = [
  {
    name: "Prodify",
    description: "Task Management & Productivity",
    features: ["Mind Maps", "Calendar", "Chat", "Pomodoro"],
    gradient: "from-purple-500 via-blue-500 to-pink-500",
    icon: "P"
  },
  {
    name: "OnScope", 
    description: "Visual Web Editor",
    features: ["AI-First Design", "React Builder", "Real-time Edit"],
    gradient: "from-red-500 via-orange-500 to-pink-500",
    icon: "O"
  },
  {
    name: "JazzUp",
    description: "Collaborative Canvas", 
    features: ["Magic Canvas", "AI Generation", "Real-time Collab"],
    gradient: "from-blue-400 via-cyan-400 to-green-400",
    icon: "J"
  },
  {
    name: "DeepQuest",
    description: "AI-Powered Search Engine",
    features: ["6 Focus Modes", "Real-time Search", "Citations"],
    gradient: "from-purple-600 via-blue-600 to-pink-600",
    icon: "D"
  },
  {
    name: "OpenUIX",
    description: "AI Interface Platform",
    features: ["Multi-LLM Support", "RAG", "Function Calling"],
    gradient: "from-pink-500 via-yellow-500 to-blue-500",
    icon: "O"
  },
  {
    name: "TestPath",
    description: "API Testing Tool",
    features: ["HTTP Methods", "GraphQL", "WebSocket", "MQTT"],
    gradient: "from-teal-400 via-pink-400 to-purple-400",
    icon: "T"
  }
];

interface EcosystemCarouselProps {
  className?: string;
}

export const EcosystemCarousel = ({ className }: EcosystemCarouselProps) => {
  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));

  return (
    <Carousel
      className={cn("w-full h-full", className)}
      plugins={[plugin.current]}
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent className="h-full w-full">
        {ecosystemApps.map((app, index) => (
          <CarouselItem key={index}>
            <div className="w-full overflow-hidden rounded-3xl border border-border h-fit">
              <AspectRatio ratio={16 / 9}>
                <div className={`w-full h-full bg-gradient-to-br ${app.gradient} flex flex-col items-center justify-center relative`}>
                  {/* App Icon */}
                  <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6 border-2 border-white/30">
                    <span className="text-4xl font-bold text-white">{app.icon}</span>
                  </div>
                  
                  {/* App Name */}
                  <h3 className="text-5xl font-bold text-white mb-4 text-center drop-shadow-lg">
                    {app.name}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-xl text-white/90 mb-6 text-center max-w-md">
                    {app.description}
                  </p>
                  
                  {/* Features */}
                  <div className="flex flex-wrap gap-2 justify-center mb-8">
                    {app.features.map((feature, idx) => (
                      <span 
                        key={idx}
                        className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm text-white/90 border border-white/30"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  
                  {/* Coming Soon Badge */}
                  <div className="px-6 py-3 bg-white/15 backdrop-blur-sm rounded-full border border-white/30">
                    <span className="text-lg font-semibold text-white">
                      Screenshot Coming Soon
                    </span>
                  </div>
                  
                  {/* Decorative Elements */}
                  <div className="absolute top-4 left-4 w-2 h-2 bg-white/40 rounded-full"></div>
                  <div className="absolute top-8 right-8 w-3 h-3 bg-white/30 rounded-full"></div>
                  <div className="absolute bottom-8 left-8 w-1 h-1 bg-white/50 rounded-full"></div>
                  <div className="absolute bottom-4 right-4 w-2 h-2 bg-white/40 rounded-full"></div>
                </div>
              </AspectRatio>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};
