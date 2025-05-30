import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorBannerProps {
  error: string | null;
  refreshing: boolean;
  onRefresh: () => Promise<void>;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({ 
  error, 
  refreshing, 
  onRefresh 
}) => {
  if (!error) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800 rounded-lg p-4 flex items-center space-x-3"
    >
      <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400" />
      <div className="flex-1">
        <p className="text-red-800 dark:text-red-300 font-medium">Erro ao carregar dados</p>
        <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
      </div>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onRefresh}
        className="text-red-600 dark:text-red-400"
      >
        <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
        Tentar novamente
      </Button>
    </motion.div>
  );
};