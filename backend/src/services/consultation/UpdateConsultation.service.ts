import prismaClient from "../../prisma";

// É responsável por Atualizar consultas com base em critérios opcionais como médico, paciente e data
interface UpdateConsultationRequest {
  id: string;
  date?: Date;
  time?: string;
  doctor_id?: string;
  patient_id?: string;
}

// Serviço para atualizar uma consulta
class UpdateConsultationService {
  async execute({ id, date, time, doctor_id, patient_id }: UpdateConsultationRequest) {
    // Verificar se a consulta existe
    const consultationExists = await prismaClient.consultation.findUnique({
      where: {
        id
      }
    });

    // Se a consulta não existir, lançar um erro
    if (!consultationExists) {
      throw new Error("Consulta não encontrada");
    }

    // Se o médico foi alterado, verificar se ele existe
    if (doctor_id && doctor_id !== consultationExists.doctor_id) {
      const doctorExists = await prismaClient.doctor.findUnique({
        where: {
          id: doctor_id
        }
      });

      // Se o médico não existir, lançar um erro
      if (!doctorExists) {
        throw new Error("Médico não encontrado");
      }
    }

    // Se o paciente foi alterado, verificar se ele existe
    if (patient_id && patient_id !== consultationExists.patient_id) {
      const patientExists = await prismaClient.patient.findUnique({
        where: {
          id: patient_id
        }
      });

      // Se o paciente não existir, lançar um erro
      if (!patientExists) {
        throw new Error("Paciente não encontrado");
      }
    }

    // Se a data ou hora foi alterada, verificar se já existe outra consulta no mesmo horário
    if ((date && date !== consultationExists.date) || 
        (time && time !== consultationExists.time) || 
        (doctor_id && doctor_id !== consultationExists.doctor_id)) {
      
      // Verificar se já existe uma consulta agendada para o mesmo médico na mesma data e horário
      const checkDoctor = doctor_id || consultationExists.doctor_id;
      const checkDate = date || consultationExists.date;
      const checkTime = time || consultationExists.time;
      
      // Verificar se já existe uma consulta agendada para o mesmo médico na mesma data e horário
      const conflictingConsultation = await prismaClient.consultation.findFirst({
        where: {
          id: {
            not: id
          },
          doctor_id: checkDoctor,
          date: checkDate,
          time: checkTime
        }
      });

      // Se já existir uma consulta, lançar um erro
      if (conflictingConsultation) {
        throw new Error("Já existe uma consulta agendada para este médico nesta data e horário");
      }
    }

    // Atualizar a consulta no banco de dados
    const updatedConsultation = await prismaClient.consultation.update({
      where: {
        id
      },
      data: {
        date: date || undefined,
        time: time || undefined,
        doctor_id: doctor_id || undefined,
        patient_id: patient_id || undefined,
        updated_at: new Date()
      },
      include: {
        doctor: true,
        patient: true
      }
    });

    // Retorna a consulta atualizada
    return updatedConsultation;
  }
}

export { UpdateConsultationService };