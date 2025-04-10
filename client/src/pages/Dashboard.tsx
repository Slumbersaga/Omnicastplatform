import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import ConnectedPlatforms from "@/components/dashboard/ConnectedPlatforms";
import RecentUploads from "@/components/dashboard/RecentUploads";
import { Upload } from "lucide-react";

export default function Dashboard() {
  const [, setLocation] = useLocation();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Button
          onClick={() => setLocation("/upload")}
          className="mt-3 md:mt-0 inline-flex items-center px-4 py-2"
        >
          <Upload className="-ml-1 mr-2 h-5 w-5" />
          New Upload
        </Button>
      </div>

      <ConnectedPlatforms />
      <RecentUploads />
    </div>
  );
}
