import prismaClient from "../../prisma";

interface MedicationInput {
  name: string;
  dosage: string;
  instructions: string;
}

interface PrescriptionRequest {
  consultation_id: string;
  medications: MedicationInput[];
}

class CreatePrescriptionService {
  async execute({ consultation_id, medications }: PrescriptionRequest) {
    // Validações básicas
    if (!consultation_id) {
      throw new Error("ID da consulta é obrigatório");
    }
    
    if (!medications || medications.length === 0) {
      throw new Error("Pelo menos um medicamento deve ser informado");
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

    // Criar a receita e medicamentos associados em uma transação
    const prescription = await prismaClient.$transaction(async (prisma) => {
      // Criar a receita
      const newPrescription = await prisma.prescription.create({
        data: {
          consultation_id
        }
      });

      // Adicionar medicamentos à receita
      for (const med of medications) {
        await prisma.medication.create({
          data: {
            prescription_id: newPrescription.id,
            name: med.name,
            dosage: med.dosage,
            instructions: med.instructions
          }
        });
      }

      // Retornar a receita com os medicamentos
      return prisma.prescription.findUnique({
        where: {
          id: newPrescription.id
        },
        include: {
          consultation: {
            include: {
              doctor: true,
              patient: true
            }
          },
          medications: true
        }
      });
    });

    return prescription;
  }
}

export { CreatePrescriptionService };