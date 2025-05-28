import prismaClient from "../../prisma";


// é interface responsável por listar os prontuários médicos
interface ListMedicalRecordsRequest {
  consultation_id?: string;
}

// Serviço responsável por listar prontuários médicos
class ListMedicalRecordsService {
  async execute({ consultation_id }: ListMedicalRecordsRequest) {
    const where: any = {};

    // Se um ID de consulta for fornecido, adiciona ao filtro
    if (consultation_id) {
      where.consultation_id = consultation_id;
    }

    // Busca os prontuários médicos no banco de dados com os filtros aplicados
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

      // Ordena os prontuários por data de criação, do mais recente para o mais antigo
      orderBy: {
        created_at: 'desc'
      }
    });

    // Retorna os prontuários médicos encontrados
    return medicalRecords;
  }
}

export { ListMedicalRecordsService };