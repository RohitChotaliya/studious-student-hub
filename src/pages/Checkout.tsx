
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { api } from "@/services/api";
import { Student } from "@/types";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Checkout = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchInactiveStudents = async () => {
      try {
        setLoading(true);
        const response = await api.getInactiveStudents();
        if (response.success) {
          setStudents(response.data);
        } else {
          toast({
            title: "Error",
            description: "Failed to load checkout data",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching inactive students:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInactiveStudents();
  }, [toast]);

  // Calculate total payments for a student
  const calculateTotalPayments = (student: Student) => {
    if (!student.payments || student.payments.length === 0) return 0;
    return student.payments.reduce((sum, payment) => sum + payment.amount, 0);
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Checkout Records</h1>

      {loading ? (
        <div className="h-96 rounded-lg bg-gray-100 animate-pulse" />
      ) : students.length === 0 ? (
        <div className="text-center p-10 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">No checkout records found</h3>
          <p className="text-gray-500">
            When students check out, they will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Checkout Date</TableHead>
                <TableHead className="text-right">Total Paid</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.id}</TableCell>
                  <TableCell>
                    {student.firstName} {student.lastName}
                  </TableCell>
                  <TableCell>{student.mobileNumber}</TableCell>
                  <TableCell>
                    {format(new Date(student.addDate), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell>
                    {student.checkoutDate
                      ? format(new Date(student.checkoutDate), "MMM dd, yyyy")
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    ₹{calculateTotalPayments(student).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default Checkout;
