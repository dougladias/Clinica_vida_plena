"use client"

import { createContext, useContext, useEffect, useState } from "react"


// Define os tipos de tema disponíveis
type Theme = "light" | "dark"
//  Define as propriedades do provedor de tema
type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}
// Define o tipo do estado do provedor de tema
type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}
// Define o estado inicial do contexto do tema
const initialState: ThemeProviderState = {
  theme: "light",
  setTheme: () => null,
  toggleTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)
// Verifica se o contexto foi criado corretamente
export function ThemeProvider({
  children,
  defaultTheme = "light",
  storageKey = "vidaplena-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  // Verifica se o localStorage está disponível
  useEffect(() => {
    const savedTheme = localStorage.getItem(storageKey) as Theme | null
    
    if (savedTheme) {
      setTheme(savedTheme)
    } else {
      // Verificar preferência do sistema
      if (typeof window !== "undefined" && window.matchMedia) {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
        setTheme(prefersDark ? "dark" : "light")
      }
    }
  }, [storageKey])

  useEffect(() => {
    const root = window.document.documentElement
    
    // Remover classe anterior
    root.classList.remove("light", "dark")
    
    // Adicionar nova classe
    root.classList.add(theme)
    
    // Salvar no localStorage
    localStorage.setItem(storageKey, theme)
  }, [theme, storageKey])

  // Função para alternar entre temas
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  // Função para definir tema diretamente
  const value = {
    theme,
    setTheme,
    toggleTheme
  }

  // Fornecer o contexto
  return (
    <ThemeProviderContext.Provider value={value} {...props}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

// Hook para acessar o contexto do tema
export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  // Verifica se o contexto foi fornecido
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}