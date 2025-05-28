import prismaClient from "../../prisma";

class DetailUserService {
    async execute(user_id: string) {

        const userId = user_id;
      
        // Verifica se o ID do usuário foi fornecido
        if (!userId) {
            throw new Error("User ID is required");
        }

        // Busca o usuário pelo ID
        const user = await prismaClient.user.findFirst({
            where: {
                id: userId
            }
        });

        // Se o usuário não for encontrado, lança um erro
        if (!user) {
            throw new Error("User not found");
        }

        // Retorna os detalhes do usuário, excluindo a senha
        return {
            id: user.id,
            name: user.name,
            email: user.email,           
        };
    }
}

export { DetailUserService };