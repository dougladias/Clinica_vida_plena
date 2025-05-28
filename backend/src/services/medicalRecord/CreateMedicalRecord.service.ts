import prismaClient from "../../prisma";


// É inteface para definir os parâmetros necessários para criar um prontuário médico
interface MedicalRecordRequest {
  consultation_id: string;
  notes: string;
  diagnosis: string;
}

// Serviço para criar um prontuário médico
class CreateMedicalRecordService {
  async execute({ consultation_id, notes, diagnosis }: MedicalRecordRequest) {
    // Validações básicas
    if (!consultation_id) {
      throw new Error("ID da consulta é obrigatório");
    }
    
    // Verifica se as anotações são fornecidas
    if (!notes) {
      throw new Error("Anotações são obrigatórias");
    }

    // Verifica se o diagnóstico é fornecido
    if (!diagnosis) {
      throw new Error("Diagnóstico é obrigatório");
    }

    // Verificar se a consulta existe
    const consultationExists = await prismaClient.consultation.findUnique({
      where: {
        id: consultation_id
      }
    });

    // Se a consulta não existir, lançar um erro
    if (!consultationExists) {
      throw new Error("Consulta não encontrada");
    }

    // Verificar se já existe um prontuário para esta consulta
    const existingMedicalRecord = await prismaClient.medicalRecord.findFirst({
      where: {
        consultation_id
      }
    });

    // Se já existe um prontuário, lançar um erro
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

    // Retorna o prontuário criado
    return medicalRecord;
  }
}

export { CreateMedicalRecordService };