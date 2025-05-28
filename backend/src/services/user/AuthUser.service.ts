import prismaClient from "../../prisma";
import { compare } from "bcryptjs"
import { sign } from "jsonwebtoken";


// AuthUserService é responsável por autenticar um usuário com email e senha
interface AuthUserRequest {
    email: string;
    password: string;
}

class AuthUserService {
    async execute({ email, password }: AuthUserRequest) {

        // Verifica se o email foi fornecido
        if (!email) {
            throw new Error("Email is required");
        }

        // Verifica se a senha foi fornecida
        if (!password) {
            throw new Error("Password is required");
        }

        // Busca o usuário pelo email
        const user = await prismaClient.user.findUnique({
            where: {
                email: email
            }
        });

        // Se o usuário não for encontrado, lança um erro
        if (!user) {
            throw new Error("User/password Incorrect");
        }

        // Verifica se a senha está correta
        const passwordMatch = await compare(password, user.password);
        
        // Se a senha não corresponder, lança um erro
        if (!passwordMatch) {
            throw new Error("User/password Incorrect");
        }

        // Gerar um Token JWT
        const token = sign(
            {
                name: user.name,
                email: user.email
            },
             process.env.JWT_SECRET as string,
             {
                subject: user.id,
                expiresIn: "1d"
             }
        )

        // Retorna o usuário autenticado, excluindo a senha
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: token
        };
    }
}

export { AuthUserService };