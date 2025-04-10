import {
  users,
  platforms,
  uploads,
  uploadPlatforms,
  type User,
  type InsertUser,
  type Platform,
  type InsertPlatform,
  type Upload,
  type InsertUpload,
  type UploadPlatform,
  type InsertUploadPlatform
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Platform operations
  getPlatformsByUserId(userId: number): Promise<Platform[]>;
  getPlatform(id: number): Promise<Platform | undefined>;
  createPlatform(platform: InsertPlatform): Promise<Platform>;
  updatePlatform(id: number, platform: Partial<InsertPlatform>): Promise<Platform>;
  deletePlatform(id: number): Promise<boolean>;

  // Upload operations
  getUploadsByUserId(userId: number): Promise<Upload[]>;
  getUpload(id: number): Promise<Upload | undefined>;
  createUpload(upload: InsertUpload): Promise<Upload>;
  
  // UploadPlatform operations
  getUploadPlatformsByUploadId(uploadId: number): Promise<UploadPlatform[]>;
  getUploadPlatform(id: number): Promise<UploadPlatform | undefined>;
  createUploadPlatform(uploadPlatform: InsertUploadPlatform): Promise<UploadPlatform>;
  updateUploadPlatform(id: number, uploadPlatform: Partial<InsertUploadPlatform>): Promise<UploadPlatform>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private platforms: Map<number, Platform>;
  private uploads: Map<number, Upload>;
  private uploadPlatforms: Map<number, UploadPlatform>;
  private userIdCounter: number;
  private platformIdCounter: number;
  private uploadIdCounter: number;
  private uploadPlatformIdCounter: number;

  constructor() {
    this.users = new Map();
    this.platforms = new Map();
    this.uploads = new Map();
    this.uploadPlatforms = new Map();
    this.userIdCounter = 1;
    this.platformIdCounter = 1;
    this.uploadIdCounter = 1;
    this.uploadPlatformIdCounter = 1;
    
    // Initialize with a test user
    this.createUser({
      username: "demouser",
      password: "password123",
      email: "demo@example.com",
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    }).then(user => {
      // Add some initial demo platforms
      this.createPlatform({
        userId: user.id,
        platformName: "youtube",
        isConnected: true,
        accessToken: "dummy_token",
        refreshToken: "dummy_refresh",
        tokenExpiry: new Date(Date.now() + 3600000),
        platformUserId: "youtube_user_123",
        platformUsername: "Demo Channel",
        additionalData: {}
      });
      
      this.createPlatform({
        userId: user.id,
        platformName: "facebook",
        isConnected: true,
        accessToken: "dummy_token",
        refreshToken: "dummy_refresh",
        tokenExpiry: new Date(Date.now() + 3600000),
        platformUserId: "facebook_user_123",
        platformUsername: "Demo Page",
        additionalData: {}
      });
      
      this.createPlatform({
        userId: user.id,
        platformName: "twitter",
        isConnected: false,
        platformUserId: "",
        platformUsername: "",
        additionalData: {}
      });
      
      this.createPlatform({
        userId: user.id,
        platformName: "instagram",
        isConnected: true,
        accessToken: "dummy_token",
        refreshToken: "dummy_refresh",
        tokenExpiry: new Date(Date.now() + 3600000),
        platformUserId: "instagram_user_123",
        platformUsername: "demogram",
        additionalData: {}
      });
      
      // Add some demo uploads
      this.createUpload({
        userId: user.id,
        title: "How to Use OmniCast Platform",
        description: "A complete tutorial on using the OmniCast platform for multi-platform uploads",
        tags: "tutorial,omnicast,howto",
        fileName: "omnicast-tutorial.mp4",
        fileSize: 24500000,
        duration: 154,
        thumbnailUrl: "https://images.unsplash.com/photo-1526328828355-69b01701ca6a?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&h=80&q=80",
        visibility: "public"
      }).then(upload => {
        // Add platform status for this upload
        this.getPlatformsByUserId(user.id).then(platforms => {
          const ytPlatform = platforms.find(p => p.platformName === "youtube");
          const fbPlatform = platforms.find(p => p.platformName === "facebook");
          
          if (ytPlatform) {
            this.createUploadPlatform({
              uploadId: upload.id,
              platformId: ytPlatform.id,
              status: "completed",
              platformVideoId: "yt123456789",
              platformVideoUrl: "https://youtube.com/watch?v=yt123456789",
              uploadProgress: 100,
              platformSettings: { playlist: "Tutorials" }
            });
          }
          
          if (fbPlatform) {
            this.createUploadPlatform({
              uploadId: upload.id,
              platformId: fbPlatform.id,
              status: "completed",
              platformVideoId: "fb987654321",
              platformVideoUrl: "https://facebook.com/watch?v=fb987654321",
              uploadProgress: 100,
              platformSettings: { postAs: "Page" }
            });
          }
        });
      });
      
      this.createUpload({
        userId: user.id,
        title: "Product Announcement - Summer 2023",
        description: "Exciting new features coming this summer!",
        tags: "product,announcement,summer",
        fileName: "summer-announcement.mp4",
        fileSize: 35200000,
        duration: 312,
        thumbnailUrl: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&h=80&q=80",
        visibility: "public"
      }).then(upload => {
        // Add platform status for this upload
        this.getPlatformsByUserId(user.id).then(platforms => {
          const ytPlatform = platforms.find(p => p.platformName === "youtube");
          const fbPlatform = platforms.find(p => p.platformName === "facebook");
          const igPlatform = platforms.find(p => p.platformName === "instagram");
          
          if (ytPlatform) {
            this.createUploadPlatform({
              uploadId: upload.id,
              platformId: ytPlatform.id,
              status: "completed",
              platformVideoId: "yt567890123",
              platformVideoUrl: "https://youtube.com/watch?v=yt567890123",
              uploadProgress: 100,
              platformSettings: { playlist: "Announcements" }
            });
          }
          
          if (fbPlatform) {
            this.createUploadPlatform({
              uploadId: upload.id,
              platformId: fbPlatform.id,
              status: "completed",
              platformVideoId: "fb234567890",
              platformVideoUrl: "https://facebook.com/watch?v=fb234567890",
              uploadProgress: 100,
              platformSettings: { postAs: "Page" }
            });
          }
          
          if (igPlatform) {
            this.createUploadPlatform({
              uploadId: upload.id,
              platformId: igPlatform.id,
              status: "completed",
              platformVideoId: "ig345678901",
              platformVideoUrl: "https://instagram.com/p/ig345678901",
              uploadProgress: 100,
              platformSettings: { shareToStories: true }
            });
          }
        });
      });
      
      this.createUpload({
        userId: user.id,
        title: "Weekly Team Update - May 29",
        description: "Internal update for the team",
        tags: "internal,update,team",
        fileName: "team-update-may29.mp4",
        fileSize: 89400000,
        duration: 585,
        thumbnailUrl: "https://images.unsplash.com/photo-1576585269693-6c7136aa7373?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&h=80&q=80",
        visibility: "private"
      }).then(upload => {
        // Add platform status for this upload
        this.getPlatformsByUserId(user.id).then(platforms => {
          const ytPlatform = platforms.find(p => p.platformName === "youtube");
          
          if (ytPlatform) {
            this.createUploadPlatform({
              uploadId: upload.id,
              platformId: ytPlatform.id,
              status: "completed",
              platformVideoId: "yt678901234",
              platformVideoUrl: "https://youtube.com/watch?v=yt678901234",
              uploadProgress: 100,
              platformSettings: { visibility: "private" }
            });
          }
        });
      });
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const createdAt = new Date();
    const newUser: User = { ...user, id, createdAt };
    this.users.set(id, newUser);
    return newUser;
  }

  // Platform operations
  async getPlatformsByUserId(userId: number): Promise<Platform[]> {
    return Array.from(this.platforms.values()).filter(
      platform => platform.userId === userId
    );
  }

  async getPlatform(id: number): Promise<Platform | undefined> {
    return this.platforms.get(id);
  }

  async createPlatform(platform: InsertPlatform): Promise<Platform> {
    const id = this.platformIdCounter++;
    const newPlatform: Platform = { ...platform, id };
    this.platforms.set(id, newPlatform);
    return newPlatform;
  }

  async updatePlatform(id: number, platform: Partial<InsertPlatform>): Promise<Platform> {
    const existingPlatform = this.platforms.get(id);
    if (!existingPlatform) {
      throw new Error(`Platform with ID ${id} not found`);
    }
    
    const updatedPlatform = { ...existingPlatform, ...platform };
    this.platforms.set(id, updatedPlatform);
    return updatedPlatform;
  }

  async deletePlatform(id: number): Promise<boolean> {
    return this.platforms.delete(id);
  }

  // Upload operations
  async getUploadsByUserId(userId: number): Promise<Upload[]> {
    return Array.from(this.uploads.values())
      .filter(upload => upload.userId === userId)
      .sort((a, b) => {
        return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
      });
  }

  async getUpload(id: number): Promise<Upload | undefined> {
    return this.uploads.get(id);
  }

  async createUpload(upload: InsertUpload): Promise<Upload> {
    const id = this.uploadIdCounter++;
    const uploadedAt = new Date();
    const newUpload: Upload = { ...upload, id, uploadedAt };
    this.uploads.set(id, newUpload);
    return newUpload;
  }

  // UploadPlatform operations
  async getUploadPlatformsByUploadId(uploadId: number): Promise<UploadPlatform[]> {
    return Array.from(this.uploadPlatforms.values()).filter(
      uploadPlatform => uploadPlatform.uploadId === uploadId
    );
  }

  async getUploadPlatform(id: number): Promise<UploadPlatform | undefined> {
    return this.uploadPlatforms.get(id);
  }

  async createUploadPlatform(uploadPlatform: InsertUploadPlatform): Promise<UploadPlatform> {
    const id = this.uploadPlatformIdCounter++;
    const newUploadPlatform: UploadPlatform = { ...uploadPlatform, id, completedAt: null };
    this.uploadPlatforms.set(id, newUploadPlatform);
    return newUploadPlatform;
  }

  async updateUploadPlatform(id: number, uploadPlatform: Partial<InsertUploadPlatform>): Promise<UploadPlatform> {
    const existingUploadPlatform = this.uploadPlatforms.get(id);
    if (!existingUploadPlatform) {
      throw new Error(`UploadPlatform with ID ${id} not found`);
    }
    
    const updatedUploadPlatform = { ...existingUploadPlatform, ...uploadPlatform };
    
    // If status is completed and completedAt is not set, set it now
    if (uploadPlatform.status === 'completed' && !existingUploadPlatform.completedAt) {
      updatedUploadPlatform.completedAt = new Date();
    }
    
    this.uploadPlatforms.set(id, updatedUploadPlatform);
    return updatedUploadPlatform;
  }
}

export const storage = new MemStorage();
