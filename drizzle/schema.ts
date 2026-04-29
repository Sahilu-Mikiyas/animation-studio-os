import { 
  int, 
  mysqlEnum, 
  mysqlTable, 
  text, 
  timestamp, 
  varchar,
  decimal,
  json,
  boolean,
  datetime,
  mediumint,
  tinyint,
  longtext
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extended with animation studio specific fields.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["applicant", "artist", "admin"]).default("applicant").notNull(),
  
  // Studio-specific fields
  level: tinyint("level").default(1), // L1-L5
  xp: int("xp").default(0),
  salary: decimal("salary", { precision: 10, scale: 2 }).default("0"),
  status: mysqlEnum("status", ["pending", "active", "inactive", "rejected"]).default("pending"),
  
  // Profile
  portfolio_links: json("portfolio_links"), // Array of URLs
  bio: text("bio"),
  avatar_url: varchar("avatar_url", { length: 512 }),
  
  // Finance
  bank_account: varchar("bank_account", { length: 255 }),
  payment_method: mysqlEnum("payment_method", ["bank", "mobile_money", "crypto"]),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Applications table - tracks applicant submissions
 */
export const applications = mysqlTable("applications", {
  id: int("id").autoincrement().primaryKey(),
  user_id: int("user_id").notNull(),
  
  // Application data
  full_name: varchar("full_name", { length: 255 }).notNull(),
  age: tinyint("age"),
  country: varchar("country", { length: 100 }),
  portfolio_links: json("portfolio_links"), // Array of URLs
  resume_url: varchar("resume_url", { length: 512 }),
  software_proficiency: json("software_proficiency"), // Array of software names
  discipline_interest: json("discipline_interest"), // Array of disciplines
  motivation_statement: longtext("motivation_statement"),
  
  // Auto-tagging
  skill_level: mysqlEnum("skill_level", ["beginner", "intermediate", "advanced", "professional"]),
  
  // Status
  status: mysqlEnum("status", ["submitted", "under_review", "shortlisted", "rejected", "hired"]).default("submitted"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Application = typeof applications.$inferSelect;
export type InsertApplication = typeof applications.$inferInsert;

/**
 * Assessments table - skill evaluation records
 */
export const assessments = mysqlTable("assessments", {
  id: int("id").autoincrement().primaryKey(),
  user_id: int("user_id").notNull(),
  
  // Assessment details
  type: mysqlEnum("type", ["practical", "written", "hybrid"]).default("hybrid"),
  title: varchar("title", { length: 255 }),
  description: longtext("description"),
  
  // Scoring
  timing_accuracy: tinyint("timing_accuracy"),
  motion_fluidity: tinyint("motion_fluidity"),
  creativity: tinyint("creativity"),
  technical_execution: tinyint("technical_execution"),
  file_cleanliness: tinyint("file_cleanliness"),
  
  score_total: tinyint("score_total"),
  level_assigned: tinyint("level_assigned"), // L1-L5
  
  // Recommendation
  recommendation: mysqlEnum("recommendation", ["reject", "train", "hire_trainee", "hire"]),
  
  // LLM feedback
  llm_feedback: longtext("llm_feedback"),
  human_feedback: longtext("human_feedback"),
  
  // Status
  status: mysqlEnum("status", ["pending", "in_progress", "completed", "reviewed"]).default("pending"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Assessment = typeof assessments.$inferSelect;
export type InsertAssessment = typeof assessments.$inferInsert;

/**
 * Assessment submissions - individual submissions with versions
 */
export const assessment_submissions = mysqlTable("assessment_submissions", {
  id: int("id").autoincrement().primaryKey(),
  assessment_id: int("assessment_id").notNull(),
  user_id: int("user_id").notNull(),
  
  // Submission data
  video_url: varchar("video_url", { length: 512 }),
  project_file_url: varchar("project_file_url", { length: 512 }),
  file_type: varchar("file_type", { length: 50 }), // blend, maya, etc
  
  // Version tracking
  version: int("version").default(1),
  
  // Scoring
  score: tinyint("score"),
  feedback: longtext("feedback"),
  
  // Status
  status: mysqlEnum("status", ["submitted", "under_review", "scored", "revision_requested"]).default("submitted"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AssessmentSubmission = typeof assessment_submissions.$inferSelect;
export type InsertAssessmentSubmission = typeof assessment_submissions.$inferInsert;

/**
 * Tasks table - learning and production tasks
 */
export const tasks = mysqlTable("tasks", {
  id: int("id").autoincrement().primaryKey(),
  
  // Task details
  title: varchar("title", { length: 255 }).notNull(),
  description: longtext("description"),
  type: mysqlEnum("type", ["learning", "production"]).default("learning"),
  
  // Assignment
  assigned_to: int("assigned_to"),
  assigned_by: int("assigned_by"),
  
  // Scheduling
  deadline: datetime("deadline"),
  priority: mysqlEnum("priority", ["low", "medium", "high", "urgent"]).default("medium"),
  difficulty_rating: tinyint("difficulty_rating"), // 1-5
  
  // Status
  status: mysqlEnum("status", ["pending", "in_progress", "submitted", "under_review", "completed", "rejected"]).default("pending"),
  
  // Supervisor
  supervisor_id: int("supervisor_id"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Task = typeof tasks.$inferSelect;
export type InsertTask = typeof tasks.$inferInsert;

/**
 * Task submissions - file submissions and versions
 */
export const task_submissions = mysqlTable("task_submissions", {
  id: int("id").autoincrement().primaryKey(),
  task_id: int("task_id").notNull(),
  user_id: int("user_id").notNull(),
  
  // Submission data
  file_url: varchar("file_url", { length: 512 }),
  notes: longtext("notes"),
  
  // Version tracking
  version: int("version").default(1),
  
  // Review
  reviewer_id: int("reviewer_id"),
  score: tinyint("score"),
  feedback: longtext("feedback"),
  revision_requested: boolean("revision_requested").default(false),
  
  // Status
  status: mysqlEnum("status", ["submitted", "under_review", "approved", "revision_requested"]).default("submitted"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TaskSubmission = typeof task_submissions.$inferSelect;
export type InsertTaskSubmission = typeof task_submissions.$inferInsert;

/**
 * Contracts table - employment contracts
 */
export const contracts = mysqlTable("contracts", {
  id: int("id").autoincrement().primaryKey(),
  user_id: int("user_id").notNull(),
  
  // Contract terms
  salary: decimal("salary", { precision: 10, scale: 2 }),
  role: varchar("role", { length: 100 }),
  level: tinyint("level"),
  
  // Document
  document_url: varchar("document_url", { length: 512 }),
  
  // Signing
  signed_status: mysqlEnum("signed_status", ["pending", "signed", "rejected"]).default("pending"),
  signed_date: datetime("signed_date"),
  
  // Versioning
  version: int("version").default(1),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Contract = typeof contracts.$inferSelect;
export type InsertContract = typeof contracts.$inferInsert;

/**
 * Payments table - earnings and payment history
 */
export const payments = mysqlTable("payments", {
  id: int("id").autoincrement().primaryKey(),
  user_id: int("user_id").notNull(),
  
  // Payment details
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  type: mysqlEnum("type", ["salary", "bonus", "withdrawal"]).default("salary"),
  
  // Payment method
  method: mysqlEnum("method", ["bank", "mobile_money", "crypto"]),
  
  // Status
  status: mysqlEnum("status", ["pending", "processed", "failed", "cancelled"]).default("pending"),
  
  // Reference
  reference_id: varchar("reference_id", { length: 255 }),
  notes: text("notes"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;

/**
 * Learning modules table
 */
export const learning_modules = mysqlTable("learning_modules", {
  id: int("id").autoincrement().primaryKey(),
  
  // Module details
  title: varchar("title", { length: 255 }).notNull(),
  description: longtext("description"),
  category: varchar("category", { length: 100 }),
  
  // Content
  content_url: varchar("content_url", { length: 512 }),
  lesson_cards: json("lesson_cards"), // Array of lesson card objects
  
  // Progression
  difficulty_level: tinyint("difficulty_level"), // 1-5
  estimated_duration: int("estimated_duration"), // in minutes
  
  // Status
  status: mysqlEnum("status", ["draft", "published", "archived"]).default("draft"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type LearningModule = typeof learning_modules.$inferSelect;
export type InsertLearningModule = typeof learning_modules.$inferInsert;

/**
 * User progress tracking for learning modules
 */
export const user_progress = mysqlTable("user_progress", {
  id: int("id").autoincrement().primaryKey(),
  user_id: int("user_id").notNull(),
  module_id: int("module_id").notNull(),
  
  // Progress
  progress_percentage: tinyint("progress_percentage").default(0),
  completed: boolean("completed").default(false),
  
  // Checkpoints
  checkpoints_completed: json("checkpoints_completed"), // Array of checkpoint IDs
  
  // Timing
  started_at: datetime("started_at"),
  completed_at: datetime("completed_at"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserProgress = typeof user_progress.$inferSelect;
export type InsertUserProgress = typeof user_progress.$inferInsert;

/**
 * Badges and achievements
 */
export const badges = mysqlTable("badges", {
  id: int("id").autoincrement().primaryKey(),
  
  // Badge details
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  icon_url: varchar("icon_url", { length: 512 }),
  
  // Badge type
  type: mysqlEnum("type", ["speed", "detail", "consistency", "creativity", "technical"]).default("technical"),
  
  // Requirements
  xp_requirement: int("xp_requirement").default(0),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Badge = typeof badges.$inferSelect;
export type InsertBadge = typeof badges.$inferInsert;

/**
 * User badges - tracks earned badges
 */
export const user_badges = mysqlTable("user_badges", {
  id: int("id").autoincrement().primaryKey(),
  user_id: int("user_id").notNull(),
  badge_id: int("badge_id").notNull(),
  
  earned_at: timestamp("earned_at").defaultNow().notNull(),
});

export type UserBadge = typeof user_badges.$inferSelect;
export type InsertUserBadge = typeof user_badges.$inferInsert;

/**
 * Notifications table
 */
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  user_id: int("user_id").notNull(),
  
  // Notification details
  title: varchar("title", { length: 255 }).notNull(),
  content: longtext("content"),
  type: mysqlEnum("type", ["application", "task", "assessment", "payment", "system"]).default("system"),
  
  // Link
  link_url: varchar("link_url", { length: 512 }),
  
  // Status
  read: boolean("read").default(false),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

/**
 * Analytics and performance tracking
 */
export const analytics = mysqlTable("analytics", {
  id: int("id").autoincrement().primaryKey(),
  user_id: int("user_id").notNull(),
  
  // Performance metrics
  tasks_completed: int("tasks_completed").default(0),
  tasks_total: int("tasks_total").default(0),
  average_score: decimal("average_score", { precision: 5, scale: 2 }).default("0"),
  
  // Skill growth
  skill_growth_trend: json("skill_growth_trend"), // Array of {date, score}
  
  // Earnings
  total_earned: decimal("total_earned", { precision: 12, scale: 2 }).default("0"),
  
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Analytics = typeof analytics.$inferSelect;
export type InsertAnalytics = typeof analytics.$inferInsert;

/**
 * Portfolio files - uploaded animation/artwork files
 */
export const portfolio_files = mysqlTable("portfolio_files", {
  id: int("id").autoincrement().primaryKey(),
  user_id: int("user_id").notNull(),
  
  // File details
  file_name: varchar("file_name", { length: 255 }).notNull(),
  file_url: varchar("file_url", { length: 512 }).notNull(),
  file_key: varchar("file_key", { length: 255 }).notNull(), // S3 key
  file_type: varchar("file_type", { length: 50 }), // mp4, blend, etc.
  file_size: int("file_size"), // in bytes
  
  // Metadata
  title: varchar("title", { length: 255 }),
  description: longtext("description"),
  
  // Status
  status: mysqlEnum("status", ["uploaded", "analyzing", "analyzed", "failed"]).default("uploaded"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PortfolioFile = typeof portfolio_files.$inferSelect;
export type InsertPortfolioFile = typeof portfolio_files.$inferInsert;

/**
 * Portfolio analysis results - AI-powered motion quality scoring
 */
export const portfolio_analysis = mysqlTable("portfolio_analysis", {
  id: int("id").autoincrement().primaryKey(),
  portfolio_file_id: int("portfolio_file_id").notNull(),
  user_id: int("user_id").notNull(),
  
  // Overall score (0-100)
  overall_score: tinyint("overall_score"),
  
  // Motion quality metrics
  fluidity_score: tinyint("fluidity_score"), // 0-100
  timing_score: tinyint("timing_score"), // 0-100
  weight_score: tinyint("weight_score"), // 0-100
  anticipation_score: tinyint("anticipation_score"), // 0-100
  spacing_score: tinyint("spacing_score"), // 0-100
  appeal_score: tinyint("appeal_score"), // 0-100
  
  // Automatic tags
  tags: json("tags"), // Array of strings: ["smooth", "dynamic", "character-driven", etc.]
  
  // AI-generated insights
  strengths: longtext("strengths"), // LLM analysis of what's good
  areas_for_improvement: longtext("areas_for_improvement"), // LLM analysis of what needs work
  detailed_feedback: longtext("detailed_feedback"), // Full LLM feedback
  
  // Comparison data
  percentile_rank: tinyint("percentile_rank"), // 0-100, where does this rank
  comparison_notes: text("comparison_notes"), // How it compares to similar work
  
  // Analysis metadata
  model_version: varchar("model_version", { length: 50 }), // Which LLM model was used
  analysis_timestamp: datetime("analysis_timestamp"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PortfolioAnalysis = typeof portfolio_analysis.$inferSelect;
export type InsertPortfolioAnalysis = typeof portfolio_analysis.$inferInsert;

/**
 * Portfolio insights - aggregated analytics for user
 */
export const portfolio_insights = mysqlTable("portfolio_insights", {
  id: int("id").autoincrement().primaryKey(),
  user_id: int("user_id").notNull(),
  
  // Aggregate metrics
  average_overall_score: decimal("average_overall_score", { precision: 5, scale: 2 }),
  average_fluidity: decimal("average_fluidity", { precision: 5, scale: 2 }),
  average_timing: decimal("average_timing", { precision: 5, scale: 2 }),
  average_weight: decimal("average_weight", { precision: 5, scale: 2 }),
  
  // Top strengths across portfolio
  top_strengths: json("top_strengths"), // Array of strength tags
  
  // Common areas for improvement
  common_improvements: json("common_improvements"), // Array of improvement areas
  
  // Portfolio quality trend
  quality_trend: json("quality_trend"), // Array of {date, score}
  
  // Total files analyzed
  files_analyzed: int("files_analyzed").default(0),
  
  // Last analysis date
  last_analyzed: datetime("last_analyzed"),
  
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PortfolioInsights = typeof portfolio_insights.$inferSelect;
export type InsertPortfolioInsights = typeof portfolio_insights.$inferInsert;
