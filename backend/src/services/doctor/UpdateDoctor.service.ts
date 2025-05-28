import prismaClient from "../../prisma";

interface UpdateDoctorRequest {
  id: string;
  name?: string;
  crm?: string;
  specialty?: string;
  phone?: string;
  email?: string;
}

class UpdateDoctorService {
  async execute({ id, name, crm, specialty, phone, email }: UpdateDoctorRequest) {
    // Verificar se o médico existe
    const doctorExists = await prismaClient.doctor.findUnique({
      where: {
        id: id
      }
    });

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

      if (crmAlreadyExists) {
        throw new Error("Já existe outro médico cadastrado com este CRM");
      }
    }

    // Atualizar o médico no banco de dados
    const updatedDoctor = await prismaClient.doctor.update({
      where: {
        id: id
      },
      data: {
        name: name ?? doctorExists.name,
        crm: crm ?? doctorExists.crm,
        specialty: specialty ?? doctorExists.specialty,
        phone: phone ?? doctorExists.phone,
        email: email ?? doctorExists.email,
        updated_at: new Date()
      }
    });

    return updatedDoctor;
  }
}

export { UpdateDoctorService };