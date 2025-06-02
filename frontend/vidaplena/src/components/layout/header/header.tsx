'use client'

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {     
  LogOut,
  User
} from 'lucide-react';
import { logoutClient } from '@/lib/cookieClient';
import { ThemeToggle } from '@/components/theme/theme-toggle';

interface HeaderProps {
  searchTerm?: string;
  setSearchTerm?: (term: string) => void;
}

const Header: React.FC<HeaderProps> = ({   
}) => {
  // Estado interno para quando as props não são fornecidas  
  const [showUserMenu, setShowUserMenu] = useState(false);
    
  const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Previne a propagação do evento para o overlay
    e.stopPropagation();
    
    console.log("Iniciando logout...");
    
    try {
      // Primeiro, feche o menu do usuário para dar feedback visual
      setShowUserMenu(false);
      
      // Use setTimeout para garantir que o estado seja atualizado antes do redirecionamento
      setTimeout(() => {
        console.log("Executando logoutClient...");
        logoutClient();
      }, 100);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      // Em caso de falha, redireciona diretamente
      window.location.href = '/auth/login';
    }
  };

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white dark:bg-slate-900 shadow-sm border-b border-slate-200 dark:border-slate-800 z-40 fixed top-0 w-full"
    >
      {/* Container com largura total, mas conteúdo alinhado à direita da sidebar */}
      <div className="flex items-center justify-between h-[72px] px-6 ml-0 lg:ml-64 transition-all duration-300">
        <div className="flex items-center space-x-4">                    
        </div>        
        <div className="flex items-center space-x-4">
          {/* Botão de alternância de tema */}
          <ThemeToggle />      
          
          {/* Menu do usuário */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 text-slate-600 hover:text-slate-800 dark:text-slate-300 dark:hover:text-slate-100 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            </motion.button>

            {/* Dropdown do usuário */}
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg py-2 z-50" // Aumentado o z-index para 50
              >
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Usuário</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Admin</p>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
                  style={{ zIndex: 50 }} // Garantir que o botão esteja em camada superior
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sair</span>
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Clique fora para fechar o menu */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </motion.header>
  );
};

export default Header;