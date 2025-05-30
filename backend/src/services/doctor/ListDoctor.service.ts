import prismaClient from "../../prisma";

// Interface responsável por definir filtros para listar médicos
interface ListDoctorRequest {
  name?: string;
  specialty?: string;
  crm?: string;
}

// Serviço responsável por listar médicos
class ListDoctorService {
  async execute({ name, specialty, crm }: ListDoctorRequest) {
    const where: any = {};

    // Se um nome for fornecido, adiciona ao filtro com busca case-insensitive
    if (name) {
      where.name = {
        contains: name,
        mode: 'insensitive'
      };
    }

    // Se uma especialidade for fornecida, adiciona ao filtro
    if (specialty) {
      where.specialty = {
        contains: specialty,
        mode: 'insensitive'
      };
    }

    // Se um CRM for fornecido, adiciona ao filtro
    if (crm) {
      where.crm = {
        contains: crm
      };
    }

    // Busca os médicos no banco de dados com os filtros aplicados
    const doctors = await prismaClient.doctor.findMany({
      where,
      
      // Ordena os médicos por nome em ordem alfabética
      orderBy: {
        name: 'asc'
      }
    });

    // Retorna os médicos encontrados
    return doctors;
  }
  
  // Método para buscar estatísticas dos médicos
  async getStats() {
    // Contar total de médicos
    const totalMedicos = await prismaClient.doctor.count();
    
    // Buscar especialidades únicas
    const specialtiesResult = await prismaClient.doctor.findMany({
      select: {
        specialty: true
      },
      distinct: ['specialty']
    });
    
    // Contar especialidades únicas
    const especialidades = specialtiesResult.length;
    
    // Contar consultas para hoje
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Contar consultas agendadas para hoje
    const consultasHoje = await prismaClient.consultation.count({
      where: {
        date: {
          gte: today,
          lt: tomorrow
        }
      }
    });
    
    // Retorna as estatísticas coletadas
    return {
      totalMedicos,
      especialidades,
      consultasHoje
    };
  }
}

export { ListDoctorService };