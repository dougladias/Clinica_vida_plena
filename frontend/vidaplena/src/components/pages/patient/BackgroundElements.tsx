import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface BackgroundElementsProps {
  isLoading?: boolean;
}

export function BackgroundElements({ isLoading = false }: BackgroundElementsProps) {
  const [backgroundElements, setBackgroundElements] = useState<Array<{left: string, top: string, size: number}>>([]);

  useEffect(() => {
    const elements = Array.from({ length: 8 }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 100 + 50
    }));
    setBackgroundElements(elements);
  }, []);

  // Animation variants
  const floatingVariants = {
    animate: {
      y: [0, -10, 0],
      opacity: [0.2, 0.5, 0.2],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      {isLoading ? (
        // Elementos de fundo para carregamento
        Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0.2 }}
            animate={{ 
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5
            }}
            className="absolute rounded-full bg-gradient-to-r from-slate-200/40 to-slate-300/40 blur-2xl"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 100 + 100}px`,
              height: `${Math.random() * 100 + 100}px`,
              transform: 'translate(-50%, -50%)'
            }}
          />
        ))
      ) : (
        // Elementos de fundo para página normal
        backgroundElements.map((el, i) => (
          <motion.div
            key={i}
            variants={floatingVariants}
            animate="animate"
            className="absolute rounded-full bg-gradient-to-r from-emerald-900/20 to-blue-900/20 dark:from-emerald-500/10 dark:to-blue-500/10 blur-2xl"
            style={{
              left: el.left,
              top: el.top,
              width: `${el.size}px`,
              height: `${el.size}px`,
              animationDelay: `${i * 0.5}s`
            }}
          />
        ))
      )}
    </div>
  );
}