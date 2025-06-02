'use client';

import React, { ChangeEvent, ReactNode } from 'react';
import { motion, Variants } from 'framer-motion';

// Define as propriedades para o componente FormField
interface FormFieldProps {
  label: string;
  type: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  icon: ReactNode;
  required?: boolean;
  variants?: Variants;
}

// Componente para renderizar um campo de formulário com animação
const FormField: React.FC<FormFieldProps> = ({
  label,
  type,
  name,
  value,
  onChange,
  placeholder,
  icon,
  required = false,
  variants
}) => {

  // Renderiza o campo de formulário com animação
  return (
    <motion.div
      variants={variants}
      className="space-y-2"
    >
      <label className="text-sm font-medium text-slate-700">
        {label}
      </label>
      <div className="relative">
        {icon}
        <motion.input
          whileFocus={{ scale: 1.02 }}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full pl-12 py-3 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-800"
          required={required}
        />
      </div>
    </motion.div>
  );
};

export default FormField;