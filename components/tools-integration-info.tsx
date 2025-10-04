"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  Code, 
  Image, 
  Search, 
  MessageSquare, 
  Globe,
  Palette,
  Database,
  GitBranch,
  FileText,
  Video,
  Users
} from "lucide-react";

const tools = [
  {
    name: "Super Productive",
    icon: <Zap className="h-6 w-6" />,
    description: "Advanced task management with pomodoro timer, analytics, and workspace organization",
    features: ["Task Management", "Pomodoro Timer", "Analytics", "Workspaces"],
    color: "bg-blue-500"
  },
  {
    name: "Onlook",
    icon: <Code className="h-6 w-6" />,
    description: "AI-powered code generation and editing with Figma/GitHub integration",
    features: ["Code Generation", "Next.js Integration", "Figma Sync", "GitHub Integration"],
    color: "bg-purple-500"
  },
  {
    name: "Jaaz",
    icon: <Image className="h-6 w-6" />,
    description: "AI image and video generation with advanced editing capabilities",
    features: ["Image Generation", "Video Creation", "Storyboards", "Advanced Editing"],
    color: "bg-pink-500"
  },
  {
    name: "Perplexica",
    icon: <Search className="h-6 w-6" />,
    description: "Intelligent search across multiple sources and academic databases",
    features: ["Academic Search", "YouTube Search", "Reddit Integration", "Wolfram Alpha"],
    color: "bg-green-500"
  },
  {
    name: "Open WebUI",
    icon: <MessageSquare className="h-6 w-6" />,
    description: "Advanced AI chat with RAG capabilities and document processing",
    features: ["AI Chat", "Document RAG", "Image Generation", "Model Integration"],
    color: "bg-orange-500"
  },
  {
    name: "Hoppscotch",
    icon: <Globe className="h-6 w-6" />,
    description: "API testing and development with real-time collaboration",
    features: ["API Testing", "Real-time Collaboration", "Request Collections", "Environment Management"],
    color: "bg-teal-500"
  }
];

export function ToolsIntegrationInfo() {
  return (
    <div className="container py-16">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Integrated Tools Suite
        </h2>
        <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
          Super Productive integrates seamlessly with powerful tools to create the ultimate productivity ecosystem. 
          Each tool is designed to work together, providing you with everything you need for modern development and productivity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool, index) => (
          <Card key={index} className="relative overflow-hidden border-2 hover:border-primary/50 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${tool.color} text-white`}>
                  {tool.icon}
                </div>
                <CardTitle className="text-xl">{tool.name}</CardTitle>
              </div>
              <CardDescription className="text-sm leading-relaxed">
                {tool.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {tool.features.map((feature, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-16 bg-muted/50 rounded-2xl p-8">
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-bold">How AI Credits Work</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            AI credits (⚡) are consumed when using AI-powered features across all integrated tools. 
            Different actions consume different amounts of credits based on computational complexity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          <div className="bg-background rounded-lg p-4 border">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              Low Cost (1-2 credits)
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Simple AI chat messages</li>
              <li>• Basic search queries</li>
              <li>• Text generation</li>
            </ul>
          </div>

          <div className="bg-background rounded-lg p-4 border">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Zap className="h-4 w-4 text-orange-500" />
              Medium Cost (3-5 credits)
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Image generation</li>
              <li>• Code generation</li>
              <li>• Document analysis</li>
            </ul>
          </div>

          <div className="bg-background rounded-lg p-4 border">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Zap className="h-4 w-4 text-red-500" />
              High Cost (6-10 credits)
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Video generation</li>
              <li>• Complex code refactoring</li>
              <li>• Advanced image editing</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}