'use client'

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { 
  Activity, Users, UserCheck, Calendar, FileText, Receipt, Stethoscope
} from 'lucide-react';

interface SidebarProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab: externalActiveTab, setActiveTab }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [internalActiveTab, setInternalActiveTab] = useState('dashboard');
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  
  // Garantir que a renderização ocorra apenas no cliente para evitar problemas de hidratação
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const navigationItems = useMemo(() => [
    { id: 'dashboard', label: 'Dashboard', icon: Activity, path: '/pages/dashboard' },
    { id: 'pacientes', label: 'Pacientes', icon: Users, path: '/pages/patient' },
    { id: 'medicos', label: 'Médicos', icon: UserCheck, path: '/pages/doctor' },
    { id: 'consultas', label: 'Consultas', icon: Calendar, path: '/pages/consultation' },
    { id: 'prontuarios', label: 'Prontuários', icon: FileText, path: '/pages/medicalRecord' },
    { id: 'receitas', label: 'Receitas', icon: Receipt, path: '/pages/prescription' }
  ], []);
  
  // Use effect para sincronizar o activeTab com o pathname atual - só detecta mudança de rota
  useEffect(() => {
    // Mapear o pathname para o id do item correspondente
    const currentPath = pathname || '';
    const matchingItem = navigationItems.find(item => item.path === currentPath);
    
    if (matchingItem) {
      if (setActiveTab) {
        setActiveTab(matchingItem.id);
      } else {
        setInternalActiveTab(matchingItem.id);
      }
    }
  }, [pathname, setActiveTab, navigationItems]);
  
  // Usar o activeTab externo se fornecido, caso contrário usar o interno
  const activeTab = externalActiveTab !== undefined ? externalActiveTab : internalActiveTab;
  
  const handleNavigation = (path: string, tabId: string, e: React.MouseEvent) => {
    e.preventDefault();
    
    // Atualizar estado
    if (setActiveTab) {
      setActiveTab(tabId);
    } else {
      setInternalActiveTab(tabId);
    }
    
    // Usa o router.push para navegação do lado do cliente
    router.push(path, { scroll: false });
  };

  // Não renderiza nada durante o SSR para evitar bugs de hidratação
  if (!mounted) return null;

  return (
    <aside className="fixed left-0 top-0 w-64 h-screen bg-white dark:bg-slate-900 dark:border-slate-800 shadow-lg border-r border-gray-200 z-50 overflow-hidden">
      {/* Logo e identidade visual - SEM animação de montagem */}
      <div className="h-[72px] p-6 flex items-center justify-center border-b border-gray-200 dark:border-slate-800">
        <div className="flex items-center space-x-3">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
            className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 dark:from-blue-600 dark:to-emerald-600 rounded-lg flex items-center justify-center shadow-md"
          >
            <Stethoscope className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h1 className="font-bold text-lg text-slate-800 dark:text-white">Vida Plena</h1>
            <motion.div
              animate={{ width: ["0%", "100%", "40%"] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", repeatDelay: 5 }}
              className="h-0.5 bg-gradient-to-r from-blue-400 to-emerald-400 rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Área de navegação - SEM animação de montagem nos itens */}
      <div className="h-[calc(100vh-72px)] overflow-y-auto px-4 py-4">
        <nav className="space-y-1.5">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            // Verifica se está ativo com base no pathname ou no activeTab
            const isActive = pathname === item.path || item.id === activeTab;
            
            return (
              <div key={item.id} className="relative">
                <a
                  href={item.path} 
                  onClick={(e) => handleNavigation(item.path, item.id, e)}
                  className="block outline-none focus:outline-none"
                >
                  <motion.div
                    whileHover={{ 
                      x: 6, 
                      backgroundColor: theme === 'dark' 
                        ? 'rgba(59, 130, 246, 0.12)' 
                        : 'rgba(243, 244, 246, 1)'
                    }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 400,
                      damping: 17,
                      mass: 0.8
                    }}
                    className={`relative flex items-center overflow-hidden space-x-3 px-4 py-3 rounded-lg cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white shadow-md'
                        : 'text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-300'
                    }`}
                  >
                    {/* Ícone */}
                    <div className="flex items-center justify-center relative z-10">
                      <Icon className="w-5 h-5" />
                    </div>
                    
                    {/* Texto */}
                    <span className="font-medium relative z-10">{item.label}</span>
                    
                    {/* Indicador ativo melhorado */}
                    {isActive && (
                      <>
                        {/* Linha vertical esquerda */}
                        <motion.div
                          layoutId="activeTabIndicator"
                          className="absolute left-0 top-1/2 bottom-0 w-1 h-12 -translate-y-1/2 bg-white/70 dark:bg-blue-400 rounded-full"
                          style={{ pointerEvents: 'none' }}
                          transition={{ type: "spring", stiffness: 300, damping: 26 }}
                        />
                        
                        {/* Brilho sutil */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent dark:from-blue-400/5 dark:to-transparent rounded-lg" 
                             style={{ pointerEvents: 'none' }} />
                      </>
                    )}
                  </motion.div>
                </a>
              </div>
            );
          })}
        </nav>

        {/* Elemento decorativo na parte inferior - Design melhorado */}
        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-white/90 dark:from-slate-900/90 to-transparent pointer-events-none flex items-center justify-center">
          <motion.div
            animate={{ 
              y: [10, -10, 10],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{ 
              duration: 5, 
              repeat: Infinity,
              repeatType: "reverse" 
            }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 w-20 h-1 rounded-full bg-gradient-to-r from-blue-400/40 to-emerald-400/40 blur-sm"
          />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;