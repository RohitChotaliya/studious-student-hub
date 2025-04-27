
import React, { useEffect, useState } from "react";
import { Users, UserCheck, UserX, Wallet } from "lucide-react";
import { api } from "@/services/api";
import { DashboardStats } from "@/types";
import StatCard from "@/components/dashboard/StatCard";
import RevenueChart from "@/components/dashboard/RevenueChart";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await api.getDashboardStats();
        if (response.success) {
          setStats(response.data);
        } else {
          toast({
            title: "Error",
            description: "Failed to load dashboard data",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [toast]);

  return (
    <div className="page-container">
      <h1 className="page-title">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {loading ? (
          // Loading skeletons for stat cards
          Array(4)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="h-32 rounded-lg bg-gray-100 animate-pulse" />
            ))
        ) : (
          // Actual stat cards
          <>
            <StatCard
              title="Total Students"
              value={stats?.totalStudents ?? 0}
              icon={<Users className="text-student" />}
            />
            <StatCard
              title="Active Students"
              value={stats?.activeStudents ?? 0}
              icon={<UserCheck className="text-student-success" />}
            />
            <StatCard
              title="Inactive Students"
              value={stats?.inactiveStudents ?? 0}
              icon={<UserX className="text-student-error" />}
            />
            <StatCard
              title="Total Collections"
              value={`₹${stats?.totalPaymentsCollected?.toLocaleString() ?? 0}`}
              icon={<Wallet className="text-student-accent" />}
            />
          </>
        )}
      </div>

      <div className="h-80">
        {loading ? (
          <div className="h-full rounded-lg bg-gray-100 animate-pulse" />
        ) : (
          <RevenueChart data={stats?.monthlyData ?? []} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
