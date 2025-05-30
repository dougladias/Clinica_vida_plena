import React from 'react';
import { Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedEspecialidade: string;
  especialidades: string[];
  onEspecialidadeChange: (value: string) => void;
  onAddClick: () => void;
  loading: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  selectedEspecialidade,
  especialidades,
  onEspecialidadeChange,
  onAddClick,
  loading
}) => {
  return (
    <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
      <div className="relative flex-grow md:max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
        <Input
          type="text"
          placeholder="Buscar médico, especialidade ou CRM..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 w-full"
        />
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Filtro por especialidade */}
        <select
          value={selectedEspecialidade}
          onChange={(e) => onEspecialidadeChange(e.target.value)}
          className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todas especialidades</option>
          {especialidades.map(esp => (
            <option key={esp} value={esp}>{esp}</option>
          ))}
        </select>

        <Button variant="default" onClick={onAddClick} disabled={loading}>
          <Plus className="w-5 h-5 mr-2" />
          Novo Médico
        </Button>
      </div>
    </div>
  );
};