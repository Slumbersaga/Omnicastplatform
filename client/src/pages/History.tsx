import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { getPlatformIcon } from "@/lib/platformIcons";
import { Upload } from "@/types";

export default function History() {
  const { data: uploads, isLoading } = useQuery({
    queryKey: ['/api/uploads'],
  });

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Upload History</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>All Uploads</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="h-16 bg-gray-100 rounded-lg"></div>
              ))}
            </div>
          ) : uploads && uploads.length > 0 ? (
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
                            const platformInfo = getPlatformIcon(platform.platformId.toString());
                            return (
                              <div key={platform.id} title={platform.status} className="w-5 h-5">
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
                        <Button variant="link">View</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No uploads found. Start sharing your videos!</p>
              <Button className="mt-4" onClick={() => window.location.href = '/upload'}>
                Upload Your First Video
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
