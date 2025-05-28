import prismaClient from "../../prisma";

// é a interface responsável por listar as prescrições médicas
interface ListPrescriptionsRequest {
  consultation_id?: string;
}

// Serviço responsável por listar prescrições médicas
class ListPrescriptionsService {
  async execute({ consultation_id }: ListPrescriptionsRequest) {
    const where: any = {};

    // Se um ID de consulta for fornecido, adiciona ao filtro
    if (consultation_id) {
      where.consultation_id = consultation_id;
    }
    
    // Busca as prescrições médicas no banco de dados com os filtros aplicados
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

    // Retorna as prescrições médicas encontradas
    return prescriptions;
  }

  // Método para encontrar uma prescrição médica por ID
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

    // Se a prescrição não existir, lançar um erro
    if (!prescription) {
      throw new Error("Receita médica não encontrada");
    }

    // Retorna a prescrição encontrada
    return prescription;
  }
}

export { ListPrescriptionsService };