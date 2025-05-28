import prismaClient from "../../prisma";

interface DeleteUserRequest {
    id: string;
}

class DeleteUserService {
    async execute({ id }: DeleteUserRequest) {
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

        // Deleta o usuário do banco de dados
        const deletedUser = await prismaClient.user.delete({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true
            }
        });

        // Retorna uma mensagem de sucesso e os dados do usuário deletado
        return { message: "Usuário excluído com sucesso", user: deletedUser };
    }
}

export { DeleteUserService };