import prismaClient from "../../prisma";


// É responsável por Deletar um novo médico
class DeleteDoctorService {
  async execute(id: string) {
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

    // Verificar se o médico possui consultas relacionadas
    const consultations = await prismaClient.consultation.findMany({
      where: {
        doctor_id: id
      }
    });

    // Se o médico possui consultas, lançar um erro
    if (consultations.length > 0) {
      throw new Error("Não é possível excluir um médico que possui consultas registradas");
    }

    // Excluir o médico do banco de dados
    const deletedDoctor = await prismaClient.doctor.delete({
      where: {
        id: id
      }
    });

    // Retorna o médico excluído
    return deletedDoctor;
  }
}

export { DeleteDoctorService };