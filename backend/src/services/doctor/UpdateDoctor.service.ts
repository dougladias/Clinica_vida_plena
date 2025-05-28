import prismaClient from "../../prisma";


// Interface para os dados da consulta
interface UpdateDoctorRequest {
  id: string;
  name?: string;
  crm?: string;
  specialty?: string;
  phone?: string;
  email?: string;
}

// Serviço para atualizar um médico
class UpdateDoctorService {
  async execute({ id, name, crm, specialty, phone, email }: UpdateDoctorRequest) {
    // Verificar se o médico existe
    const doctorExists = await prismaClient.doctor.findUnique({
      where: {
        id: id
      }
    });

    // Se o médico não existir, lançar um erro
    if (!doctorExists) {
      throw new Error("Médico não encontrado");
    }

    // Se o CRM foi alterado, verificar se já existe outro médico com este CRM
    if (crm && crm !== doctorExists.crm) {
      const crmAlreadyExists = await prismaClient.doctor.findFirst({
        where: {
          crm: crm,
          NOT: {
            id: id
          }
        }
      });

      // Se já existe outro médico com este CRM, lançar um erro
      if (crmAlreadyExists) {
        throw new Error("Já existe outro médico cadastrado com este CRM");
      }
    }

    // Atualizar o médico no banco de dados
    const updatedDoctor = await prismaClient.doctor.update({
      where: {
        id: id
      },
      // Atualizar os campos fornecidos, mantendo os existentes se não forem alterados
      data: {
        name: name ?? doctorExists.name,
        crm: crm ?? doctorExists.crm,
        specialty: specialty ?? doctorExists.specialty,
        phone: phone ?? doctorExists.phone,
        email: email ?? doctorExists.email,
        updated_at: new Date()
      }
    });

    // Retorna o médico atualizado
    return updatedDoctor;
  }
}

export { UpdateDoctorService };