import  prismaClient  from "../../prisma";
import { hash } from "bcryptjs";

// Este arquivo faz parte do serviço backend para gerenciamento de usuários.
interface UserRequest {
    name: string;
    email: string;
    password: string;
    role: string;
}

// Importando a interface UserRequest para definir o tipo de dados esperados
class CreateUserService {
    async execute({name, email, password, role}: UserRequest){

        // Verifica se ele enviou um email
        if(!email){
            throw new Error("Email incorrect");
        }

        // Verificar se esse email já está cadastrado        
        const userAlreadyExists = await prismaClient.user.findFirst({
            where: {
                email: email
            }
        })

        // Se o email já existe, lança um erro
        if(userAlreadyExists){
            throw new Error("User already exists");
        }

        // Criptografa a senha antes de salvar no banco de dados
        const passwordHash = await hash(password, 8);
        

        // Cria o usuário no banco de dados
        const user = await prismaClient.user.create({
            data: {
                name: name,
                email: email,
                password: passwordHash,
                role: role,
            },
            // Seleciona os campos que queremos retornar
            // Isso é útil para não retornar o campo de senha por segurança
            select: {
                id: true,
                name: true,
                email: true, 
                role: true,               
            }
        })

        return user;
    }
        
}


export { CreateUserService };