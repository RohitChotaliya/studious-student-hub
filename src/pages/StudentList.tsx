
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Student, StudentFilters } from "@/types";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import StudentCard from "@/components/students/StudentCard";
import StudentFiltersComponent from "@/components/students/StudentFilters";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const StudentList = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<StudentFilters>({});
  const [studentToDelete, setStudentToDelete] = useState<number | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, [filters]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await api.getStudents(filters);
      if (response.success) {
        setStudents(response.data);
      } else {
        toast({
          title: "Error",
          description: "Failed to load students",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditStudent = (id: number) => {
    navigate(`/students/edit/${id}`);
  };

  const handleAddStudent = () => {
    navigate("/students/add");
  };

  const handleDeleteStudent = async () => {
    if (studentToDelete === null) return;

    try {
      const response = await api.deleteStudent(studentToDelete);
      if (response.success) {
        toast({
          title: "Success",
          description: "Student deleted successfully",
        });
        // Remove the deleted student from the list
        setStudents((prevStudents) =>
          prevStudents.filter((student) => student.id !== studentToDelete)
        );
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to delete student",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting student:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      // Close the delete dialog
      setStudentToDelete(null);
    }
  };

  const handleFilterChange = (newFilters: StudentFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="page-container">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="page-title mb-4 md:mb-0">Students</h1>
        <Button onClick={handleAddStudent}>
          <Plus className="mr-2 h-4 w-4" /> Add New Student
        </Button>
      </div>

      <StudentFiltersComponent onFilterChange={handleFilterChange} />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="h-64 rounded-lg bg-gray-100 animate-pulse" />
            ))}
        </div>
      ) : students.length === 0 ? (
        <div className="text-center p-10 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">No students found</h3>
          <p className="text-gray-500 mb-4">
            {Object.keys(filters).length > 0
              ? "Try adjusting your filters to see more results."
              : "Get started by adding your first student."}
          </p>
          <Button onClick={handleAddStudent}>
            <Plus className="mr-2 h-4 w-4" /> Add New Student
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              onEdit={handleEditStudent}
              onDelete={setStudentToDelete}
            />
          ))}
        </div>
      )}

      <AlertDialog open={studentToDelete !== null} onOpenChange={(open) => !open && setStudentToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the student and all their payment records from our database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteStudent}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default StudentList;
