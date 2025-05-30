import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Phone, MapPin, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { Patient } from "@/types/patient.type";

interface PatientTableRowProps {
  patient: Patient;
  index: number;
  onEdit: (patient: Patient) => void;
  onDelete: (id: string) => void;
  calculateAge: (birthDate: string) => number;
  getInitials: (name: string) => string;
}

export function PatientTableRow({ 
  patient, 
  index, 
  onEdit, 
  onDelete,
  calculateAge,
  getInitials
}: PatientTableRowProps) {
  return (
    <TableRow
      className={`transition-colors animate-in fade-in slide-in-from-left-5 duration-300 dark:border-slate-700`}
      style={{
        animationDelay: `${index * 50}ms`,
        backgroundColor: "rgba(241, 245, 249, 0)"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "rgba(241, 245, 249, 0.7)";
        if (document.documentElement.classList.contains('dark')) {
          e.currentTarget.style.backgroundColor = "rgba(30, 41, 59, 0.7)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "rgba(241, 245, 249, 0)";
      }}
    >
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback className="bg-gradient-to-br from-emerald-100 to-blue-100 dark:from-emerald-900 dark:to-blue-900 text-slate-700 dark:text-slate-300 font-medium">
              {getInitials(patient.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-slate-800 dark:text-slate-200">{patient.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 sm:hidden">
              CPF: {patient.cpf}
            </p>
          </div>
        </div>
      </TableCell>
      
      <TableCell className="hidden sm:table-cell">
        <Badge variant="outline" className="font-mono text-xs dark:border-slate-600 dark:text-slate-300">
          {patient.cpf}
        </Badge>
      </TableCell>
      
      <TableCell className="hidden md:table-cell">
        <div>
          <span className="text-slate-800 dark:text-slate-300 pl-2 font-medium">{calculateAge(patient.date_birth)} anos</span>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {new Date(patient.date_birth).toLocaleDateString('pt-BR')}
          </p>
        </div>
      </TableCell>
      
      <TableCell className="hidden lg:table-cell">
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-slate-400 dark:text-slate-500" />
          <span className="text-sm text-slate-600 dark:text-slate-300">{patient.phone}</span>
        </div>
      </TableCell>
      
      <TableCell className="hidden xl:table-cell">
        <div className="flex items-start gap-2 max-w-xs">
          <MapPin className="w-4 h-4 text-slate-400 dark:text-slate-500 mt-0.5 flex-shrink-0" />
          <span className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">{patient.address}</span>
        </div>
      </TableCell>
      
      <TableCell>
        <div className="flex items-center justify-end gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 dark:text-slate-400 dark:hover:text-slate-300">
                <span className="sr-only">Abrir menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="dark:bg-slate-900 dark:border-slate-700">
              <DropdownMenuItem onClick={() => onEdit(patient)} className="dark:text-slate-300 dark:focus:text-slate-200 dark:focus:bg-slate-800">
                <Edit className="mr-2 h-4 w-4" />
                <span>Editar</span>
              </DropdownMenuItem>                                
              <Separator className="dark:bg-slate-700" />
              <DropdownMenuItem 
                onClick={() => onDelete(patient.id)}
                className="text-red-600 dark:text-red-500 dark:focus:bg-slate-800"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Excluir</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>        
        </div>
      </TableCell>
    </TableRow>
  );
}