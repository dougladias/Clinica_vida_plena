import prismaClient from "../../prisma";


// é interface responsável por listar os prontuários médicos
interface UpdateMedicalRecordRequest {
  id: string;
  notes?: string;
  diagnosis?: string;
}

// Serviço responsável por atualizar prontuários médicos
class UpdateMedicalRecordService {
  async execute({ id, notes, diagnosis }: UpdateMedicalRecordRequest) {
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

    // Atualizar o prontuário no banco de dados
    const updatedMedicalRecord = await prismaClient.medicalRecord.update({
      where: {
        id
      },
      // Atualizar os campos fornecidos, mantendo os existentes se não forem alterados
      data: {
        notes: notes ?? medicalRecordExists.notes,
        diagnosis: diagnosis ?? medicalRecordExists.diagnosis,
        updated_at: new Date()
      },
      // Incluir os dados da consulta, médico e paciente relacionados
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