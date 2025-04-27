
import React, { useState } from "react";
import { Search, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { StudentFilters as FiltersType } from "@/types";

interface StudentFiltersProps {
  onFilterChange: (filters: FiltersType) => void;
}

const StudentFilters: React.FC<StudentFiltersProps> = ({ onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    applyFilters({ searchTerm: value });
  };

  const handleStatusChange = (value: "all" | "active" | "inactive") => {
    setStatus(value);
    applyFilters({ status: value });
  };

  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date);
    applyFilters({ 
      startDate: date ? format(date, "yyyy-MM-dd") : undefined 
    });
  };

  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date);
    applyFilters({ 
      endDate: date ? format(date, "yyyy-MM-dd") : undefined 
    });
  };

  const applyFilters = (partialFilters: Partial<FiltersType>) => {
    onFilterChange({
      searchTerm: partialFilters.searchTerm !== undefined ? partialFilters.searchTerm : searchTerm,
      status: partialFilters.status !== undefined ? partialFilters.status : status,
      startDate: partialFilters.startDate !== undefined 
        ? partialFilters.startDate 
        : startDate ? format(startDate, "yyyy-MM-dd") : undefined,
      endDate: partialFilters.endDate !== undefined 
        ? partialFilters.endDate 
        : endDate ? format(endDate, "yyyy-MM-dd") : undefined,
    });
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStatus("all");
    setStartDate(undefined);
    setEndDate(undefined);
    onFilterChange({});
  };

  return (
    <div className="space-y-4 md:space-y-0 md:flex md:flex-wrap md:items-center md:gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        <Input
          placeholder="Search by name or mobile..."
          value={searchTerm}
          onChange={handleSearch}
          className="pl-9"
        />
      </div>
      
      <Select value={status} onValueChange={(v) => handleStatusChange(v as any)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Students</SelectItem>
          <SelectItem value="active">Active Only</SelectItem>
          <SelectItem value="inactive">Inactive Only</SelectItem>
        </SelectContent>
      </Select>
      
      <div className="flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "justify-start text-left font-normal",
                !startDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? format(startDate, "MMM dd, yyyy") : <span>Start Date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={handleStartDateChange}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "justify-start text-left font-normal",
                !endDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate ? format(endDate, "MMM dd, yyyy") : <span>End Date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={handleEndDateChange}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <Button variant="ghost" onClick={resetFilters}>Reset</Button>
    </div>
  );
};

export default StudentFilters;
