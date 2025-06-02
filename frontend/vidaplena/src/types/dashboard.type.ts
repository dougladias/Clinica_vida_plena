export interface DashboardStats {
  patients: {
    total: number;
    newThisMonth: number;
    activeConsultations: number;
  };
  doctors: {
    total: number;
    specialties: number;
    consultationsToday: number;
  };
  consultations: {
    total: number;
    today: number;
    scheduled: number;
    completed: number;
  };
  medicalRecords: {
    total: number;
    thisMonth: number;
    completedConsultations: number;
  };
  prescriptions: {
    total: number;
    thisMonth: number;
    activePrescriptions: number;
  };
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string[];
    borderWidth?: number;
  }[];
}

export interface RecentActivity {
  id: string;
  type: 'consultation' | 'patient' | 'prescription' | 'medical_record';
  title: string;
  description: string;
  timestamp: string;
  user: string;
}