'use client'

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { 
  Activity, 
  Users, 
  UserCheck, 
  Calendar, 
  FileText, 
  Receipt,
  Stethoscope
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
  
  // Use effect para sincronizar o activeTab com o pathname atual
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
    // É muito importante prevenir o comportamento padrão
    e.preventDefault();
    
    // Atualizar estado
    if (setActiveTab) {
      setActiveTab(tabId);
    } else {
      setInternalActiveTab(tabId);
    }
    
    // Usa o router.push para navegação do lado do cliente (Client-Side Navigation)
    router.push(path, { scroll: false });
  };

  // Variantes de animação para a sidebar
  const sidebarVariants = {
    hidden: { x: -300, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { 
        duration: 0.5, 
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.05
      }
    }
  };

  // Variantes para os itens do menu
  const menuItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  // Não renderiza nada durante o SSR para evitar bugs de hidratação
  if (!mounted) return null;

  return (
    <motion.aside
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
      className="fixed left-0 top-0 w-64 h-screen bg-white dark:bg-slate-900 dark:border-slate-800 shadow-lg border-r border-gray-200 z-50 overflow-hidden"
    >
      {/* Logo e identidade visual */}
      <div className="h-[72px] p-6 flex items-center justify-center border-b border-gray-200 dark:border-slate-800">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.3 }}
          className="flex items-center space-x-3"
        >
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
        </motion.div>
      </div>

      {/* Área de navegação com scroll */}
      <div className="h-[calc(100vh-72px)] overflow-y-auto px-4 py-4">
        <nav className="space-y-1">
          <AnimatePresence>
            {navigationItems.map((item, index) => {
              const Icon = item.icon;
              // Verifica se está ativo com base no pathname ou no activeTab
              const isActive = pathname === item.path || item.id === activeTab;
              
              return (
                <motion.div
                  key={item.id}
                  variants={menuItemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.05 }}
                  className="relative"
                >
                  <a
                    href={item.path} 
                    onClick={(e) => handleNavigation(item.path, item.id, e)}
                    className="block"
                  >
                    <motion.div
                      whileHover={{ 
                        x: 4,
                        backgroundColor: theme === 'dark' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(243, 244, 246, 1)'
                      }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative flex items-center space-x-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white shadow-md'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        className="flex items-center justify-center"
                      >
                        <Icon className="w-5 h-5" />
                      </motion.div>
                      
                      <span className="font-medium">{item.label}</span>
                      
                      {isActive && (
                        <motion.div
                          layoutId="activeTabIndicator"
                          className="absolute left-0 top-0 bottom-0 w-1 bg-white dark:bg-blue-400 rounded-r"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </motion.div>
                  </a>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </nav>

        {/* Elemento decorativo na parte inferior */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-blue-50/50 dark:from-slate-800/50 to-transparent pointer-events-none"
        >
          <motion.div
            animate={{ 
              y: [10, -10, 10],
              opacity: [0.3, 0.7, 0.3]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity,
              repeatType: "reverse" 
            }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 w-16 h-1 rounded-full bg-gradient-to-r from-blue-400 to-emerald-400 opacity-30"
          />
        </motion.div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;