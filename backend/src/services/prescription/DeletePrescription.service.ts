import prismaClient from "../../prisma";

class DeletePrescriptionService {
  async execute(id: string) {
    // Verificar se a receita existe
    const prescriptionExists = await prismaClient.prescription.findUnique({
      where: {
        id
      },
      include: {
        medications: true
      }
    });

    if (!prescriptionExists) {
      throw new Error("Receita médica não encontrada");
    }

    // Excluir em transação para garantir que todos os medicamentos sejam excluídos
    return await prismaClient.$transaction(async (prisma) => {
      // Excluir todos os medicamentos relacionados
      await prisma.medication.deleteMany({
        where: {
          prescription_id: id
        }
      });

      // Excluir a receita
      return prisma.prescription.delete({
        where: {
          id
        },
        include: {
          consultation: true
        }
      });
    });
  }
}

export { DeletePrescriptionService };