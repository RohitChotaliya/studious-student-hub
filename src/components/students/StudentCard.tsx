
import React from "react";
import { MoreVertical, Check, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Student } from "@/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StudentCardProps {
  student: Student;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const StudentCard: React.FC<StudentCardProps> = ({
  student,
  onEdit,
  onDelete,
}) => {
  return (
    <div className={cn(
      "student-card", 
      student.isOverdue && "overdue"
    )}>
      {student.isOverdue && (
        <div className="absolute top-0 right-0 px-2 py-1 bg-student-error text-white text-xs rounded-bl-md">
          Payment Overdue
        </div>
      )}
      
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold">
          {student.firstName} {student.lastName}
        </h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(student.id)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(student.id)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Mobile:</span>
          <span>{student.mobileNumber}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Father's Mobile:</span>
          <span>{student.fatherMobileNumber}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Pocket Money:</span>
          <span>₹{student.pocketMoney}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Joined:</span>
          <span>{format(new Date(student.addDate), "MMM dd, yyyy")}</span>
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-between">
        <Badge 
          variant={student.status === "active" ? "default" : "secondary"}
          className={student.status === "active" ? "bg-student-success" : ""}
        >
          {student.status === "active" ? (
            <>
              <Check className="h-3 w-3 mr-1" /> Active
            </>
          ) : (
            "Inactive"
          )}
        </Badge>
        
        <span className="text-xs text-gray-500">
          ID: {student.id}
        </span>
      </div>
    </div>
  );
};

export default StudentCard;
