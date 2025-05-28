import prismaClient from "../../prisma";


// é responsável por deletar um prontuário médico
class DeleteMedicalRecordService {
  async execute(id: string) {
    // Verificar se o prontuário existe
    const medicalRecordExists = await prismaClient.medicalRecord.findUnique({
      where: {
        id
      }
    });

    // Se o prontuário não existir, lançar um erro
    if (!medicalRecordExists) {
      throw new Error("Prontuário não encontrado");
    }

    // Excluir o prontuário do banco de dados
    const deletedMedicalRecord = await prismaClient.medicalRecord.delete({
      where: {
        id
      },
      // Incluir os dados da consulta relacionada
      include: {
        consultation: true
      }
    });

    // Retorna o prontuário excluído
    return deletedMedicalRecord;
  }
}

export { DeleteMedicalRecordService };