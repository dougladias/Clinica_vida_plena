import prismaClient from "../../prisma";

interface AddMedicationRequest {
  prescription_id: string;
  name: string;
  dosage: string;
  instructions: string;
}

class AddMedicationService {
  async execute({ prescription_id, name, dosage, instructions }: AddMedicationRequest) {
    // Validações básicas
    if (!prescription_id) {
      throw new Error("ID da receita é obrigatório");
    }
    
    if (!name) {
      throw new Error("Nome do medicamento é obrigatório");
    }

    if (!dosage) {
      throw new Error("Dosagem do medicamento é obrigatória");
    }

    if (!instructions) {
      throw new Error("Instruções de uso são obrigatórias");
    }

    // Verificar se a receita existe
    const prescriptionExists = await prismaClient.prescription.findUnique({
      where: {
        id: prescription_id
      }
    });

    if (!prescriptionExists) {
      throw new Error("Receita médica não encontrada");
    }

    // Adicionar o medicamento
    const medication = await prismaClient.medication.create({
      data: {
        prescription_id,
        name,
        dosage,
        instructions
      }
    });

    // Retornar a receita atualizada com todos os medicamentos
    const updatedPrescription = await prismaClient.prescription.findUnique({
      where: {
        id: prescription_id
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

    return {
      medication,
      prescription: updatedPrescription
    };
  }
}

export { AddMedicationService };