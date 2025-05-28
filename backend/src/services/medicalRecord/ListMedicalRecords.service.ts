import prismaClient from "../../prisma";

interface ListMedicalRecordsRequest {
  consultation_id?: string;
}

class ListMedicalRecordsService {
  async execute({ consultation_id }: ListMedicalRecordsRequest) {
    const where: any = {};

    if (consultation_id) {
      where.consultation_id = consultation_id;
    }

    const medicalRecords = await prismaClient.medicalRecord.findMany({
      where,
      include: {
        consultation: {
          include: {
            doctor: true,
            patient: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    return medicalRecords;
  }
}

export { ListMedicalRecordsService };