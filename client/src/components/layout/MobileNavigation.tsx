import { useLocation } from "wouter";
import { LayoutDashboard, Upload, Clock, BarChart2, Menu } from "lucide-react";
import { Link } from "wouter";

interface MobileNavigationProps {
  onOpenSidebar: () => void;
}

export default function MobileNavigation({ onOpenSidebar }: MobileNavigationProps) {
  const [location] = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: <LayoutDashboard className="h-6 w-6" /> },
    { path: "/upload", label: "Upload", icon: <Upload className="h-6 w-6" /> },
    { path: "/history", label: "History", icon: <Clock className="h-6 w-6" /> },
    { path: "/analytics", label: "Analytics", icon: <BarChart2 className="h-6 w-6" /> },
  ];

  return (
    <>
      {/* Mobile Navigation Header */}
      <div className="lg:hidden bg-white shadow-sm py-4 px-6 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={onOpenSidebar}
            className="text-gray-500 focus:outline-none"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="ml-4 flex items-center">
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
        </div>
      </div>

      {/* Mobile Navigation Footer */}
      <div className="lg:hidden bg-white border-t border-gray-200 pt-2 pb-2 fixed bottom-0 left-0 right-0 z-10">
        <div className="flex justify-around">
          {navItems.map((item) => (
            <Link key={item.path} href={item.path}>
              <button
                className={`flex flex-col items-center py-2 px-4 ${
                  location === item.path ? "text-primary-600" : "text-gray-600"
                }`}
              >
                {item.icon}
                <span className="text-xs mt-1">{item.label}</span>
              </button>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
