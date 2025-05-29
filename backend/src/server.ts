import Express, { Request, Response, NextFunction } from "express";
import "express-async-errors";
import cors from "cors";
import { router } from "./routes/routes";

// Importando o Express e o roteador
const app = Express();

// CORS 
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// JSON 
app.use(Express.json());

// Rotas 
app.use(router);

// Middleware para tratamento de erros
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof Error) {
        // Se o erro for uma instância de Error, retornamos a mensagem de erro
        return res.status(400).json({
            error: err.message
        })
    }

    // Se o erro não for uma instância de Error, retornamos um erro genérico
    return res.status(500).json({
        status: "error",
        message: "Internal Server Error."
    })
})

// Rota do Servidor
app.listen(4000, () => {
    console.log("🚀 Servidor Rodando na porta 4000");
});