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
import { eq, and, desc } from "drizzle-orm";
import { db } from "./db";

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

// Database storage implementation

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  // Platform operations
  async getPlatformsByUserId(userId: number): Promise<Platform[]> {
    return db.select().from(platforms).where(eq(platforms.userId, userId));
  }

  async getPlatform(id: number): Promise<Platform | undefined> {
    const [platform] = await db.select().from(platforms).where(eq(platforms.id, id));
    return platform || undefined;
  }

  async createPlatform(platform: InsertPlatform): Promise<Platform> {
    const [newPlatform] = await db.insert(platforms).values(platform).returning();
    return newPlatform;
  }

  async updatePlatform(id: number, platformUpdate: Partial<InsertPlatform>): Promise<Platform> {
    const [updatedPlatform] = await db
      .update(platforms)
      .set(platformUpdate)
      .where(eq(platforms.id, id))
      .returning();
    
    if (!updatedPlatform) {
      throw new Error(`Platform with ID ${id} not found`);
    }
    
    return updatedPlatform;
  }

  async deletePlatform(id: number): Promise<boolean> {
    const result = await db.delete(platforms).where(eq(platforms.id, id));
    return result.count > 0;
  }

  // Upload operations
  async getUploadsByUserId(userId: number): Promise<Upload[]> {
    return db
      .select()
      .from(uploads)
      .where(eq(uploads.userId, userId))
      .orderBy(uploads.uploadedAt);
  }

  async getUpload(id: number): Promise<Upload | undefined> {
    const [upload] = await db.select().from(uploads).where(eq(uploads.id, id));
    return upload || undefined;
  }

  async createUpload(upload: InsertUpload): Promise<Upload> {
    const [newUpload] = await db.insert(uploads).values(upload).returning();
    return newUpload;
  }

  // UploadPlatform operations
  async getUploadPlatformsByUploadId(uploadId: number): Promise<UploadPlatform[]> {
    return db
      .select()
      .from(uploadPlatforms)
      .where(eq(uploadPlatforms.uploadId, uploadId));
  }

  async getUploadPlatform(id: number): Promise<UploadPlatform | undefined> {
    const [uploadPlatform] = await db
      .select()
      .from(uploadPlatforms)
      .where(eq(uploadPlatforms.id, id));
    return uploadPlatform || undefined;
  }

  async createUploadPlatform(uploadPlatform: InsertUploadPlatform): Promise<UploadPlatform> {
    const [newUploadPlatform] = await db
      .insert(uploadPlatforms)
      .values(uploadPlatform)
      .returning();
    return newUploadPlatform;
  }

  async updateUploadPlatform(id: number, uploadPlatformUpdate: Partial<InsertUploadPlatform>): Promise<UploadPlatform> {
    // If status is completed, set completedAt to now
    if (uploadPlatformUpdate.status === 'completed') {
      uploadPlatformUpdate = { ...uploadPlatformUpdate, completedAt: new Date() };
    }
    
    const [updatedUploadPlatform] = await db
      .update(uploadPlatforms)
      .set(uploadPlatformUpdate)
      .where(eq(uploadPlatforms.id, id))
      .returning();
    
    if (!updatedUploadPlatform) {
      throw new Error(`UploadPlatform with ID ${id} not found`);
    }
    
    return updatedUploadPlatform;
  }
}

// Initialize database storage
export const storage = new DatabaseStorage();

// Create demo data for the app
async function seedInitialData() {
  // Check if there's existing data
  const existingUsers = await db.select().from(users);
  if (existingUsers.length > 0) {
    console.log('Database already has data, skipping seed');
    return;
  }

  try {
    // Create demo user
    const [user] = await db.insert(users).values({
      username: "demouser",
      password: "password123",
      email: "demo@example.com",
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    }).returning();
    
    console.log('Created demo user:', user.id);
    
    // Add platform connections
    const [ytPlatform] = await db.insert(platforms).values({
      userId: user.id,
      platformName: "youtube",
      isConnected: true,
      accessToken: "demo_token",
      refreshToken: "demo_refresh",
      tokenExpiry: new Date(Date.now() + 3600000),
      platformUserId: "youtube_user_123",
      platformUsername: "Demo Channel",
      additionalData: {}
    }).returning();
    
    const [fbPlatform] = await db.insert(platforms).values({
      userId: user.id,
      platformName: "facebook",
      isConnected: true,
      accessToken: "demo_token",
      refreshToken: "demo_refresh",
      tokenExpiry: new Date(Date.now() + 3600000),
      platformUserId: "facebook_user_456",
      platformUsername: "Demo Page",
      additionalData: {}
    }).returning();
    
    await db.insert(platforms).values({
      userId: user.id,
      platformName: "twitter",
      isConnected: false,
      platformUserId: "",
      platformUsername: "",
      additionalData: {}
    }).returning();
    
    const [igPlatform] = await db.insert(platforms).values({
      userId: user.id,
      platformName: "instagram",
      isConnected: true,
      accessToken: "demo_token",
      refreshToken: "demo_refresh",
      tokenExpiry: new Date(Date.now() + 3600000),
      platformUserId: "instagram_user_789",
      platformUsername: "demogram",
      additionalData: {}
    }).returning();
    
    console.log('Created platform connections');
    
    // Add some demo uploads
    const [upload1] = await db.insert(uploads).values({
      userId: user.id,
      title: "How to Use OmniCast Platform",
      description: "A complete tutorial on using the OmniCast platform for multi-platform uploads",
      tags: "tutorial,omnicast,howto",
      fileName: "omnicast-tutorial.mp4",
      fileSize: 24500000,
      duration: 154,
      thumbnailUrl: "https://images.unsplash.com/photo-1526328828355-69b01701ca6a?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&h=80&q=80",
      visibility: "public"
    }).returning();
    
    const [upload2] = await db.insert(uploads).values({
      userId: user.id,
      title: "Product Announcement - Summer 2023",
      description: "Exciting new features coming this summer!",
      tags: "product,announcement,summer",
      fileName: "summer-announcement.mp4",
      fileSize: 35200000,
      duration: 312,
      thumbnailUrl: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&h=80&q=80",
      visibility: "public"
    }).returning();
    
    const [upload3] = await db.insert(uploads).values({
      userId: user.id,
      title: "Weekly Team Update - May 29",
      description: "Internal update for the team",
      tags: "internal,update,team",
      fileName: "team-update-may29.mp4",
      fileSize: 89400000,
      duration: 585,
      thumbnailUrl: "https://images.unsplash.com/photo-1576585269693-6c7136aa7373?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&h=80&q=80",
      visibility: "private"
    }).returning();
    
    console.log('Created demo uploads');
    
    // Add platform statuses for uploads
    await Promise.all([
      // Upload 1 platforms
      db.insert(uploadPlatforms).values({
        uploadId: upload1.id,
        platformId: ytPlatform.id,
        status: "completed",
        platformVideoId: "yt123456789",
        platformVideoUrl: "https://youtube.com/watch?v=yt123456789",
        uploadProgress: 100,
        platformSettings: { playlist: "Tutorials" },
        completedAt: new Date()
      }),
      
      db.insert(uploadPlatforms).values({
        uploadId: upload1.id,
        platformId: fbPlatform.id,
        status: "completed",
        platformVideoId: "fb987654321",
        platformVideoUrl: "https://facebook.com/watch?v=fb987654321",
        uploadProgress: 100,
        platformSettings: { postAs: "Page" },
        completedAt: new Date()
      }),
      
      // Upload 2 platforms
      db.insert(uploadPlatforms).values({
        uploadId: upload2.id,
        platformId: ytPlatform.id,
        status: "completed",
        platformVideoId: "yt567890123",
        platformVideoUrl: "https://youtube.com/watch?v=yt567890123",
        uploadProgress: 100,
        platformSettings: { playlist: "Announcements" },
        completedAt: new Date()
      }),
      
      db.insert(uploadPlatforms).values({
        uploadId: upload2.id,
        platformId: fbPlatform.id,
        status: "completed",
        platformVideoId: "fb234567890",
        platformVideoUrl: "https://facebook.com/watch?v=fb234567890",
        uploadProgress: 100,
        platformSettings: { postAs: "Page" },
        completedAt: new Date()
      }),
      
      db.insert(uploadPlatforms).values({
        uploadId: upload2.id,
        platformId: igPlatform.id,
        status: "completed",
        platformVideoId: "ig345678901",
        platformVideoUrl: "https://instagram.com/p/ig345678901",
        uploadProgress: 100,
        platformSettings: { shareToStories: true },
        completedAt: new Date()
      }),
      
      // Upload 3 platforms
      db.insert(uploadPlatforms).values({
        uploadId: upload3.id,
        platformId: ytPlatform.id,
        status: "completed",
        platformVideoId: "yt678901234",
        platformVideoUrl: "https://youtube.com/watch?v=yt678901234",
        uploadProgress: 100,
        platformSettings: { visibility: "private" },
        completedAt: new Date()
      })
    ]);
    
    console.log('Created upload platform statuses');
    console.log('Seed data creation completed successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}

// Run seed on startup
seedInitialData();
