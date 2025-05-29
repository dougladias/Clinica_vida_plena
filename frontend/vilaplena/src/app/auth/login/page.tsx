'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Stethoscope,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  Heart,
  Activity,
  Users,
  CheckCircle,
  User,  
  Sparkles
} from 'lucide-react';

const Login: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [particlePositions, setParticlePositions] = useState<Array<{left: string, x: number}>>([]);
  const [isMounted, setIsMounted] = useState(false);

  // Gerar posições aleatórias apenas no lado do cliente
  useEffect(() => {
    const positions = [...Array(6)].map(() => ({
      left: `${Math.random() * 100}%`,
      x: Math.random() * 100 - 50
    }));
    
    setParticlePositions(positions);
    setIsMounted(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Aqui você pode implementar a chamada real de API para login
      // const response = await fetch('/api/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password })
      // });
      
      // Simulação para demonstração
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsLoading(false);
      setLoginSuccess(true);
      
      // Redirecionar após mostrar a tela de sucesso
      setTimeout(() => {
        router.push('/pages/dashboard'); // Substitua pelo seu caminho real
      }, 2000);
    } catch (error) {
      setIsLoading(false);
      // Tratar erro de login se necessário
      console.error('Erro no login:', error);
    }
  };

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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  if (loginSuccess) {
    return (
      <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-emerald-500 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-12 h-12 text-white" />
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-bold text-white mb-4"
          >
            Login Realizado com Sucesso!
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-white/80 mb-8"
          >
            Redirecionando para o sistema...
          </motion.p>
          
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full mx-auto"
          />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 overflow-hidden">
      {/* Background Elements Animados */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Círculos flutuantes */}
        <motion.div
          variants={floatingVariants}
          animate="animate"
          className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl"
        />
        <motion.div
          variants={floatingVariants}
          animate="animate"
          style={{ animationDelay: '2s' }}
          className="absolute top-40 right-32 w-48 h-48 bg-gradient-to-r from-emerald-400/20 to-blue-400/20 rounded-full blur-xl"
        />
        <motion.div
          variants={floatingVariants}
          animate="animate"
          style={{ animationDelay: '4s' }}
          className="absolute bottom-32 left-32 w-40 h-40 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-xl"
        />
        
        {/* Partículas médicas flutuantes */}
        {isMounted && particlePositions.map((position, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              y: [-100, -800],
              x: position.x
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              delay: i * 1.5,
              ease: "easeOut"
            }}
            className="absolute bottom-0"
            style={{ left: position.left }}
          >
            <Heart className="w-6 h-6 text-emerald-400/40" />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Painel Esquerdo - Informações */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-emerald-600 p-12 flex-col justify-center relative overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }} />
          </div>
          
          <div className="relative z-10">
            {/* Logo e Branding */}
            <motion.div
              variants={itemVariants}
              className="mb-12"
            >
              <div className="flex items-center space-x-4 mb-6">
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center"
                >
                  <Stethoscope className="w-8 h-8 text-white" />
                </motion.div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Vida Plena</h1>
                  <p className="text-white/80">Sistema de Gestão Médica</p>
                </div>
              </div>
              
              <motion.div
                variants={pulseVariants}
                animate="animate"
                className="w-20 h-1 bg-gradient-to-r from-white to-emerald-300 rounded-full"
              />
            </motion.div>

            {/* Título Principal */}
            <motion.div
              variants={itemVariants}
              className="mb-8"
            >
              <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
                Cuide da Saúde
                <br />
                <span className="text-emerald-300">com Excelência</span>
              </h2>
              <p className="text-xl text-white/80 leading-relaxed">
                Gerencie sua clínica de forma moderna, eficiente e segura. 
                Transforme o atendimento aos seus pacientes.
              </p>
            </motion.div>

            {/* Features */}
            <motion.div
              variants={itemVariants}
              className="space-y-4"
            >
              {[
                { icon: Users, text: "Gestão completa de pacientes e médicos" },
                { icon: Activity, text: "Prontuários eletrônicos seguros" },
                { icon: Shield, text: "Dados protegidos e criptografados" }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  whileHover={{ x: 10 }}
                  className="flex items-center space-x-3 text-white/90"
                >
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-4 h-4" />
                  </div>
                  <span>{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Estatísticas */}
            <motion.div
              variants={itemVariants}
              className="mt-12 grid grid-cols-3 gap-6"
            >
              {[
                { number: "500+", label: "Clínicas" },
                { number: "50k+", label: "Pacientes" },
                { number: "99.9%", label: "Uptime" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="text-center"
                >
                  <div className="text-2xl font-bold text-white">{stat.number}</div>
                  <div className="text-white/70 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Painel Direito - Login */}
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

              <form onSubmit={handleLogin} className="space-y-6">
                {/* Email Field */}
                <motion.div
                  variants={itemVariants}
                  className="space-y-2"
                >
                  <label className="text-sm font-medium text-slate-700">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className="w-full pl-12 pr-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </motion.div>

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
                      placeholder="••••••••"
                      className="w-full pl-12 pr-12 py-3 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
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

              {/* Divider */}
              <motion.div
                variants={itemVariants}
                className="my-6 flex items-center"
              >
                <div className="flex-1 border-t border-slate-200"></div>
                <div className="px-4 text-sm text-slate-500">ou</div>
                <div className="flex-1 border-t border-slate-200"></div>
              </motion.div>

              {/* Demo Login */}
              <motion.div
                variants={itemVariants}
                className="text-center"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => {
                    setEmail('admin@clinicavidaplena.com.br');
                    setPassword('123456');
                  }}
                  className="w-full bg-slate-100 text-slate-700 py-3 px-6 rounded-xl font-medium hover:bg-slate-200 transition-colors flex items-center justify-center space-x-2"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Testar com usuário demo</span>
                </motion.button>
              </motion.div>

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
      </div>
    </div>
  );
};

export default Login;