// Platform types
export interface Platform {
  id: number;
  userId: number;
  platformName: string;
  isConnected: boolean;
  accessToken?: string;
  refreshToken?: string;
  tokenExpiry?: Date;
  platformUserId?: string;
  platformUsername?: string;
  additionalData?: any;
}

// Upload types
export interface Upload {
  id: number;
  userId: number;
  title: string;
  description?: string;
  tags?: string;
  fileName: string;
  fileSize: number;
  duration?: number;
  thumbnailUrl?: string;
  visibility: 'public' | 'unlisted' | 'private';
  uploadedAt: Date;
  platforms?: UploadPlatform[];
}

export interface UploadPlatform {
  id: number;
  uploadId: number;
  platformId: number;
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'failed';
  platformVideoId?: string;
  platformVideoUrl?: string;
  uploadProgress: number;
  errorMessage?: string;
  platformSettings?: any;
  completedAt?: Date;
}

// User type
export interface User {
  id: number;
  username: string;
  email: string;
  avatarUrl?: string;
}

// Form types
export interface UploadFormData {
  title: string;
  description?: string;
  tags?: string;
  visibility: 'public' | 'unlisted' | 'private';
  platforms: number[];
}

export interface PlatformSettingsData {
  [key: string]: any;
}
