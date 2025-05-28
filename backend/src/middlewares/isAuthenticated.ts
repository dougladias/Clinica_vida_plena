import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

interface Payload {
    sub: string;
}

export function isAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authToken = request.headers.authorization;

  if (!authToken) {
    return response.status(401).json({ error: "Token não fornecido" });
  }

  const [, token] = authToken.split(" ");
  try{
    //validar o Token
    const { sub } = verify(
        token, 
        process.env.JWT_SECRET as string
    ) as Payload;  

    // Recuperar o id do token e colocar dentro da request
    request.user_id = sub;

    return next();

    // Recuperar o id do token e colocar dentro da request
  }catch (err) {
    return response.status(401).json({ error: "Token inválido" });
  }  
  
}