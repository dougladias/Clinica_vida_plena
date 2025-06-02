import React from 'react';
import { Loader2, UserCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DoctorCard } from './DoctorCard';
import { Doctor } from '@/types/doctor.type'; // ← TYPE ATUALIZADO

interface DoctorListProps {
  loading: boolean;
  medicos: Doctor[]; // ← TYPE ATUALIZADO
  searchTerm: string;
  selectedEspecialidade: string;
  onEdit: (medico: Doctor) => void; // ← TYPE ATUALIZADO
  onDelete: (id: string) => void;
}

export const DoctorList: React.FC<DoctorListProps> = ({
  loading,
  medicos,
  searchTerm,
  selectedEspecialidade,
  onEdit,
  onDelete
}) => {
  const medicosFiltrados = medicos.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         m.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         m.crm.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEspecialidade = !selectedEspecialidade || m.specialty === selectedEspecialidade;
    
    return matchesSearch && matchesEspecialidade;
  });

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Corpo Médico</CardTitle>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-3">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <p className="text-slate-500 dark:text-slate-400">Carregando médicos...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {medicosFiltrados.map((medico) => (
              <DoctorCard 
                key={medico.id} 
                medico={medico} 
                onEdit={onEdit} 
                onDelete={onDelete} 
              />
            ))}
          </div>
        )}

        {!loading && medicosFiltrados.length === 0 && (
          <div className="text-center py-12">
            <UserCheck className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400 text-lg mb-2">Nenhum médico encontrado</p>
            <p className="text-slate-400 dark:text-slate-500 text-sm">
              {searchTerm || selectedEspecialidade ? 'Tente ajustar os filtros de busca' : 'Comece cadastrando um novo médico'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};