'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Shield, User, Stethoscope } from 'lucide-react';
import { handleLogin } from '@/components/login/serverAction/serverAction';
import FormField from './FormField/FormField';

// Componente de formulário de login com animações e partículas médicas
const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Variantes de animação para os componentes
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  // Variantes de animação para os itens dentro do container
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  // Renderiza o formulário de login com animações e efeitos visuais
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full lg:w-1/2 flex items-center justify-center p-8"
    >
      <div className="w-full max-w-md">
        {/* Header Mobile */}
        <motion.div
          variants={itemVariants}
          className="lg:hidden text-center mb-8"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center"
            >
              <Stethoscope className="w-6 h-6 text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold text-slate-800">Vida Plena</h1>
          </div>
        </motion.div>

        {/* Login Form */}
        <motion.div
          variants={itemVariants}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4"
            >
              <User className="w-8 h-8 text-white" />
            </motion.div>

            <h2 className="text-3xl font-bold text-slate-800 mb-2">
              Bem-vindo de volta!
            </h2>
            <p className="text-slate-600">
              Faça login para acessar sua clínica
            </p>
          </div>

          <form action={handleLogin} className="space-y-6 text-slate-800">
            {/* Email Field */}
            <FormField
              label="Email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=""              
              icon={<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />}
              required
              variants={itemVariants}
            />

            {/* Password Field */}
            <motion.div
              variants={itemVariants}
              className="space-y-2"
            >
              <label className="text-sm font-medium text-slate-700">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder=""
                  className="w-full pl-12 pr-12 py-3 bg-white/50 border border-slate-200  rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-800"
                  required
                  name="password"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </motion.button>
              </div>
            </motion.div>

            {/* Remember Me & Forgot Password */}
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-between"
            >
              <label className="flex items-center space-x-2 cursor-pointer">
                <motion.input
                  whileTap={{ scale: 0.9 }}
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-blue-500 border-slate-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-slate-600">Lembrar de mim</span>
              </label>

              <motion.a
                whileHover={{ scale: 1.05 }}
                href="#"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Esqueceu a senha?
              </motion.a>
            </motion.div>

            {/* Login Button */}
            <motion.div variants={itemVariants}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-emerald-500 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center space-x-2"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                      <span>Entrando...</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center space-x-2"
                    >
                      <span>Entrar no Sistema</span>
                      <ArrowRight className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          </form>

          {/* Footer */}
          <motion.div
            variants={itemVariants}
            className="mt-8 text-center text-sm text-slate-500"
          >
            <div className="flex items-center justify-center space-x-1 mb-2">
              <Shield className="w-4 h-4" />
              <span>Seus dados estão seguros conosco</span>
            </div>
            <p>
              © 2025 Clínica Vida Plena. Todos os direitos reservados.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LoginForm;