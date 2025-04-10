import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Upload, 
  Clock, 
  BarChart2, 
  Settings, 
  LogOut, 
  X 
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useMobile } from "@/hooks/use-mobile";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const [location] = useLocation();
  const isMobile = useMobile();
  const { data: user } = useQuery({
    queryKey: ['/api/user'],
  });

  // Close sidebar on route change for mobile
  useEffect(() => {
    if (isMobile && open) {
      onClose();
    }
  }, [location, isMobile, open, onClose]);

  const navItems = [
    { path: "/", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5 mr-3" /> },
    { path: "/upload", label: "Upload", icon: <Upload className="h-5 w-5 mr-3" /> },
    { path: "/history", label: "History", icon: <Clock className="h-5 w-5 mr-3" /> },
    { path: "/analytics", label: "Analytics", icon: <BarChart2 className="h-5 w-5 mr-3" /> },
    { path: "/platforms", label: "Platforms", icon: <Settings className="h-5 w-5 mr-3" /> }
  ];

  const sidebarClass = `fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg lg:relative lg:inset-auto lg:translate-x-0 transition-transform duration-300 ease-in-out ${
    open ? "translate-x-0" : "-translate-x-full"
  }`;

  return (
    <div className={sidebarClass}>
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="px-4 py-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center">
            <svg
              className="h-8 w-8 text-primary-600"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"
                fill="currentColor"
              />
            </svg>
            <span className="ml-2 text-xl font-bold text-primary-600">OmniCast</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-gray-500 focus:outline-none"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-2 overflow-y-auto">
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <Button
                  variant={location === item.path ? "secondary" : "ghost"}
                  className={`w-full flex items-center justify-start px-4 py-3 text-left rounded-lg ${
                    location === item.path
                      ? "bg-primary-50 text-primary-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="px-4 py-2 border-t border-gray-200">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user?.username || "User"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-primary-100 text-primary-600 font-medium">
                  {user?.username?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">
                {user?.username || "Loading..."}
              </p>
              <p className="text-xs font-medium text-gray-500">
                {user?.email || ""}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            className="mt-3 w-full flex items-center justify-center px-4 py-2 text-sm font-medium"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
