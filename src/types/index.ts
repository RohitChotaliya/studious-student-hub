
export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  fatherMobileNumber: string;
  adharCard: string;
  pocketMoney: number;
  addDate: string;
  checkoutDate: string | null;
  status: 'active' | 'inactive';
  payments?: Payment[];
  isOverdue?: boolean;
}

export interface Payment {
  id: number;
  studentId: number;
  amount: number;
  paymentDate: string;
  freeMonth: boolean;
}

export interface DashboardStats {
  totalStudents: number;
  activeStudents: number;
  inactiveStudents: number;
  totalPaymentsCollected: number;
  monthlyData?: { month: string; amount: number }[];
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface StudentFilters {
  searchTerm?: string;
  status?: 'active' | 'inactive' | 'all';
  startDate?: string;
  endDate?: string;
}
