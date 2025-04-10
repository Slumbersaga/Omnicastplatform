import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Upload, Platform } from "@/types";
import { useLocation } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { getPlatformIcon } from "@/lib/platformIcons";

export default function RecentUploads() {
  const [, setLocation] = useLocation();
  const { data: uploads = [], isLoading: uploadsLoading } = useQuery<Upload[]>({
    queryKey: ['/api/uploads'],
  });
  
  const { data: platforms = [], isLoading: platformsLoading } = useQuery<Platform[]>({
    queryKey: ['/api/platforms'],
  });
  
  const isLoading = uploadsLoading || platformsLoading;

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Uploads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-lg"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Uploads</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Video</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Platforms</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {uploads?.map((upload: Upload) => (
                <tr key={upload.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-16 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                        {upload.thumbnailUrl ? (
                          <img src={upload.thumbnailUrl} alt={upload.title} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full bg-gray-300 flex items-center justify-center text-gray-500 text-xs">No Thumbnail</div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{upload.title}</div>
                        <div className="text-sm text-gray-500">
                          {upload.duration ? formatDuration(upload.duration) : '--:--'} • {upload.visibility}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-1">
                      {upload.platforms?.map((platform) => {
                        // Get the platform name using the platforms API data
                        const platformData = platforms.find((p: Platform) => p.id === platform.platformId);
                        const platformInfo = getPlatformIcon(platformData?.platformName || 'unknown');
                        return (
                          <div key={platform.id} title={`${platform.status}`} className="w-5 h-5">
                            {platformInfo.icon}
                          </div>
                        );
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {upload.uploadedAt ? formatDistanceToNow(new Date(upload.uploadedAt), { addSuffix: true }) : 'Unknown'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                      Published
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Button variant="link" onClick={() => setLocation(`/uploads/${upload.id}`)}>
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-center">
          <Button variant="link" onClick={() => setLocation('/history')}>
            View All Uploads
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
