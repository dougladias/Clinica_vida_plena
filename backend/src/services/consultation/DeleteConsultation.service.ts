import prismaClient from "../../prisma";


// É responsável por Deletar uma nova consulta
class DeleteConsultationService {
  async execute(id: string) {
    // Verificar se a consulta existe
    const consultationExists = await prismaClient.consultation.findUnique({
      where: {
        id
      },
      include: {
        medicalRecords: true,
        prescriptions: true
      }
    });

    // Se a consulta não existir, lançar um erro
    if (!consultationExists) {
      throw new Error("Consulta não encontrada");
    }

    // Verificar se a consulta possui prontuários ou receitas relacionados
    if (consultationExists.medicalRecords.length > 0 || consultationExists.prescriptions.length > 0) {
      throw new Error("Não é possível excluir uma consulta que possui prontuários ou receitas registradas");
    }

    // Excluir a consulta do banco de dados
    const deletedConsultation = await prismaClient.consultation.delete({
      where: {
        id
      },
      include: {
        doctor: true,
        patient: true
      }
    });

    // Retorna a consulta excluída
    return deletedConsultation;
  }
}

export { DeleteConsultationService };