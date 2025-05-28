import prismaClient from "../../prisma";
import { hash } from "bcryptjs";

// interface para os dados de atualização do usuário
interface UpdateUserRequest {
    id: string;
    name?: string;
    email?: string;
    password?: string;
    role?: string;
}

// Serviço responsável por atualizar os dados de um usuário
class UpdateUserService {
    async execute({ id, name, email, password, role }: UpdateUserRequest) {
        // Verifica se o id foi fornecido
        if (!id) {
            throw new Error("ID é obrigatório");
        }

        // Verifica se o usuário existe
        const userExists = await prismaClient.user.findUnique({
            where: { id }
        });

        // Se o usuário não existir, lança um erro
        if (!userExists) {
            throw new Error("Usuário não encontrado");
        }

        // Se o email foi fornecido, verifica se já está em uso por outro usuário
        if (email && email !== userExists.email) {
            const emailInUse = await prismaClient.user.findFirst({
                where: {
                    email,
                    id: {
                        not: id
                    }
                }
            });

            // Se o email já estiver em uso por outro usuário, lança um erro
            if (emailInUse) {
                throw new Error("Este email já está em uso");
            }
        }

        // Prepara os dados para atualização
        const updateData: any = {
            updated_at: new Date()
        };

        // Adiciona os campos ao objeto de atualização apenas se foram fornecidos
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (role) updateData.role = role;

        // Se uma nova senha foi fornecida, criptografa antes de salvar
        if (password) {
            updateData.password = await hash(password, 8);
        }

        // Atualiza o usuário no banco de dados
        const updatedUser = await prismaClient.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                updated_at: true
            }           
        });

        // Retorna os dados do usuário atualizado
        return updatedUser;
    }
}

export { UpdateUserService };