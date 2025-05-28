import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";



// Define a interface Payload para tipar o conteúdo do token JWT
interface Payload {
    sub: string;
}

// Middleware para verificar se o usuário está autenticado
export function isAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  // Verifica se o token JWT está presente no cabeçalho Authorization
  const authToken = request.headers.authorization;

  // Se o token não estiver presente, retorna um erro 401 (não autorizado)
  if (!authToken) {
    return response.status(401).json({ error: "Token não fornecido" });
  }

  // Extrai o token do cabeçalho Authorization
  const [, token] = authToken.split(" ");
  try{
    //validar o Token
    const { sub } = verify(
        token, 
        process.env.JWT_SECRET as string
    ) as Payload;  

    // Recuperar o id do token e colocar dentro da request
    request.user_id = sub;
    
    // Se o token for válido, chama a próxima função middleware
    return next();

    // Recuperar o id do token e colocar dentro da request
  }catch (err) {
    return response.status(401).json({ error: "Token inválido" });
  }  
  
}