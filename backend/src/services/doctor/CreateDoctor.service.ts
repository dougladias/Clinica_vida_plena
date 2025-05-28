import prismaClient from "../../prisma";


// É responsável por criar um novo médico
interface DoctorRequest {
  name: string;
  crm: string;
  specialty: string;
  phone: string;
  email: string;
}


// Serviço para criar um novo médico
class CreateDoctorService {
  async execute({ name, crm, specialty, phone, email }: DoctorRequest) {
    // Validações básicas
    if (!name) {
      throw new Error("Nome é obrigatório");
    }
    
    // Verifica se o CRM é válido (exemplo: deve conter apenas números)
    if (!crm) {
      throw new Error("CRM é obrigatório");
    }

    // Verifica se a especialidade é válida
    if (!specialty) {
      throw new Error("Especialidade é obrigatória");
    }

    // Verifica se o telefone é válido
    if (!phone) {
      throw new Error("Telefone é obrigatório");
    }

    // Verifica se o email é válido
    if (!email) {
      throw new Error("Email é obrigatório");
    }

    // Verificar se já existe um médico com esse CRM
    const doctorAlreadyExists = await prismaClient.doctor.findFirst({
      where: {
        crm: crm
      }
    });

    // Se já existe, lança um erro
    if (doctorAlreadyExists) {
      throw new Error("Já existe um médico cadastrado com este CRM");
    }

    // Criar o médico no banco de dados
    const doctor = await prismaClient.doctor.create({
      data: {
        name,
        crm,
        specialty,
        phone,
        email
      }
    });

    // Retorna o objeto do médico criado
    return doctor;
  }
}

export { CreateDoctorService };