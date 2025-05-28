import prismaClient from "../../prisma";

interface UpdateMedicalRecordRequest {
  id: string;
  notes?: string;
  diagnosis?: string;
}

class UpdateMedicalRecordService {
  async execute({ id, notes, diagnosis }: UpdateMedicalRecordRequest) {
    // Verificar se o prontuário existe
    const medicalRecordExists = await prismaClient.medicalRecord.findUnique({
      where: {
        id
      }
    });

    if (!medicalRecordExists) {
      throw new Error("Prontuário não encontrado");
    }

    // Atualizar o prontuário no banco de dados
    const updatedMedicalRecord = await prismaClient.medicalRecord.update({
      where: {
        id
      },
      data: {
        notes: notes ?? medicalRecordExists.notes,
        diagnosis: diagnosis ?? medicalRecordExists.diagnosis,
        updated_at: new Date()
      },
      include: {
        consultation: {
          include: {
            doctor: true,
            patient: true
          }
        }
      }
    });

    return updatedMedicalRecord;
  }
}

export { UpdateMedicalRecordService };