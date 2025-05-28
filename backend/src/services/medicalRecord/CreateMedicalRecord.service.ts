import prismaClient from "../../prisma";

interface MedicalRecordRequest {
  consultation_id: string;
  notes: string;
  diagnosis: string;
}

class CreateMedicalRecordService {
  async execute({ consultation_id, notes, diagnosis }: MedicalRecordRequest) {
    // Validações básicas
    if (!consultation_id) {
      throw new Error("ID da consulta é obrigatório");
    }
    
    if (!notes) {
      throw new Error("Anotações são obrigatórias");
    }

    if (!diagnosis) {
      throw new Error("Diagnóstico é obrigatório");
    }

    // Verificar se a consulta existe
    const consultationExists = await prismaClient.consultation.findUnique({
      where: {
        id: consultation_id
      }
    });

    if (!consultationExists) {
      throw new Error("Consulta não encontrada");
    }

    // Verificar se já existe um prontuário para esta consulta
    const existingMedicalRecord = await prismaClient.medicalRecord.findFirst({
      where: {
        consultation_id
      }
    });

    if (existingMedicalRecord) {
      throw new Error("Já existe um prontuário registrado para esta consulta");
    }

    // Criar o prontuário no banco de dados
    const medicalRecord = await prismaClient.medicalRecord.create({
      data: {
        consultation_id,
        notes,
        diagnosis
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

    return medicalRecord;
  }
}

export { CreateMedicalRecordService };