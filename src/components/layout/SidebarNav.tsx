
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  Users, 
  UserPlus, 
  LogOut, 
  BarChart 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader, 
  SidebarTrigger 
} from "@/components/ui/sidebar";

const SidebarNav = () => {
  const location = useLocation();
  
  const navigationItems = [
    { path: "/", label: "Dashboard", icon: Home },
    { path: "/students", label: "Students", icon: Users },
    { path: "/students/add", label: "Add Student", icon: UserPlus },
    { path: "/checkout", label: "Checkout", icon: LogOut },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="p-4 flex flex-col items-center">
        <div className="w-10 h-10 bg-student flex items-center justify-center rounded-md text-white">
          <BarChart size={20} />
        </div>
        <h1 className="text-lg font-bold mt-2">Student Manager</h1>
        <SidebarTrigger />
      </SidebarHeader>
      
      <SidebarContent>
        <nav className="flex flex-col gap-1 px-2">
          {navigationItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                location.pathname === item.path
                  ? "bg-student text-white hover:bg-student-hover"
                  : "hover:bg-gray-100 text-gray-700"
              )}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <div className="text-xs text-gray-500 text-center">
          Student Management System
          <br />
          v1.0.0
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default SidebarNav;
