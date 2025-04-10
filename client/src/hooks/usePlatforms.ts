import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { type Platform } from "@/types";

export function usePlatforms() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data: platforms, isLoading, error } = useQuery<Platform[]>({
    queryKey: ['/api/platforms'],
  });
  
  const connectPlatform = useMutation({
    mutationFn: async (platformName: string) => {
      const response = await apiRequest('POST', `/api/platforms/${platformName}/connect`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/platforms'] });
      toast({
        title: "Platform Connected",
        description: "You have successfully connected your platform.",
      });
    },
    onError: (error) => {
      toast({
        title: "Connection Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  const disconnectPlatform = useMutation({
    mutationFn: async (platformName: string) => {
      const response = await apiRequest('POST', `/api/platforms/${platformName}/disconnect`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/platforms'] });
      toast({
        title: "Platform Disconnected",
        description: "You have successfully disconnected your platform.",
      });
    },
    onError: (error) => {
      toast({
        title: "Disconnection Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  return {
    platforms,
    isLoading,
    error,
    connectPlatform: (platformName: string) => connectPlatform.mutate(platformName),
    disconnectPlatform: (platformName: string) => disconnectPlatform.mutate(platformName),
    isConnecting: connectPlatform.isPending,
    isDisconnecting: disconnectPlatform.isPending
  };
}
