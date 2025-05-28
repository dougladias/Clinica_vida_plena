import prismaClient from "../../prisma";

interface DoctorRequest {
  name: string;
  crm: string;
  specialty: string;
  phone: string;
  email: string;
}

class CreateDoctorService {
  async execute({ name, crm, specialty, phone, email }: DoctorRequest) {
    // Validações básicas
    if (!name) {
      throw new Error("Nome é obrigatório");
    }
    
    if (!crm) {
      throw new Error("CRM é obrigatório");
    }

    if (!specialty) {
      throw new Error("Especialidade é obrigatória");
    }

    if (!phone) {
      throw new Error("Telefone é obrigatório");
    }

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

    return doctor;
  }
}

export { CreateDoctorService };