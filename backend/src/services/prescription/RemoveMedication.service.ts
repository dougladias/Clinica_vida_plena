import prismaClient from "../../prisma";



// Serviço responsável por remover um medicamento de uma receita
class RemoveMedicationService {
  async execute(id: string) {
    // Verificar se o medicamento existe
    const medicationExists = await prismaClient.medication.findUnique({
      where: {
        id
      }
    });

    // Se o medicamento não existir, lançar um erro
    if (!medicationExists) {
      throw new Error("Medicamento não encontrado");
    }

    // Remover o medicamento
    const medication = await prismaClient.medication.delete({
      where: {
        id
      }
    });

    // Retornar a receita atualizada com todos os medicamentos restantes
    const updatedPrescription = await prismaClient.prescription.findUnique({
      where: {
        id: medicationExists.prescription_id
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

    // Se a receita não existir, lançar um erro
    return {
      removedMedication: medication,
      prescription: updatedPrescription
    };
  }
}

export { RemoveMedicationService };