import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const platforms = pgTable("platforms", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  platformName: text("platform_name").notNull(),
  isConnected: boolean("is_connected").default(false),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  tokenExpiry: timestamp("token_expiry"),
  platformUserId: text("platform_user_id"),
  platformUsername: text("platform_username"),
  additionalData: jsonb("additional_data"),
});

export const uploads = pgTable("uploads", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  tags: text("tags"),
  fileName: text("file_name").notNull(),
  fileSize: integer("file_size").notNull(),
  duration: integer("duration"),
  thumbnailUrl: text("thumbnail_url"),
  visibility: text("visibility").default("public"),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

export const uploadPlatforms = pgTable("upload_platforms", {
  id: serial("id").primaryKey(),
  uploadId: integer("upload_id").notNull().references(() => uploads.id),
  platformId: integer("platform_id").notNull().references(() => platforms.id),
  status: text("status").default("pending"),
  platformVideoId: text("platform_video_id"),
  platformVideoUrl: text("platform_video_url"),
  uploadProgress: integer("upload_progress").default(0),
  errorMessage: text("error_message"),
  platformSettings: jsonb("platform_settings"),
  completedAt: timestamp("completed_at"),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertPlatformSchema = createInsertSchema(platforms).omit({
  id: true,
});

export const insertUploadSchema = createInsertSchema(uploads).omit({
  id: true,
  uploadedAt: true,
});

export const insertUploadPlatformSchema = createInsertSchema(uploadPlatforms).omit({
  id: true,
  completedAt: true,
});

// Select types
export type User = typeof users.$inferSelect;
export type Platform = typeof platforms.$inferSelect;
export type Upload = typeof uploads.$inferSelect;
export type UploadPlatform = typeof uploadPlatforms.$inferSelect;

// Insert types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertPlatform = z.infer<typeof insertPlatformSchema>;
export type InsertUpload = z.infer<typeof insertUploadSchema>;
export type InsertUploadPlatform = z.infer<typeof insertUploadPlatformSchema>;
