import prismaClient from "../../prisma";

interface PatientRequest {
    name: string;
    cpf: string;
    date_birth: Date;
    address: string;
    phone: string;
}

class CreatePatientService {
    async execute({ name, cpf, date_birth, address, phone }: PatientRequest) {
        // Validações básicas
        if (!name) {
            throw new Error("Nome é obrigatório");
        }
        
        if (!cpf) {
            throw new Error("CPF é obrigatório");
        }

        if (!date_birth) {
            throw new Error("Data de nascimento é obrigatória");
        }

        if (!address) {
            throw new Error("Endereço é obrigatório");
        }

        if (!phone) {
            throw new Error("Telefone é obrigatório");
        }

        // Verificar se já existe um paciente com esse CPF
        const patientAlreadyExists = await prismaClient.patient.findFirst({
            where: {
                cpf: cpf
            }
        });

        // Se já existe, lança um erro
        if (patientAlreadyExists) {
            throw new Error("Já existe um paciente cadastrado com este CPF");
        }

        // Criar o paciente no banco de dados
        const patient = await prismaClient.patient.create({
            data: {
                name,
                cpf,
                date_birth,
                address,
                phone
            }
        });

        return patient;
    }
}

export { CreatePatientService };