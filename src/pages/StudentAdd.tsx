
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { api } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import StudentForm from "@/components/students/StudentForm";

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

const StudentAdd = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      
      // Convert the date objects to strings and ensure all required fields are provided
      const studentData = {
        firstName: data.firstName,
        lastName: data.lastName,
        mobileNumber: data.mobileNumber,
        fatherMobileNumber: data.fatherMobileNumber,
        adharCard: data.adharCard,
        pocketMoney: data.pocketMoney,
        addDate: data.addDate.toISOString().split("T")[0],
        status: data.status,
        checkoutDate: data.checkoutDate 
          ? data.checkoutDate.toISOString().split("T")[0] 
          : null,
      };
      
      const response = await api.addStudent(studentData);
      
      if (response.success) {
        toast({
          title: "Success",
          description: "Student added successfully",
        });
        navigate("/students");
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to add student",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error adding student:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Add New Student</h1>
      <StudentForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
};

export default StudentAdd;
