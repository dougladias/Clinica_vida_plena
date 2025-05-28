import prismaClient from "../../prisma";

class DeleteDoctorService {
  async execute(id: string) {
    // Verificar se o médico existe
    const doctorExists = await prismaClient.doctor.findUnique({
      where: {
        id: id
      }
    });

    if (!doctorExists) {
      throw new Error("Médico não encontrado");
    }

    // Verificar se o médico possui consultas relacionadas
    const consultations = await prismaClient.consultation.findMany({
      where: {
        doctor_id: id
      }
    });

    if (consultations.length > 0) {
      throw new Error("Não é possível excluir um médico que possui consultas registradas");
    }

    // Excluir o médico do banco de dados
    const deletedDoctor = await prismaClient.doctor.delete({
      where: {
        id: id
      }
    });

    return deletedDoctor;
  }
}

export { DeleteDoctorService };