import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDropzone } from "react-dropzone";
import { 
  Card, 
  CardContent
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { UploadCloud } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Platform } from "@/types";
import { PlatformCheckbox } from "./PlatformCheckbox";
import PlatformSettings from "./PlatformSettings";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  tags: z.string().optional(),
  visibility: z.enum(["public", "unlisted", "private"]),
});

type FormData = z.infer<typeof formSchema>;

interface UploadFormProps {
  onUploadStart: (uploadId: number) => void;
}

export default function UploadForm({ onUploadStart }: UploadFormProps) {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<{[key: string]: boolean}>({});
  const [platformSettings, setPlatformSettings] = useState<{[key: string]: any}>({});
  const [currentPlatformSettings, setCurrentPlatformSettings] = useState<string | null>(null);

  const { data: platforms, isLoading: platformsLoading } = useQuery({
    queryKey: ['/api/platforms'],
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      tags: "",
      visibility: "public",
    },
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'video/*': ['.mp4', '.mov', '.avi', '.wmv', '.flv', '.mkv']
    },
    maxSize: 2 * 1024 * 1024 * 1024, // 2GB
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
      }
    },
    onDropRejected: (rejections) => {
      const error = rejections[0]?.errors[0]?.message || "File upload failed";
      toast({
        title: "Upload Error",
        description: error,
        variant: "destructive",
      });
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (data: FormData & { file: File, platforms: any[] }) => {
      const formData = new FormData();
      formData.append("video", data.file);
      formData.append("title", data.title);
      
      if (data.description) formData.append("description", data.description);
      if (data.tags) formData.append("tags", data.tags);
      
      formData.append("visibility", data.visibility);
      formData.append("platforms", JSON.stringify(data.platforms));
      
      const response = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || response.statusText);
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/uploads'] });
      toast({
        title: "Upload Started",
        description: "Your video is now being processed and uploaded to selected platforms.",
      });
      onUploadStart(data.id);
    },
    onError: (error) => {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    if (!file) {
      toast({
        title: "No Video Selected",
        description: "Please select a video file to upload.",
        variant: "destructive",
      });
      return;
    }

    const selectedPlatformsList = Object.entries(selectedPlatforms)
      .filter(([_, isSelected]) => isSelected)
      .map(([platformId]) => {
        const id = parseInt(platformId);
        return {
          platformId: id,
          platformSettings: platformSettings[platformId] || {}
        };
      });

    if (selectedPlatformsList.length === 0) {
      toast({
        title: "No Platforms Selected",
        description: "Please select at least one platform to upload to.",
        variant: "destructive",
      });
      return;
    }

    uploadMutation.mutate({
      ...data,
      file,
      platforms: selectedPlatformsList,
    });
  };

  const handlePlatformChange = (platformId: string, isSelected: boolean) => {
    setSelectedPlatforms(prev => ({
      ...prev,
      [platformId]: isSelected
    }));
  };

  const handleOpenSettings = (platformId: string) => {
    setCurrentPlatformSettings(platformId);
  };

  const handleSaveSettings = (platformId: string, settings: any) => {
    setPlatformSettings(prev => ({
      ...prev,
      [platformId]: settings
    }));
    setCurrentPlatformSettings(null);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardContent className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 mb-4">1. Select Video File</h2>
              <div 
                {...getRootProps()} 
                className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                  isDragActive 
                    ? "border-primary-500 bg-primary-50" 
                    : file 
                      ? "border-green-500 bg-green-50" 
                      : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                <input {...getInputProps()} />
                {file ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center">
                      <svg className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                    <button 
                      type="button" 
                      className="text-xs text-primary-600 hover:text-primary-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                      }}
                    >
                      Change file
                    </button>
                  </div>
                ) : (
                  <>
                    <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4 text-sm text-gray-600">
                      <span className="font-medium text-primary-600 hover:text-primary-500">
                        Upload a file
                      </span>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">MP4, MOV, AVI up to 2GB</p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 mb-4">2. Video Details</h2>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter video title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter video description" 
                          rows={4} 
                          {...field} 
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags (comma separated)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="tag1, tag2, tag3" 
                          {...field} 
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="visibility"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Visibility</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select visibility" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="unlisted">Unlisted</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 mb-4">3. Select Platforms</h2>
              
              {platformsLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Array(4).fill(0).map((_, i) => (
                    <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-lg"></div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {platforms?.map((platform: Platform) => (
                    <PlatformCheckbox
                      key={platform.id}
                      platform={platform}
                      selected={!!selectedPlatforms[platform.id]}
                      onToggle={(selected) => handlePlatformChange(platform.id.toString(), selected)}
                      onOpenSettings={() => handleOpenSettings(platform.id.toString())}
                    />
                  ))}
                </div>
              )}
            </CardContent>
            <div className="p-6 flex justify-end">
              <Button 
                type="submit" 
                disabled={uploadMutation.isPending}
                className="inline-flex items-center px-4 py-2"
              >
                {uploadMutation.isPending ? "Processing..." : "Start Upload"}
              </Button>
            </div>
          </Card>
        </form>
      </Form>

      {currentPlatformSettings && (
        <PlatformSettings
          platformId={currentPlatformSettings}
          initialSettings={platformSettings[currentPlatformSettings] || {}}
          onSave={(settings) => handleSaveSettings(currentPlatformSettings, settings)}
          onCancel={() => setCurrentPlatformSettings(null)}
        />
      )}
    </>
  );
}
