"use client";

import { useState } from "react";
import { X, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface EcosystemApp {
  name: string;
  description: string;
  url: string;
  gradient: string;
  icon: string;
}

const ecosystemApps: EcosystemApp[] = [
  {
    name: "Prodify",
    description: "Task Management & Productivity",
    url: "http://localhost:8001/en",
    gradient: "from-purple-500 via-blue-500 to-pink-500",
    icon: "P"
  },
  {
    name: "OnScope", 
    description: "Visual Web Editor",
    url: "http://localhost:8002/en",
    gradient: "from-red-500 via-orange-500 to-pink-500",
    icon: "O"
  },
  {
    name: "JazzUp",
    description: "Collaborative Canvas", 
    url: "http://localhost:5173",
    gradient: "from-blue-400 via-cyan-400 to-green-400",
    icon: "J"
  },
  {
    name: "DeepQuest",
    description: "AI-Powered Search Engine",
    url: "http://localhost:3001",
    gradient: "from-purple-600 via-blue-600 to-pink-600",
    icon: "D"
  },
  {
    name: "OpenUIX",
    description: "AI Interface Platform",
    url: "http://localhost:5050",
    gradient: "from-pink-500 via-yellow-500 to-blue-500",
    icon: "O"
  },
  {
    name: "TestPath",
    description: "API Testing & Development",
    url: "http://localhost:3000",
    gradient: "from-teal-400 via-pink-400 to-purple-400",
    icon: "T"
  }
];

interface EcosystemPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EcosystemPopup = ({ isOpen, onClose }: EcosystemPopupProps) => {
  if (!isOpen) return null;

  const handleAppClick = (appName: string, url: string) => {
    // Para JazzUp, passar email do usuário
    if (appName === 'JazzUp') {
      try {
        const userDataStr = localStorage.getItem('user_data');
        let userEmail: string | null = null;
        
        if (userDataStr) {
          try {
            const userData = JSON.parse(userDataStr);
            userEmail = userData.email;
          } catch (e) {
            console.error('Erro ao parsear user_data:', e);
          }
        }
        
        if (userEmail) {
          const jazzupUrl = `${url}?email=${encodeURIComponent(userEmail)}`;
          console.log('🎨 Abrindo JazzUp com email do usuário:', userEmail);
          window.open(jazzupUrl, '_blank');
          return;
        }
      } catch (error) {
        console.error('❌ Erro ao preparar JazzUp:', error);
      }
    }
    
    // Se for OpenUIX, passar dados do usuário para SSO
    if (appName === 'OpenUIX') {
      try {
        // Pegar dados do usuário do localStorage (Prodify usa 'user_data' e 'auth_token')
        const userDataStr = localStorage.getItem('user_data');
        const authToken = localStorage.getItem('auth_token');
        
        let userEmail: string | null = null;
        
        // Tentar parsear user_data
        if (userDataStr) {
          try {
            const userData = JSON.parse(userDataStr);
            userEmail = userData.email;
          } catch (e) {
            console.error('Erro ao parsear user_data:', e);
          }
        }
        
        console.log('🔍 SSO Debug:', {
          userEmail,
          hasToken: !!authToken,
          userData: userDataStr
        });
        
        if (userEmail && authToken) {
          // Criar token SSO simples (base64 do email + timestamp)
          const ssoData = {
            email: userEmail,
            timestamp: Date.now(),
            source: 'prodify'
          };
          const ssoToken = btoa(JSON.stringify(ssoData));
          
          // Redirecionar com parâmetros SSO
          const ssoUrl = `${url}?sso_token=${ssoToken}&email=${encodeURIComponent(userEmail)}`;
          console.log('🔐 Abrindo OpenUIX com SSO:', userEmail);
          console.log('📝 URL SSO:', ssoUrl);
          window.open(ssoUrl, '_blank');
          return;
        } else {
          console.warn('⚠️ Dados de usuário não encontrados para SSO');
        }
      } catch (error) {
        console.error('❌ Erro ao preparar SSO:', error);
      }
    }
    
    // Se for TestPath, passar dados do usuário para SSO
    if (appName === 'TestPath') {
      try {
        const userDataStr = localStorage.getItem('user_data');
        const authToken = localStorage.getItem('auth_token');
        
        let userEmail: string | null = null;
        let userName: string | null = null;
        
        if (userDataStr) {
          try {
            const userData = JSON.parse(userDataStr);
            userEmail = userData.email;
            userName = userData.name || userData.email?.split('@')[0];
          } catch (e) {
            console.error('Erro ao parsear user_data:', e);
          }
        }
        
        console.log('🔍 TestPath SSO Debug:', {
          userEmail,
          userName,
          hasToken: !!authToken
        });
        
        if (userEmail && authToken) {
          // Criar token SSO para TestPath
          const ssoData = {
            email: userEmail,
            name: userName,
            timestamp: Date.now(),
            source: 'prodify'
          };
          const ssoToken = btoa(JSON.stringify(ssoData));
          
          // Redirecionar para endpoint de autenticação do TestPath
          const testpathUrl = `http://localhost:3170/v1/auth/prodify?sso_token=${ssoToken}`;
          console.log('🔐 Abrindo TestPath com SSO:', userEmail);
          console.log('📝 URL SSO:', testpathUrl);
          window.open(testpathUrl, '_blank');
          return;
        } else {
          console.warn('⚠️ Dados de usuário não encontrados para SSO do TestPath');
        }
      } catch (error) {
        console.error('❌ Erro ao preparar SSO do TestPath:', error);
      }
    }
    
    // Para outros apps ou se SSO falhar, abrir normalmente
    console.log('📂 Abrindo app normalmente:', appName);
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4" style={{ top: 0, left: 0, right: 0, bottom: 0 }}>
      <div className="bg-gray-900 rounded-2xl border border-gray-700 max-w-4xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-white">Affinify Ecosystem</h2>
            <p className="text-gray-400 mt-1">Choose an application to explore</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Apps Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ecosystemApps.map((app, index) => (
              <div
                key={index}
                onClick={() => handleAppClick(app.name, app.url)}
                className={cn(
                  "group relative overflow-hidden rounded-xl border border-gray-700 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl",
                  `bg-gradient-to-br ${app.gradient}`
                )}
              >
                <div className="p-6 h-32 flex flex-col justify-between">
                  {/* App Icon */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
                      <span className="text-2xl font-bold text-white">{app.icon}</span>
                    </div>
                    <ExternalLink className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
                  </div>
                  
                  {/* App Info */}
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-white/90">
                      {app.name}
                    </h3>
                    <p className="text-sm text-white/80 group-hover:text-white/70">
                      {app.description}
                    </p>
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700 bg-gray-800/50">
          <p className="text-center text-gray-400 text-sm">
            All applications are part of the Affinify ecosystem and work seamlessly together
          </p>
        </div>
      </div>
    </div>
  );
};
