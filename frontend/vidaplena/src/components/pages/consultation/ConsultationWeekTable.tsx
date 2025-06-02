// ====================================
// ARQUIVO: src/components/pages/consultation/ConsultationWeeklyTable.tsx
// ====================================

import React from 'react';
import { CalendarDays, Edit, Trash2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Consultation } from '@/types/consultation.type';

// Types para compatibilidade
type Doctor = {
  id: string;
  name: string;
}

type Patient = {
  id: string;
  name: string;
}

interface ConsultationWeeklyTableProps {
  consultationsOfDay: Consultation[];
  getDoctorById: (id: string) => Doctor | undefined;
  getPatientById: (id: string) => Patient | undefined;
  handleEdit: (consultation: Consultation) => void;
  handleDelete: (id: string) => void;
}

export const ConsultationWeeklyTable: React.FC<ConsultationWeeklyTableProps> = ({
  consultationsOfDay,
  getDoctorById,
  getPatientById,
  handleEdit,
  handleDelete
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <CalendarDays className="text-purple-500 dark:text-purple-400 w-6 h-6" />
          Consultas da Semana
        </CardTitle>
        <CardDescription>Visão detalhada</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Horário</TableHead>
              <TableHead>Paciente</TableHead>
              <TableHead>Médico</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {consultationsOfDay.map(consultation => (
              <TableRow key={consultation.id}>
                <TableCell>{consultation.date}</TableCell>
                <TableCell>{consultation.time}</TableCell>
                <TableCell>
                  {getPatientById(consultation.patient_id)?.name || "Não encontrado"}
                </TableCell>
                <TableCell>
                  {getDoctorById(consultation.doctor_id)?.name || "Não encontrado"}
                </TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="ghost" onClick={() => handleEdit(consultation)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(consultation.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};