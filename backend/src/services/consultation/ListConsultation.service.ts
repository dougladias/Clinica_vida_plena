import prismaClient from "../../prisma";

interface ListConsultationsRequest {
  doctor_id?: string;
  patient_id?: string;
  date?: Date;
}

class ListConsultationsService {
  async execute({ doctor_id, patient_id, date }: ListConsultationsRequest) {
    const where: any = {};

    if (doctor_id) {
      where.doctor_id = doctor_id;
    }

    if (patient_id) {
      where.patient_id = patient_id;
    }

    if (date) {
      where.date = date;
    }

    const consultations = await prismaClient.consultation.findMany({
      where,
      include: {
        doctor: true,
        patient: true
      },
      orderBy: {
        date: 'asc'
      }
    });

    return consultations;
  }
}

export { ListConsultationsService };