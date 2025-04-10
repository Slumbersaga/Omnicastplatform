import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import express from "express";
import multer from "multer";
import path from "path";
import { z } from "zod";
import { insertUploadSchema, insertUploadPlatformSchema } from "@shared/schema";
import fs from "fs";

// Create uploads directory if it doesn't exist
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage2 = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage2,
  limits: {
    fileSize: 2 * 1024 * 1024 * 1024, // 2GB limit
  },
  fileFilter: (req, file, cb) => {
    const filetypes = /mp4|mov|avi|wmv|flv|mkv/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("File upload only supports video formats"));
  },
});

// Mock user ID for demo purposes (normally would come from auth system)
const MOCK_USER_ID = 1;

export async function registerRoutes(app: Express): Promise<Server> {
  // Middleware to parse JSON bodies
  app.use(express.json());
  
  // API routes
  app.get('/api/user', async (req: Request, res: Response) => {
    try {
      const user = await storage.getUser(MOCK_USER_ID);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Remove sensitive info
      const { password, ...userInfo } = user;
      res.json(userInfo);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch user', error: (error as Error).message });
    }
  });
  
  // Get connected platforms
  app.get('/api/platforms', async (req: Request, res: Response) => {
    try {
      const platforms = await storage.getPlatformsByUserId(MOCK_USER_ID);
      res.json(platforms);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch platforms', error: (error as Error).message });
    }
  });
  
  // Update platform connection status
  app.patch('/api/platforms/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const platform = await storage.getPlatform(id);
      
      if (!platform) {
        return res.status(404).json({ message: 'Platform not found' });
      }
      
      if (platform.userId !== MOCK_USER_ID) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
      
      const updatedPlatform = await storage.updatePlatform(id, {
        ...req.body,
        userId: MOCK_USER_ID // Ensure we don't change the user ID
      });
      
      res.json(updatedPlatform);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update platform', error: (error as Error).message });
    }
  });
  
  // Connect platform (simulated OAuth)
  app.post('/api/platforms/:platform/connect', async (req: Request, res: Response) => {
    try {
      const { platform } = req.params;
      const platforms = await storage.getPlatformsByUserId(MOCK_USER_ID);
      const existingPlatform = platforms.find(p => p.platformName === platform);
      
      if (existingPlatform) {
        const updated = await storage.updatePlatform(existingPlatform.id, {
          isConnected: true,
          accessToken: 'mock_token',
          refreshToken: 'mock_refresh',
          tokenExpiry: new Date(Date.now() + 3600000),
          platformUserId: `${platform}_user_${Math.floor(Math.random() * 1000)}`,
          platformUsername: `Demo ${platform.charAt(0).toUpperCase() + platform.slice(1)} Account`
        });
        return res.json(updated);
      }
      
      // Create new platform connection
      const newPlatform = await storage.createPlatform({
        userId: MOCK_USER_ID,
        platformName: platform,
        isConnected: true,
        accessToken: 'mock_token',
        refreshToken: 'mock_refresh',
        tokenExpiry: new Date(Date.now() + 3600000),
        platformUserId: `${platform}_user_${Math.floor(Math.random() * 1000)}`,
        platformUsername: `Demo ${platform.charAt(0).toUpperCase() + platform.slice(1)} Account`,
        additionalData: {}
      });
      
      res.status(201).json(newPlatform);
    } catch (error) {
      res.status(500).json({ message: 'Failed to connect platform', error: (error as Error).message });
    }
  });
  
  // Disconnect platform
  app.post('/api/platforms/:platform/disconnect', async (req: Request, res: Response) => {
    try {
      const { platform } = req.params;
      const platforms = await storage.getPlatformsByUserId(MOCK_USER_ID);
      const existingPlatform = platforms.find(p => p.platformName === platform);
      
      if (!existingPlatform) {
        return res.status(404).json({ message: 'Platform not found' });
      }
      
      const updated = await storage.updatePlatform(existingPlatform.id, {
        isConnected: false,
        accessToken: null,
        refreshToken: null,
        tokenExpiry: null
      });
      
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: 'Failed to disconnect platform', error: (error as Error).message });
    }
  });
  
  // Get recent uploads
  app.get('/api/uploads', async (req: Request, res: Response) => {
    try {
      const uploads = await storage.getUploadsByUserId(MOCK_USER_ID);
      
      // For each upload, fetch its platform statuses
      const uploadsWithPlatforms = await Promise.all(
        uploads.map(async (upload) => {
          const platforms = await storage.getUploadPlatformsByUploadId(upload.id);
          return {
            ...upload,
            platforms
          };
        })
      );
      
      res.json(uploadsWithPlatforms);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch uploads', error: (error as Error).message });
    }
  });
  
  // Get a specific upload
  app.get('/api/uploads/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const upload = await storage.getUpload(id);
      
      if (!upload) {
        return res.status(404).json({ message: 'Upload not found' });
      }
      
      if (upload.userId !== MOCK_USER_ID) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
      
      const platforms = await storage.getUploadPlatformsByUploadId(id);
      
      res.json({
        ...upload,
        platforms
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch upload', error: (error as Error).message });
    }
  });
  
  // Handle video upload
  app.post('/api/uploads', upload.single('video'), async (req: Request, res: Response) => {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ message: 'No video file provided' });
      }
      
      // Validate the request body
      const validationSchema = z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        tags: z.string().optional(),
        visibility: z.enum(['public', 'unlisted', 'private']).default('public'),
        platforms: z.array(
          z.object({
            platformId: z.number(),
            platformSettings: z.record(z.any()).optional()
          })
        )
      });
      
      const validatedData = validationSchema.parse(req.body);
      
      // Create the upload
      const newUpload = await storage.createUpload({
        userId: MOCK_USER_ID,
        title: validatedData.title,
        description: validatedData.description || "",
        tags: validatedData.tags || "",
        fileName: file.filename,
        fileSize: file.size,
        duration: 0, // We'd normally extract this from the video
        thumbnailUrl: "", // We'd normally generate a thumbnail
        visibility: validatedData.visibility
      });
      
      // Create upload platform entries for each selected platform
      const uploadPlatforms = await Promise.all(
        validatedData.platforms.map(async (platform) => {
          return storage.createUploadPlatform({
            uploadId: newUpload.id,
            platformId: platform.platformId,
            status: 'uploading',
            uploadProgress: 0,
            platformSettings: platform.platformSettings || {}
          });
        })
      );
      
      // Start processing the upload (in a real app, this would be a background job)
      processUpload(newUpload.id, validatedData.platforms);
      
      res.status(201).json({
        ...newUpload,
        platforms: uploadPlatforms
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ message: 'Failed to upload video', error: (error as Error).message });
    }
  });
  
  // Get upload progress
  app.get('/api/uploads/:id/progress', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const upload = await storage.getUpload(id);
      
      if (!upload) {
        return res.status(404).json({ message: 'Upload not found' });
      }
      
      if (upload.userId !== MOCK_USER_ID) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
      
      const platforms = await storage.getUploadPlatformsByUploadId(id);
      
      // Calculate overall progress
      let totalProgress = 0;
      if (platforms.length > 0) {
        totalProgress = platforms.reduce((sum, p) => sum + p.uploadProgress, 0) / platforms.length;
      }
      
      res.json({
        uploadId: id,
        overallProgress: Math.round(totalProgress),
        platforms
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch upload progress', error: (error as Error).message });
    }
  });
  
  // Update platform settings for an upload
  app.patch('/api/uploads/:uploadId/platforms/:platformId', async (req: Request, res: Response) => {
    try {
      const uploadId = parseInt(req.params.uploadId);
      const platformId = parseInt(req.params.platformId);
      
      // Find the upload platform entry
      const uploadPlatforms = await storage.getUploadPlatformsByUploadId(uploadId);
      const targetPlatform = uploadPlatforms.find(up => up.platformId === platformId);
      
      if (!targetPlatform) {
        return res.status(404).json({ message: 'Upload platform not found' });
      }
      
      // Verify ownership
      const upload = await storage.getUpload(uploadId);
      if (!upload || upload.userId !== MOCK_USER_ID) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
      
      // Update the platform settings
      const updated = await storage.updateUploadPlatform(targetPlatform.id, {
        platformSettings: req.body.platformSettings
      });
      
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update platform settings', error: (error as Error).message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Simulated upload processing function
async function processUpload(uploadId: number, platforms: any[]) {
  try {
    const uploadPlatforms = await storage.getUploadPlatformsByUploadId(uploadId);
    
    // Simulate progress updates for each platform
    for (const platform of uploadPlatforms) {
      simulatePlatformProgress(platform.id);
    }
  } catch (error) {
    console.error('Error processing upload:', error);
  }
}

// Simulate platform upload progress
async function simulatePlatformProgress(uploadPlatformId: number) {
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  let progress = 0;
  
  try {
    // Get random speed for this platform (between 1-3% per tick)
    const speed = Math.random() * 2 + 1;
    
    // Simulate uploading phase (0-60%)
    while (progress < 60) {
      progress += speed;
      if (progress > 60) progress = 60;
      
      await storage.updateUploadPlatform(uploadPlatformId, {
        uploadProgress: Math.round(progress),
        status: 'uploading'
      });
      
      await delay(500); // Update every 500ms
    }
    
    // Simulate processing phase (60-99%)
    while (progress < 99) {
      progress += speed / 2; // Processing is slower
      if (progress > 99) progress = 99;
      
      await storage.updateUploadPlatform(uploadPlatformId, {
        uploadProgress: Math.round(progress),
        status: 'processing'
      });
      
      await delay(800); // Processing updates are slower
    }
    
    // Finish the upload
    const platform = await storage.getUploadPlatform(uploadPlatformId);
    const platformName = platform ? platform.platformId.toString() : 'unknown';
    
    await storage.updateUploadPlatform(uploadPlatformId, {
      uploadProgress: 100,
      status: 'completed',
      platformVideoId: `${platformName}_${Date.now()}`,
      platformVideoUrl: `https://example.com/${platformName}/${Date.now()}`,
      completedAt: new Date()
    });
  } catch (error) {
    console.error(`Error simulating progress for platform ${uploadPlatformId}:`, error);
    
    // Mark as failed
    await storage.updateUploadPlatform(uploadPlatformId, {
      status: 'failed',
      errorMessage: (error as Error).message
    });
  }
}
