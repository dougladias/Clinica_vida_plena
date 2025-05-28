import prismaClient from "../../prisma";

// É responsável por listar consultas com base em critérios opcionais como médico, paciente e data
interface ListConsultationsRequest {
  doctor_id?: string;
  patient_id?: string;
  date?: Date;
}

// Serviço para listar consultas
class ListConsultationsService {
  async execute({ doctor_id, patient_id, date }: ListConsultationsRequest) {
    const where: any = {};

    // Adiciona condições ao filtro de consultas com base nos parâmetros fornecidos
    if (doctor_id) {
      where.doctor_id = doctor_id;
    }

    // Verifica se o ID do paciente foi fornecido
    if (patient_id) {
      where.patient_id = patient_id;
    }

    // Verifica se a data foi fornecida
    if (date) {
      where.date = date;
    }

    // Busca as consultas no banco de dados com os filtros aplicados
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

    // Retorna as consultas encontradas
    return consultations;
  }
}

export { ListConsultationsService };