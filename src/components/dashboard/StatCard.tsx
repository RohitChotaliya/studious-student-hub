
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  className?: string;
  valueClassName?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  className,
  valueClassName,
}) => {
  return (
    <Card className={cn("h-full", className)}>
      <CardContent className="flex items-center p-6">
        <div className="mr-4 p-2 rounded-full bg-gray-100">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className={cn("text-2xl font-bold mt-1", valueClassName)}>
            {value}
          </h3>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
