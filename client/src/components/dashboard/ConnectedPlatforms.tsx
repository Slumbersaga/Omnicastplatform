import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { type Platform } from "@/types";
import { Check } from "lucide-react";
import { getPlatformIcon } from "@/lib/platformIcons";
import { useToast } from "@/hooks/use-toast";

export default function ConnectedPlatforms() {
  const { toast } = useToast();
  const { data: platforms, isLoading } = useQuery({
    queryKey: ['/api/platforms'],
  });

  const connectMutation = useMutation({
    mutationFn: async (platform: string) => {
      const response = await apiRequest('POST', `/api/platforms/${platform}/connect`);
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

  const disconnectMutation = useMutation({
    mutationFn: async (platform: string) => {
      const response = await apiRequest('POST', `/api/platforms/${platform}/disconnect`);
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

  const handleConnect = (platform: string) => {
    connectMutation.mutate(platform);
  };

  const handleDisconnect = (platform: string) => {
    disconnectMutation.mutate(platform);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Connected Platforms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-lg"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connected Platforms</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {platforms?.map((platform: Platform) => (
            <div key={platform.id} className="bg-white border rounded-lg p-4 flex items-center">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-3 ${getPlatformIcon(platform.platformName).bgColor}`}>
                {getPlatformIcon(platform.platformName).icon}
              </div>
              <div className="flex-1">
                <h3 className="font-medium capitalize">{platform.platformName}</h3>
                {platform.isConnected ? (
                  <div className="flex items-center text-sm text-green-600">
                    <Check className="h-4 w-4 mr-1" />
                    Connected
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">
                    Not connected
                  </div>
                )}
              </div>
              {platform.isConnected ? (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-sm text-gray-500 hover:text-gray-700"
                  onClick={() => handleDisconnect(platform.platformName)}
                  disabled={disconnectMutation.isPending}
                >
                  Disconnect
                </Button>
              ) : (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-sm text-primary-600 hover:text-primary-700"
                  onClick={() => handleConnect(platform.platformName)}
                  disabled={connectMutation.isPending}
                >
                  Connect
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
