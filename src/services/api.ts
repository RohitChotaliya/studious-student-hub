
import { Student, Payment, DashboardStats, ApiResponse, StudentFilters } from "@/types";

// Mock data for students
const mockStudents: Student[] = [
  {
    id: 1,
    firstName: "Rahul",
    lastName: "Sharma",
    mobileNumber: "9876543210",
    fatherMobileNumber: "9876543211",
    adharCard: "1234 5678 9012",
    pocketMoney: 500,
    addDate: "2023-01-15",
    checkoutDate: null,
    status: "active",
    isOverdue: false,
    payments: [
      { id: 1, studentId: 1, amount: 5000, paymentDate: "2023-01-15", freeMonth: false },
      { id: 2, studentId: 1, amount: 5000, paymentDate: "2023-02-15", freeMonth: false },
      { id: 3, studentId: 1, amount: 0, paymentDate: "2023-03-15", freeMonth: true },
    ]
  },
  {
    id: 2,
    firstName: "Priya",
    lastName: "Patel",
    mobileNumber: "9876543220",
    fatherMobileNumber: "9876543221",
    adharCard: "2345 6789 0123",
    pocketMoney: 1000,
    addDate: "2023-02-10",
    checkoutDate: null,
    status: "active",
    isOverdue: true,
    payments: [
      { id: 4, studentId: 2, amount: 5000, paymentDate: "2023-02-10", freeMonth: false },
    ]
  },
  {
    id: 3,
    firstName: "Amit",
    lastName: "Kumar",
    mobileNumber: "9876543230",
    fatherMobileNumber: "9876543231",
    adharCard: "3456 7890 1234",
    pocketMoney: 700,
    addDate: "2023-01-20",
    checkoutDate: "2023-04-15",
    status: "inactive",
    isOverdue: false,
    payments: [
      { id: 5, studentId: 3, amount: 5000, paymentDate: "2023-01-20", freeMonth: false },
      { id: 6, studentId: 3, amount: 5000, paymentDate: "2023-02-20", freeMonth: false },
      { id: 7, studentId: 3, amount: 5000, paymentDate: "2023-03-20", freeMonth: false },
    ]
  },
  {
    id: 4,
    firstName: "Neha",
    lastName: "Singh",
    mobileNumber: "9876543240",
    fatherMobileNumber: "9876543241",
    adharCard: "4567 8901 2345",
    pocketMoney: 1200,
    addDate: "2023-03-05",
    checkoutDate: null,
    status: "active",
    isOverdue: false,
    payments: [
      { id: 8, studentId: 4, amount: 5000, paymentDate: "2023-03-05", freeMonth: false },
      { id: 9, studentId: 4, amount: 5000, paymentDate: "2023-04-05", freeMonth: false },
    ]
  },
  {
    id: 5,
    firstName: "Vikram",
    lastName: "Rajput",
    mobileNumber: "9876543250",
    fatherMobileNumber: "9876543251",
    adharCard: "5678 9012 3456",
    pocketMoney: 800,
    addDate: "2023-02-25",
    checkoutDate: "2023-05-10",
    status: "inactive",
    isOverdue: false,
    payments: [
      { id: 10, studentId: 5, amount: 5000, paymentDate: "2023-02-25", freeMonth: false },
      { id: 11, studentId: 5, amount: 5000, paymentDate: "2023-03-25", freeMonth: false },
      { id: 12, studentId: 5, amount: 0, paymentDate: "2023-04-25", freeMonth: true },
    ]
  }
];

// Mock API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// API methods
export const api = {
  // Dashboard stats
  getDashboardStats: async (): Promise<ApiResponse<DashboardStats>> => {
    await delay(800);
    
    const activeStudents = mockStudents.filter(s => s.status === "active").length;
    const inactiveStudents = mockStudents.filter(s => s.status === "inactive").length;
    
    const totalPayments = mockStudents.flatMap(s => s.payments || [])
      .reduce((sum, payment) => sum + payment.amount, 0);
    
    // Generate monthly data for the chart
    const monthlyData = [
      { month: "Jan", amount: 10000 },
      { month: "Feb", amount: 15000 },
      { month: "Mar", amount: 10000 },
      { month: "Apr", amount: 10000 },
      { month: "May", amount: 5000 },
    ];
    
    return {
      success: true,
      data: {
        totalStudents: mockStudents.length,
        activeStudents,
        inactiveStudents,
        totalPaymentsCollected: totalPayments,
        monthlyData
      }
    };
  },
  
  // Get students with filters
  getStudents: async (filters?: StudentFilters): Promise<ApiResponse<Student[]>> => {
    await delay(800);
    
    let filteredStudents = [...mockStudents];
    
    if (filters) {
      // Apply search term filter
      if (filters.searchTerm) {
        const searchTerm = filters.searchTerm.toLowerCase();
        filteredStudents = filteredStudents.filter(student => 
          student.firstName.toLowerCase().includes(searchTerm) || 
          student.lastName.toLowerCase().includes(searchTerm) || 
          student.mobileNumber.includes(searchTerm)
        );
      }
      
      // Apply status filter
      if (filters.status && filters.status !== 'all') {
        filteredStudents = filteredStudents.filter(student => student.status === filters.status);
      }
      
      // Apply date filters
      if (filters.startDate) {
        filteredStudents = filteredStudents.filter(student => 
          new Date(student.addDate) >= new Date(filters.startDate!)
        );
      }
      
      if (filters.endDate) {
        filteredStudents = filteredStudents.filter(student => 
          new Date(student.addDate) <= new Date(filters.endDate!)
        );
      }
    }
    
    return {
      success: true,
      data: filteredStudents
    };
  },
  
  // Get inactive students (checkout)
  getInactiveStudents: async (): Promise<ApiResponse<Student[]>> => {
    await delay(800);
    
    const inactiveStudents = mockStudents.filter(student => student.status === "inactive");
    
    return {
      success: true,
      data: inactiveStudents
    };
  },
  
  // Get student by ID
  getStudentById: async (id: number): Promise<ApiResponse<Student>> => {
    await delay(600);
    
    const student = mockStudents.find(s => s.id === id);
    
    if (!student) {
      return {
        success: false,
        message: "Student not found",
        data: {} as Student
      };
    }
    
    return {
      success: true,
      data: student
    };
  },
  
  // Add student
  addStudent: async (student: Omit<Student, 'id' | 'payments' | 'isOverdue'>): Promise<ApiResponse<Student>> => {
    await delay(1000);
    
    const newStudent: Student = {
      ...student,
      id: Math.max(...mockStudents.map(s => s.id)) + 1,
      payments: [],
      isOverdue: false
    };
    
    // In a real implementation, we would add to the database
    // mockStudents.push(newStudent);
    
    return {
      success: true,
      message: "Student added successfully",
      data: newStudent
    };
  },
  
  // Update student
  updateStudent: async (id: number, student: Partial<Student>): Promise<ApiResponse<Student>> => {
    await delay(1000);
    
    const index = mockStudents.findIndex(s => s.id === id);
    
    if (index === -1) {
      return {
        success: false,
        message: "Student not found",
        data: {} as Student
      };
    }
    
    // In a real implementation, we would update the database
    const updatedStudent = {
      ...mockStudents[index],
      ...student
    };
    
    return {
      success: true,
      message: "Student updated successfully",
      data: updatedStudent
    };
  },
  
  // Delete student
  deleteStudent: async (id: number): Promise<ApiResponse<void>> => {
    await delay(800);
    
    const index = mockStudents.findIndex(s => s.id === id);
    
    if (index === -1) {
      return {
        success: false,
        message: "Student not found",
        data: undefined
      };
    }
    
    // In a real implementation, we would delete from the database
    // mockStudents.splice(index, 1);
    
    return {
      success: true,
      message: "Student deleted successfully",
      data: undefined
    };
  },
  
  // Add payment
  addPayment: async (payment: Omit<Payment, 'id'>): Promise<ApiResponse<Payment>> => {
    await delay(800);
    
    const student = mockStudents.find(s => s.id === payment.studentId);
    
    if (!student) {
      return {
        success: false,
        message: "Student not found",
        data: {} as Payment
      };
    }
    
    const newPayment: Payment = {
      ...payment,
      id: Math.max(...mockStudents.flatMap(s => (s.payments || []).map(p => p.id)), 0) + 1
    };
    
    // In a real implementation, we would add to the database
    // if (student.payments) {
    //   student.payments.push(newPayment);
    // } else {
    //   student.payments = [newPayment];
    // }
    
    return {
      success: true,
      message: "Payment added successfully",
      data: newPayment
    };
  }
};
