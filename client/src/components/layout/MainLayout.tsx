import { useState } from "react";
import Sidebar from "./Sidebar";
import MobileNavigation from "./MobileNavigation";
import { useMobile } from "@/hooks/use-mobile";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useMobile();

  return (
    <div className="min-h-screen flex flex-col">
      <MobileNavigation onOpenSidebar={() => setSidebarOpen(true)} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar open={!isMobile || sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 overflow-y-auto px-4 lg:px-8 py-6 pb-16 lg:pb-6">
          {children}
        </main>
      </div>
    </div>
  );
}
