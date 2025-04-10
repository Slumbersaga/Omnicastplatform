import { useEffect } from "react";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useUpload } from "@/hooks/useUpload";
import { getPlatformIcon } from "@/lib/platformIcons";
import { useToast } from "@/hooks/use-toast";

interface UploadProgressProps {
  uploadId: number;
  onCancel: () => void;
}

export default function UploadProgress({ uploadId, onCancel }: UploadProgressProps) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { uploadProgress, startPolling, stopPolling } = useUpload(uploadId);

  useEffect(() => {
    startPolling();
    return () => stopPolling();
  }, [startPolling, stopPolling]);

  useEffect(() => {
    if (uploadProgress?.overallProgress === 100) {
      toast({
        title: "Upload Complete",
        description: "Your video has been successfully published to all platforms!",
      });
    }
  }, [uploadProgress?.overallProgress, toast]);

  const getProgressStatus = (progress: number) => {
    if (progress < 33) return "Preparing...";
    if (progress < 66) return "Uploading...";
    if (progress < 100) return "Processing...";
    return "Published";
  };

  if (!uploadProgress) {
    return (
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Upload Progress</h2>
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded-full"></div>
            <div className="space-y-4">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-12 bg-gray-100 rounded-lg"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Upload Progress</h2>
        
        {/* Overall Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Overall Progress</span>
            <span className="text-sm font-medium text-gray-700">{uploadProgress.overallProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-primary-600 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${uploadProgress.overallProgress}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-gray-500">Processing video...</span>
            {uploadProgress.overallProgress >= 100 ? (
              <span className="text-xs text-green-600">Complete!</span>
            ) : (
              <button 
                className="text-xs text-red-600 hover:text-red-700"
                onClick={onCancel}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
        
        {/* Platform Progress */}
        <div className="space-y-4">
          {uploadProgress.platforms.map((platform) => {
            const platformIcon = getPlatformIcon(platform.platformId.toString());
            return (
              <div key={platform.id}>
                <div className="flex items-center mb-2">
                  <div className="h-5 w-5 mr-2">{platformIcon.icon}</div>
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {platformIcon.name || "Platform"}
                  </span>
                  <span className="ml-auto text-sm font-medium text-gray-700">
                    {platform.uploadProgress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${platformIcon.progressColor}`}
                    style={{ width: `${platform.uploadProgress}%` }}
                  ></div>
                </div>
                <div className="mt-1">
                  {platform.uploadProgress < 100 ? (
                    <span className="text-xs text-gray-500">
                      {getProgressStatus(platform.uploadProgress)}
                    </span>
                  ) : (
                    <span className="text-xs text-green-600">Published</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 flex flex-col sm:flex-row sm:justify-between">
          {uploadProgress.overallProgress < 100 ? (
            <Button 
              variant="outline" 
              className="mb-3 sm:mb-0"
              onClick={onCancel}
            >
              Cancel
            </Button>
          ) : (
            <Button 
              onClick={() => setLocation("/")}
              className="inline-flex items-center px-4 py-2"
            >
              Back to Dashboard
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
