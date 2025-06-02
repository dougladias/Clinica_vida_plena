import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, X, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { PatientTableRow } from "./PatientTableRow";
import { Patient } from "@/types/patient.type";

interface PatientTableProps {
  patients: Patient[];
  onEditPatient: (patient: Patient) => void;
  onDeletePatient: (id: string) => void;
  calculateAge: (birthDate: string) => number;
  getInitials: (name: string) => string;
}

export function PatientTable({ 
  patients, 
  onEditPatient, 
  onDeletePatient,
  calculateAge,
  getInitials
}: PatientTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  // Filtragem e paginação
  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.cpf.includes(searchTerm)
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPatients = filteredPatients.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);

  return (
    <motion.div variants={itemVariants}>
      <Card className="shadow-md dark:bg-slate-800 dark:border-slate-700">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 dark:text-slate-200">
                <Users className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                Lista de Pacientes
              </CardTitle>
              <CardDescription className="dark:text-slate-400">
                Gerencie todos os pacientes cadastrados no sistema
              </CardDescription>
            </div>

            {/* Barra de pesquisa */}
            <motion.div 
              initial={{ opacity: 0, width: "80%" }}
              animate={{ opacity: 1, width: "100%" }}
              transition={{ delay: 0.5 }}
              className="relative max-w-md w-full"
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4" />
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Buscar por nome ou CPF..."
                className="pl-10 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300 dark:placeholder:text-slate-500"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0 dark:text-slate-400 dark:hover:text-slate-300"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </motion.div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {filteredPatients.length > 0 ? (
            <Table>
              <TableHeader className="dark:bg-slate-900/50">
                <TableRow className="dark:border-slate-700">
                  <TableHead className="pl-11 dark:text-slate-300">Paciente</TableHead>
                  <TableHead className="hidden sm:table-cell pl-12 dark:text-slate-300">CPF</TableHead>
                  <TableHead className="hidden md:table-cell pl-5 dark:text-slate-300">Idade</TableHead>
                  <TableHead className="hidden lg:table-cell pl-12 dark:text-slate-300">Contato</TableHead>
                  <TableHead className="hidden xl:table-cell dark:text-slate-300">Endereço</TableHead>
                  <TableHead className="text-right pr-2 dark:text-slate-300">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedPatients.map((patient, index) => (
                  <PatientTableRow 
                    key={patient.id}
                    patient={patient}
                    index={index}
                    onEdit={onEditPatient}
                    onDelete={onDeletePatient}
                    calculateAge={calculateAge}
                    getInitials={getInitials}
                  />
                ))}
              </TableBody>
            </Table>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col items-center justify-center py-16"
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 260, 
                  damping: 20,
                  delay: 0.6 
                }}
                className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-full flex items-center justify-center shadow-inner mb-4"
              >
                <Users className="w-10 h-10 text-slate-400 dark:text-slate-500" />
              </motion.div>
              <motion.h3 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-4 text-lg font-medium text-slate-700 dark:text-slate-300"
              >
                Nenhum paciente encontrado
              </motion.h3>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-1 text-slate-500 dark:text-slate-400 text-center max-w-md"
              >
                {searchTerm 
                  ? `Não encontramos resultados para "${searchTerm}". Tente outro termo.`
                  : 'Você ainda não cadastrou nenhum paciente. Clique em "Novo Paciente" para começar.'
                }
              </motion.p>
              {searchTerm && (
                <Button 
                  variant="outline"
                  onClick={() => setSearchTerm('')}
                  className="mt-4 dark:border-slate-700 dark:text-slate-300"
                >
                  Limpar pesquisa
                </Button>
              )}
            </motion.div>
          )}
        </CardContent>
        
        {/* Paginação */}
        {filteredPatients.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="px-6 py-4 border-t dark:border-slate-700"
          >
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-slate-600 dark:text-slate-400 order-2 sm:order-1">
                Mostrando {startIndex + 1} a {Math.min(endIndex, filteredPatients.length)} de {filteredPatients.length} pacientes
              </p>
              <div className="flex items-center gap-2 order-1 sm:order-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage <= 1}
                  className="dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Anterior
                </Button>
                
                <div className="hidden sm:flex gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let page = i + 1;
                    if (totalPages > 5) {
                      if (currentPage <= 3) {
                        page = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        page = totalPages - 4 + i;
                      } else {
                        page = currentPage - 2 + i;
                      }
                    }
                    
                    return (
                      <Button
                        key={page}
                        variant={page === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 p-0 ${
                          page === currentPage
                            ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 dark:from-emerald-600 dark:to-emerald-800'
                            : 'dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
                        }`}
                      >
                        {page}
                      </Button>
                    );
                  })}
                </div>
                
                <div className="sm:hidden">
                  <Badge variant="outline" className="dark:border-slate-600 dark:text-slate-300">
                    {currentPage} de {totalPages}
                  </Badge>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage >= totalPages}
                  className="dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Próximo
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
}