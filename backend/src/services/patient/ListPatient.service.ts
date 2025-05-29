import prismaClient from '../../prisma';

// Interface responsável por definir filtros para listar pacientes
interface ListPatientRequest {
  name?: string;
  cpf?: string;
}

// Serviço responsável por listar pacientes
class ListPatientService {
  async execute({ name, cpf }: ListPatientRequest) {
    const where: any = {};

    // Se um nome for fornecido, adiciona ao filtro com busca case-insensitive
    if (name) {
      where.name = {
        contains: name,
        mode: 'insensitive'
      };
    }

    // Se um CPF for fornecido, adiciona ao filtro
    if (cpf) {
      where.cpf = {
        contains: cpf
      };
    }

    // Busca os pacientes no banco de dados com os filtros aplicados
    const patients = await prismaClient.patient.findMany({
      where,
      
      // Ordena os pacientes por nome em ordem alfabética
      orderBy: {
        name: 'asc'
      }
    });

    // Retorna os pacientes encontrados
    return patients;
  }
}

export { ListPatientService };