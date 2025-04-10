import { useState, useCallback, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface UploadProgress {
  uploadId: number;
  overallProgress: number;
  platforms: any[];
}

export function useUpload(uploadId: number) {
  const queryClient = useQueryClient();
  const [interval, setPollingInterval] = useState<number>(1000); // Start at 1 second
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const { data: uploadProgress, isLoading, error } = useQuery<UploadProgress>({
    queryKey: [`/api/uploads/${uploadId}/progress`],
    refetchInterval: interval,
    enabled: !!uploadId,
  });
  
  // Adjust polling interval based on progress
  const adjustPollingInterval = useCallback(() => {
    if (uploadProgress) {
      if (uploadProgress.overallProgress >= 100) {
        // Stop polling when complete
        setPollingInterval(0);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      } else if (uploadProgress.overallProgress > 80) {
        // Slow down polling as we get closer to completion
        setPollingInterval(2000);
      } else {
        // Regular polling during active upload
        setPollingInterval(1000);
      }
    }
  }, [uploadProgress]);
  
  // Start polling for progress
  const startPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: [`/api/uploads/${uploadId}/progress`] });
      adjustPollingInterval();
    }, interval);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [uploadId, interval, queryClient, adjustPollingInterval]);
  
  // Stop polling
  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setPollingInterval(0);
  }, []);
  
  return {
    uploadProgress,
    isLoading,
    error,
    startPolling,
    stopPolling
  };
}
