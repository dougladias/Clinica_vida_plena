import prismaClient from "../../prisma";

interface ConsultationRequest {
  date: Date;
  time: string;
  doctor_id: string;
  patient_id: string;
}

class CreateConsultationService {
  async execute({ date, time, doctor_id, patient_id }: ConsultationRequest) {
    // Validações básicas
    if (!date) {
      throw new Error("Data da consulta é obrigatória");
    }
    
    if (!time) {
      throw new Error("Horário da consulta é obrigatório");
    }

    if (!doctor_id) {
      throw new Error("ID do médico é obrigatório");
    }

    if (!patient_id) {
      throw new Error("ID do paciente é obrigatório");
    }

    // Verificar se o médico existe
    const doctorExists = await prismaClient.doctor.findUnique({
      where: {
        id: doctor_id
      }
    });

    if (!doctorExists) {
      throw new Error("Médico não encontrado");
    }

    // Verificar se o paciente existe
    const patientExists = await prismaClient.patient.findUnique({
      where: {
        id: patient_id
      }
    });

    if (!patientExists) {
      throw new Error("Paciente não encontrado");
    }

    // Verificar se já existe uma consulta para o mesmo médico na mesma data e horário
    const consultationExists = await prismaClient.consultation.findFirst({
      where: {
        doctor_id,
        date: {
          equals: date
        },
        time
      }
    });

    if (consultationExists) {
      throw new Error("Já existe uma consulta agendada para este médico nesta data e horário");
    }

    // Criar a consulta no banco de dados
    const consultation = await prismaClient.consultation.create({
      data: {
        date,
        time,
        doctor_id,
        patient_id
      },
      include: {
        doctor: true,
        patient: true
      }
    });

    return consultation;
  }
}

export { CreateConsultationService };