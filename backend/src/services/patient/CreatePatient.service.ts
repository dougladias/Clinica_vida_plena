import prismaClient from "../../prisma";


// é interface paciente para definir os parâmetros necessários para criar um paciente
interface PatientRequest {
    name: string;
    cpf: string;
    date_birth: Date;
    address: string;
    phone: string;
}

// criar  serviço para criar um paciente
class CreatePatientService {
    async execute({ name, cpf, date_birth, address, phone }: PatientRequest) {
        // Validações básicas
        if (!name) {
            throw new Error("Nome é obrigatório");
        }
        
        // Verificar se o CPF é válido (exemplo: deve conter apenas números)
        if (!cpf) {
            throw new Error("CPF é obrigatório");
        }

        // Verificar se a data de nascimento é válida
        if (!date_birth) {
            throw new Error("Data de nascimento é obrigatória");
        }

        // Verificar se o endereço é válido
        if (!address) {
            throw new Error("Endereço é obrigatório");
        }

        // Verificar se o telefone é válido
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

        // Retornar o paciente criado
        return patient;
    }
}

export { CreatePatientService };