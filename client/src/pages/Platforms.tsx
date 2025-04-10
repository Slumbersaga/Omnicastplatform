import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Platform } from "@/types";
import { Check, ExternalLink, RefreshCw } from "lucide-react";
import { getPlatformIcon } from "@/lib/platformIcons";
import { useToast } from "@/hooks/use-toast";
import { PLATFORM_NAMES } from "@/lib/constants";

export default function Platforms() {
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
  });

  const handleConnect = (platform: string) => {
    connectMutation.mutate(platform);
  };

  const handleDisconnect = (platform: string) => {
    disconnectMutation.mutate(platform);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Platform Connections</h1>
        <div className="animate-pulse space-y-4">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="h-40 bg-gray-100 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Platform Connections</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {platforms?.map((platform: Platform) => {
          const platformInfo = getPlatformIcon(platform.platformName);
          const platformName = PLATFORM_NAMES[platform.platformName] || platform.platformName;
          
          return (
            <Card key={platform.id}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-3 ${platformInfo.bgColor}`}>
                    {platformInfo.icon}
                  </div>
                  <div>
                    <CardTitle className="capitalize">{platformName}</CardTitle>
                    {platform.isConnected && (
                      <CardDescription>
                        Connected as {platform.platformUsername || "Unknown"}
                      </CardDescription>
                    )}
                  </div>
                </div>
                {platform.isConnected && (
                  <div className="flex items-center text-sm text-green-600">
                    <Check className="h-4 w-4 mr-1" />
                    Connected
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  {platform.isConnected
                    ? `Your ${platformName} account is connected and ready to receive uploads.`
                    : `Connect your ${platformName} account to upload videos directly.`}
                </p>
                <div className="flex space-x-3">
                  {platform.isConnected ? (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDisconnect(platform.platformName)}
                        disabled={disconnectMutation.isPending}
                      >
                        Disconnect
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex items-center"
                      >
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Refresh Token
                      </Button>
                      {platform.platformVideoUrl && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex items-center"
                          onClick={() => window.open(platform.platformVideoUrl, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          View Account
                        </Button>
                      )}
                    </>
                  ) : (
                    <Button
                      onClick={() => handleConnect(platform.platformName)}
                      disabled={connectMutation.isPending}
                    >
                      Connect {platformName}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
