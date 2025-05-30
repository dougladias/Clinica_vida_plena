"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "./theme-provider"
import { Button } from "@/components/ui/button" 
import { motion } from "framer-motion"


export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  // Função para alternar o tema
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full w-8 h-8"
    >
      {theme === "light" ? (
        <motion.div
          initial={{ scale: 0.5, opacity: 0, rotate: -180 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Moon className="h-4 w-4 text-slate-600" />
          <span className="sr-only">Modo escuro</span>
        </motion.div>
      ) : (
        <motion.div
          initial={{ scale: 0.5, opacity: 0, rotate: 180 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Sun className="h-4 w-4 text-yellow-400" />
          <span className="sr-only">Modo claro</span>
        </motion.div>
      )}
    </Button>
  )
}