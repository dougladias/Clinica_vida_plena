'use client'

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Activity, 
  Users, 
  UserCheck, 
  Calendar, 
  FileText, 
  Receipt,
  Menu,
  X
} from 'lucide-react';

interface SidebarProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab: externalActiveTab, setActiveTab }) => {
  const pathname = usePathname();
  const [internalActiveTab, setInternalActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Determinar qual aba está ativa, priorizando a prop externa se disponível
  const activeTab = externalActiveTab !== undefined ? externalActiveTab : internalActiveTab;
  
  // Manipulador de mudança de aba
  const handleTabChange = (tabId: string) => {
    if (setActiveTab) {
      setActiveTab(tabId);
    } else {
      setInternalActiveTab(tabId);
    }
    
    // Fechar menu mobile ao selecionar um item
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity, path: '/pages/dashboard' },
    { id: 'pacientes', label: 'Pacientes', icon: Users, path: '/pages/patient' },
    { id: 'medicos', label: 'Médicos', icon: UserCheck, path: '/pages/doctor' },
    { id: 'consultas', label: 'Consultas', icon: Calendar, path: '/pages/consultation' },
    { id: 'prontuarios', label: 'Prontuários', icon: FileText, path: '/pages/prescription' },
    { id: 'receitas', label: 'Receitas', icon: Receipt, path: '/pages/medication' }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Botão do menu mobile */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={toggleMobileMenu}
          className="p-2 bg-white rounded-lg shadow-md"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar para desktop - posição fixa */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:block fixed left-0 top-0 w-64 bg-white shadow-lg border-r border-slate-200 h-full z-40"
      >
        <div className="pt-20"> {/* Espaçamento para o header */}
          <nav className="p-4 space-y-2">
            {navigationItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = pathname === item.path || activeTab === item.id;
              
              return (
                <Link href={item.path} key={item.id}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 4 }}
                    onClick={() => handleTabChange(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </nav>
        </div>
      </motion.aside>

      {/* Sidebar para mobile */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleMobileMenu}
        >
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.3 }}
            className="w-64 bg-white shadow-lg min-h-screen overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="p-4 space-y-2 mt-12">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path || activeTab === item.id;
                
                return (
                  <Link href={item.path} key={item.id}>
                    <motion.div
                      whileHover={{ x: 4 }}
                      onClick={() => handleTabChange(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </motion.div>
                  </Link>
                );
              })}
            </nav>
          </motion.aside>
        </motion.div>
      )}
    </>
  );
};

export default Sidebar;