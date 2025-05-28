import prismaClient from "../../prisma";

interface UpdatePatientRequest {
    id: string;
    name?: string;
    cpf?: string;
    date_birth?: Date;
    address?: string;
    phone?: string;
}

class UpdatePatientService {
    async execute({ id, name, cpf, date_birth, address, phone }: UpdatePatientRequest) {
        // Verificar se o ID foi fornecido
        if (!id) {
            throw new Error("ID do paciente é obrigatório");
        }

        // Verificar se o paciente existe
        const patientExists = await prismaClient.patient.findUnique({
            where: { id }
        });

        if (!patientExists) {
            throw new Error("Paciente não encontrado");
        }

        // Se o CPF foi fornecido e é diferente do atual, verifica se já está em uso
        if (cpf && cpf !== patientExists.cpf) {
            const cpfInUse = await prismaClient.patient.findFirst({
                where: {
                    cpf,
                    id: {
                        not: id
                    }
                }
            });

            if (cpfInUse) {
                throw new Error("Este CPF já está cadastrado para outro paciente");
            }
        }

        // Prepara os dados para atualização
        const updateData: any = {
            updated_at: new Date()
        };

        // Adiciona os campos apenas se foram fornecidos
        if (name) updateData.name = name;
        if (cpf) updateData.cpf = cpf;
        if (date_birth) updateData.date_birth = date_birth;
        if (address) updateData.address = address;
        if (phone) updateData.phone = phone;

        // Atualiza o paciente no banco de dados
        const updatedPatient = await prismaClient.patient.update({
            where: { id },
            data: updateData
        });

        return updatedPatient;
    }
}

export { UpdatePatientService };