import { PrismaClient } from '@prisma/client';


// Este arquivo inicializa e exporta uma instância do Prisma Client
const prismaClient = new PrismaClient();

// Exporta a instância do Prisma Client para uso em outras partes da aplicação
export default prismaClient;

