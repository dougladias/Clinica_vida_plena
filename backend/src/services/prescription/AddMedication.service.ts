import prismaClient from "../../prisma";


// é interface responsável por atualizar um prontuário médico
interface AddMedicationRequest {
  prescription_id: string;
  name: string;
  dosage: string;
  instructions: string;
}

// Serviço responsável por adicionar um medicamento a uma receita médica
class AddMedicationService {
  async execute({ prescription_id, name, dosage, instructions }: AddMedicationRequest) {
    // Validações básicas
    if (!prescription_id) {
      throw new Error("ID da receita é obrigatório");
    }
    
    // Verifica se o nome do medicamento é fornecido
    if (!name) {
      throw new Error("Nome do medicamento é obrigatório");
    }

    // Verifica se a dosagem do medicamento é fornecida
    if (!dosage) {
      throw new Error("Dosagem do medicamento é obrigatória");
    }

    // Verifica se as instruções de uso do medicamento são fornecidas
    if (!instructions) {
      throw new Error("Instruções de uso são obrigatórias");
    }

    // Verificar se a receita existe
    const prescriptionExists = await prismaClient.prescription.findUnique({
      where: {
        id: prescription_id
      }
    });

    // Se a receita não existir, lançar um erro
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
      // Incluir os dados da consulta, médico e paciente relacionados
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

    // Se a receita não tiver sido atualizada, lançar um erro
    return {
      medication,
      prescription: updatedPrescription
    };
  }
}

export { AddMedicationService };