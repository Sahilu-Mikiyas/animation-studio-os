import { eq, and, desc, asc, gte, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users,
  applications,
  assessments,
  assessment_submissions,
  tasks,
  task_submissions,
  contracts,
  payments,
  notifications,
  learning_modules,
  user_progress,
  badges,
  user_badges,
  analytics,
  portfolio_files,
  portfolio_analysis,
  portfolio_insights
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Applications
export async function createApplication(userId: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(applications).values({
    user_id: userId,
    ...data,
  });
  return result;
}

export async function getApplicationsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(applications).where(eq(applications.user_id, userId));
}

export async function getAllApplications(limit = 50, offset = 0) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(applications)
    .orderBy(desc(applications.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function updateApplicationStatus(applicationId: number, status: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.update(applications)
    .set({ status: status as any })
    .where(eq(applications.id, applicationId));
}

// Assessments
export async function createAssessment(userId: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(assessments).values({
    user_id: userId,
    ...data,
  });
  return result;
}

export async function getAssessmentsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(assessments).where(eq(assessments.user_id, userId));
}

export async function updateAssessmentScore(assessmentId: number, scoreData: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.update(assessments)
    .set(scoreData)
    .where(eq(assessments.id, assessmentId));
}

// Assessment Submissions
export async function createAssessmentSubmission(assessmentId: number, userId: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(assessment_submissions).values({
    assessment_id: assessmentId,
    user_id: userId,
    ...data,
  });
}

export async function getAssessmentSubmissions(assessmentId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(assessment_submissions)
    .where(eq(assessment_submissions.assessment_id, assessmentId))
    .orderBy(desc(assessment_submissions.createdAt));
}

// Tasks
export async function createTask(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(tasks).values(data);
}

export async function getTasksByAssignedTo(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(tasks)
    .where(eq(tasks.assigned_to, userId))
    .orderBy(asc(tasks.deadline));
}

export async function updateTaskStatus(taskId: number, status: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.update(tasks)
    .set({ status: status as any })
    .where(eq(tasks.id, taskId));
}

// Task Submissions
export async function createTaskSubmission(taskId: number, userId: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(task_submissions).values({
    task_id: taskId,
    user_id: userId,
    ...data,
  });
}

export async function getTaskSubmissions(taskId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(task_submissions)
    .where(eq(task_submissions.task_id, taskId))
    .orderBy(desc(task_submissions.createdAt));
}

// Contracts
export async function createContract(userId: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(contracts).values({
    user_id: userId,
    ...data,
  });
}

export async function getContractsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(contracts).where(eq(contracts.user_id, userId));
}

// Payments
export async function createPayment(userId: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(payments).values({
    user_id: userId,
    ...data,
  });
}

export async function getPaymentsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(payments)
    .where(eq(payments.user_id, userId))
    .orderBy(desc(payments.createdAt));
}

// Notifications
export async function createNotification(userId: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(notifications).values({
    user_id: userId,
    ...data,
  });
}

export async function getNotificationsByUserId(userId: number, unreadOnly = false) {
  const db = await getDb();
  if (!db) return [];

  if (unreadOnly) {
    return await db.select().from(notifications)
      .where(and(eq(notifications.user_id, userId), eq(notifications.read, false)))
      .orderBy(desc(notifications.createdAt));
  }
  
  return await db.select().from(notifications)
    .where(eq(notifications.user_id, userId))
    .orderBy(desc(notifications.createdAt));
}

export async function markNotificationAsRead(notificationId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.update(notifications)
    .set({ read: true })
    .where(eq(notifications.id, notificationId));
}

// Learning Modules
export async function getLearningModules(limit = 50, offset = 0) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(learning_modules)
    .where(eq(learning_modules.status, 'published'))
    .limit(limit)
    .offset(offset);
}

// User Progress
export async function getUserProgress(userId: number, moduleId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(user_progress)
    .where(and(eq(user_progress.user_id, userId), eq(user_progress.module_id, moduleId)))
    .limit(1);
  
  return result.length > 0 ? result[0] : null;
}

export async function updateUserProgress(userId: number, moduleId: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await getUserProgress(userId, moduleId);
  
  if (existing) {
    return await db.update(user_progress)
      .set(data)
      .where(and(eq(user_progress.user_id, userId), eq(user_progress.module_id, moduleId)));
  } else {
    return await db.insert(user_progress).values({
      user_id: userId,
      module_id: moduleId,
      ...data,
    });
  }
}

// Badges
export async function getUserBadges(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(user_badges)
    .where(eq(user_badges.user_id, userId));
}

export async function awardBadge(userId: number, badgeId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(user_badges).values({
    user_id: userId,
    badge_id: badgeId,
  });
}

// Analytics
export async function getOrCreateAnalytics(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.select().from(analytics).where(eq(analytics.user_id, userId)).limit(1);
  
  if (result.length > 0) {
    return result[0];
  }
  
  await db.insert(analytics).values({
    user_id: userId,
  });
  
  const newResult = await db.select().from(analytics).where(eq(analytics.user_id, userId)).limit(1);
  return newResult[0];
}

export async function updateAnalytics(userId: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.update(analytics)
    .set(data)
    .where(eq(analytics.user_id, userId));
}


// Portfolio Files
export async function createPortfolioFile(userId: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(portfolio_files).values({
    user_id: userId,
    ...data,
  });
}

export async function getPortfolioFilesByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(portfolio_files)
    .where(eq(portfolio_files.user_id, userId))
    .orderBy(desc(portfolio_files.createdAt));
}

export async function getPortfolioFileById(fileId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(portfolio_files)
    .where(eq(portfolio_files.id, fileId))
    .limit(1);
  
  return result.length > 0 ? result[0] : null;
}

export async function updatePortfolioFileStatus(fileId: number, status: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.update(portfolio_files)
    .set({ status: status as any })
    .where(eq(portfolio_files.id, fileId));
}

// Portfolio Analysis
export async function createPortfolioAnalysis(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(portfolio_analysis).values(data);
}

export async function getPortfolioAnalysisByFileId(fileId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(portfolio_analysis)
    .where(eq(portfolio_analysis.portfolio_file_id, fileId))
    .limit(1);
  
  return result.length > 0 ? result[0] : null;
}

export async function getPortfolioAnalysisByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(portfolio_analysis)
    .where(eq(portfolio_analysis.user_id, userId))
    .orderBy(desc(portfolio_analysis.createdAt));
}

// Portfolio Insights
export async function getOrCreatePortfolioInsights(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.select().from(portfolio_insights)
    .where(eq(portfolio_insights.user_id, userId))
    .limit(1);
  
  if (result.length > 0) {
    return result[0];
  }
  
  await db.insert(portfolio_insights).values({
    user_id: userId,
    files_analyzed: 0,
  });
  
  const newResult = await db.select().from(portfolio_insights)
    .where(eq(portfolio_insights.user_id, userId))
    .limit(1);
  
  return newResult[0];
}

export async function updatePortfolioInsights(userId: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.update(portfolio_insights)
    .set(data)
    .where(eq(portfolio_insights.user_id, userId));
}
