'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Shield, User, Heart } from 'lucide-react';
import { handleLogin } from '@/server/auth/useAuth';
import FormField from './FormField';

// Componente de formulário de login com animações e layout suave
const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Variantes de animação para os componentes
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.7,
        staggerChildren: 0.15
      }
    }
  };

  // Variantes de animação para os itens dentro do container
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  // Função para lidar com a submissão do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);
      formData.append('rememberMe', String(rememberMe)); // FormData expects string or Blob values

      // Se handleLogin for uma Server Action
      const result = await handleLogin(formData);
      
      if (result?.error) {
        setError(result.error);
      }      

      // Se o login for bem-sucedido, redireciona para o dashboard
       if (result?.success) {
         window.location.href = "/pages/dashboard";
       }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === 'string') {
        setError(err);
      } else {
        setError("Erro ao fazer login. Tente novamente.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Renderiza o formulário de login com animações e efeitos visuais
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-md flex flex-col items-center justify-center"
    >
      {/* Login Form */}
      <motion.div
        variants={itemVariants}
        className="w-full bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-7 border border-slate-100"
      >
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
            className="w-14 h-14 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3"
          >
            <User className="w-7 h-7 text-white" />
          </motion.div>

          <h2 className="text-xl font-bold text-slate-800 mb-1">
            Bem-vindo de volta!
          </h2>
          <p className="text-slate-600 text-sm">
            Faça login para acessar sua clínica
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-slate-800">
          {/* Email Field */}
          <FormField
            label="Email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Seu email"              
            icon={<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />}
            required
            variants={itemVariants}
          />

          {/* Password Field */}
          <motion.div
            variants={itemVariants}
            className="space-y-1.5"
          >
            <label className="text-sm font-medium text-slate-700">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha"
                className="w-full pl-10 pr-10 py-2.5 bg-white/50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all text-slate-800"
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
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </motion.button>
            </div>
          </motion.div>

          {/* subscribe */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-between"
          >
            <label className="flex items-center space-x-1.5 cursor-pointer">
              <motion.input
                whileTap={{ scale: 0.9 }}
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-3.5 h-3.5 text-blue-500 border-slate-300 rounded focus:ring-blue-500"
              />
              <span className="text-xs text-slate-600">Lembrar de mim</span>
            </label>

            <motion.a
              whileHover={{ scale: 1.03 }}
              href="/auth/register"  
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              Registre-se?
            </motion.a>
          </motion.div>

          {/* Mensagem de Erro */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Login Button */}
          <motion.div variants={itemVariants}>
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg text-white font-medium flex items-center justify-center transition-all ${
                isSubmitting ? 'opacity-70' : ''
              }`}
            >
              {isSubmitting ? (
                <>
                  <span className="mr-2">Entrando...</span>
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </>
              ) : (
                <>
                  <span>Entrar</span>
                  <ArrowRight className="ml-2 w-4 h-4" />
                </>
              )}
            </motion.button>
          </motion.div>
        </form>

        {/* Footer */}
        <motion.div
          variants={itemVariants}
          className="mt-6 text-center text-xs text-slate-500"
        >
          <div className="flex items-center justify-center space-x-1 mb-1.5">
            <Shield className="w-3 h-3 text-emerald-500" />
            <span>Seus dados estão seguros conosco</span>
          </div>
          <div className="flex items-center justify-center space-x-1">
            <Heart className="w-2.5 h-2.5 text-pink-500" />
            <p>
              © 2025 Clínica Vida Plena
            </p>
            <Heart className="w-2.5 h-2.5 text-pink-500" />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default LoginForm;