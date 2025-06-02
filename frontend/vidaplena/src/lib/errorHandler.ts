interface ApiError {
  response?: {
    data?: {
      error?: string;
      message?: string;
    };
    status?: number;
  };
  message?: string;
}

// Função para lidar com erros da API de forma genérica
export function handleApiError(err: unknown): string {
  console.error('API Error:', err);
  
  // Verifica se o erro é uma instância de Error
  if (err instanceof Error) {
    const apiError = err as ApiError;
    
    // Se for erro da API com resposta estruturada
    if (apiError.response?.data?.error) {
      return apiError.response.data.error;
    }
    
    // Se for erro da API com message
    if (apiError.response?.data?.message) {
      return apiError.response.data.message;
    }
    
    // Se for erro de rede ou timeout
    if (apiError.message?.includes('Network Error')) {
      return 'Erro de conexão com o servidor';
    }
    
    // Se for erro de timeout
    if (apiError.message?.includes('timeout')) {
      return 'Tempo limite de conexão excedido';
    }
    
    // Erro genérico com mensagem
    return apiError.message || 'Erro desconhecido';
  }
  
  return 'Erro interno do servidor';
}