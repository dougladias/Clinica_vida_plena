import Express, { Request, Response, NextFunction } from "express";
import "express-async-errors";
import cors from "cors";
import { router } from "./routes/routes";

// Importando o Express e o roteador
const app = Express();

// Configurando o Express para usar JSON
app.use(Express.json());

// Configurando o roteador
app.use(router);

// Configurando o CORS para permitir requisições de qualquer origem
app.use(cors());

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
        staus: "error",
        message: "Internal Server Error."
    })
})

// Rota do Servidor
app.listen(4000, () => {
    console.log("Servidor Rodando na porta 4000");
});

