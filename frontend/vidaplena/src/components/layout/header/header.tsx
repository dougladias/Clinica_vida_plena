'use client'

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  Stethoscope,
  LogOut,
  User
} from 'lucide-react';
import { logoutClient } from '@/lib/cookieClient';

interface HeaderProps {
  searchTerm?: string;
  setSearchTerm?: (term: string) => void;
}

const Header: React.FC<HeaderProps> = ({   
}) => {
  // Estado interno para quando as props não são fornecidas  
  const [showUserMenu, setShowUserMenu] = useState(false);
    
  const handleLogout = () => {
    // Usa a função de logout que limpa cookie e redireciona
    logoutClient();
    setShowUserMenu(false);
  };

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white shadow-sm border-b border-slate-200 z-50 fixed top-0 left-0 right-0"
    >
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl"
          >
            <Stethoscope className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Vida Plena</h1>
            <p className="text-sm text-slate-500">Sistema de Gestão Médica</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </motion.button>
          
          {/* Menu do usuário */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 text-slate-600 hover:text-slate-800 transition-colors"
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
                className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg py-2"
              >
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-sm font-medium text-slate-800">Usuário</p>
                  <p className="text-xs text-slate-500">admin@vidaplena.com</p>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
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
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </motion.header>
  );
};

export default Header;