import prismaClient from "../../prisma";

class DeleteMedicalRecordService {
  async execute(id: string) {
    // Verificar se o prontuário existe
    const medicalRecordExists = await prismaClient.medicalRecord.findUnique({
      where: {
        id
      }
    });

    if (!medicalRecordExists) {
      throw new Error("Prontuário não encontrado");
    }

    // Excluir o prontuário do banco de dados
    const deletedMedicalRecord = await prismaClient.medicalRecord.delete({
      where: {
        id
      },
      include: {
        consultation: true
      }
    });

    return deletedMedicalRecord;
  }
}

export { DeleteMedicalRecordService };