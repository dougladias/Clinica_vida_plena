import prismaClient from "../../prisma";

interface ListPrescriptionsRequest {
  consultation_id?: string;
}

class ListPrescriptionsService {
  async execute({ consultation_id }: ListPrescriptionsRequest) {
    const where: any = {};

    if (consultation_id) {
      where.consultation_id = consultation_id;
    }

    const prescriptions = await prismaClient.prescription.findMany({
      where,
      include: {
        consultation: {
          include: {
            doctor: true,
            patient: true
          }
        },
        medications: true
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    return prescriptions;
  }

  async findById(id: string) {
    const prescription = await prismaClient.prescription.findUnique({
      where: { id },
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

    if (!prescription) {
      throw new Error("Receita médica não encontrada");
    }

    return prescription;
  }
}

export { ListPrescriptionsService };