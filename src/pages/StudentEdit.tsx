
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { api } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import StudentForm from "@/components/students/StudentForm";
import { Student } from "@/types";

// Schema should match the one in StudentForm
const formSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  mobileNumber: z.string().min(10),
  fatherMobileNumber: z.string().min(10),
  adharCard: z.string().min(1),
  pocketMoney: z.number().nonnegative(),
  addDate: z.date(),
  status: z.enum(["active", "inactive"]),
  checkoutDate: z.date().nullable().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const StudentEdit = () => {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudent = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await api.getStudentById(parseInt(id));
        if (response.success) {
          setStudent(response.data);
        } else {
          toast({
            title: "Error",
            description: "Failed to load student data",
            variant: "destructive",
          });
          navigate("/students");
        }
      } catch (error) {
        console.error("Error fetching student:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
        navigate("/students");
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id, navigate, toast]);

  const handleSubmit = async (data: FormValues) => {
    if (!id) return;
    
    try {
      setIsSubmitting(true);
      
      // Convert the date objects to strings
      const studentData = {
        ...data,
        addDate: data.addDate.toISOString().split("T")[0],
        checkoutDate: data.checkoutDate 
          ? data.checkoutDate.toISOString().split("T")[0] 
          : null,
      };
      
      const response = await api.updateStudent(parseInt(id), studentData);
      
      if (response.success) {
        toast({
          title: "Success",
          description: "Student updated successfully",
        });
        navigate("/students");
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to update student",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating student:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <h1 className="page-title">Edit Student</h1>
        <div className="h-96 rounded-lg bg-gray-100 animate-pulse" />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="page-container">
        <h1 className="page-title">Edit Student</h1>
        <div className="text-center p-10 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Student not found</h3>
          <p className="text-gray-500">The student you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Edit Student</h1>
      <StudentForm 
        student={student} 
        onSubmit={handleSubmit} 
        isSubmitting={isSubmitting} 
      />
    </div>
  );
};

export default StudentEdit;
