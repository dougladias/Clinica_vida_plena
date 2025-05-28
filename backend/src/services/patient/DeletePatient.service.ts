import prismaClient from "../../prisma";

// interface responsável por deletar um paciente
interface DeletePatientRequest {
    id: string;
}

// Serviço responsável por deletar um paciente
class DeletePatientService {
    async execute({ id }: DeletePatientRequest) {
        // Validação básica
        if (!id) {
            throw new Error("ID do paciente é obrigatório");
        }

        // Verificar se o paciente existe
        const patientExists = await prismaClient.patient.findUnique({
            where: { id }
        });

        // Se o paciente não existir, lança um erro
        if (!patientExists) {
            throw new Error("Paciente não encontrado");
        }

        try {
            // Deletar o paciente do banco de dados
            const deletedPatient = await prismaClient.patient.delete({
                where: { id },
                // Selecionar os campos para retornar na resposta
                select: {
                    id: true,
                    name: true,
                    cpf: true,
                    date_birth: true,
                    address: true,
                    phone: true
                }
            });

            // Retorna uma mensagem de sucesso e os dados do paciente excluído
            return { 
                message: "Paciente excluído com sucesso", 
                patient: deletedPatient 
            };
        } catch (error: any) {
            // Verifica se o erro é relacionado a restrições de chave estrangeira
            if (error.code === 'P2003') {
                throw new Error("Não é possível excluir este paciente pois ele possui consultas relacionadas");
            }
            
            // Lança o erro original se não for relacionado a restrições
            throw error;
        }
    }
}

export { DeletePatientService };