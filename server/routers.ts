import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { notifyOwner } from "./_core/notification";
import { invokeLLM } from "./_core/llm";

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Applications
  applications: router({
    create: protectedProcedure
      .input(z.object({
        full_name: z.string(),
        age: z.number().optional(),
        country: z.string().optional(),
        portfolio_links: z.array(z.string()).optional(),
        resume_url: z.string().optional(),
        software_proficiency: z.array(z.string()).optional(),
        discipline_interest: z.array(z.string()).optional(),
        motivation_statement: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const application = await db.createApplication(ctx.user.id, {
          ...input,
          portfolio_links: input.portfolio_links || [],
          software_proficiency: input.software_proficiency || [],
          discipline_interest: input.discipline_interest || [],
        });

        // Notify owner of new application
        await notifyOwner({
          title: "New Application Submitted",
          content: `${input.full_name} has submitted an application to join the studio.`,
        });

        return application;
      }),

    list: protectedProcedure
      .input(z.object({
        limit: z.number().default(50),
        offset: z.number().default(0),
      }))
      .query(async ({ ctx, input }) => {
        if (ctx.user.role === "applicant") {
          return await db.getApplicationsByUserId(ctx.user.id);
        }
        // Admin can see all
        return await db.getAllApplications(input.limit, input.offset);
      }),

    updateStatus: protectedProcedure
      .input(z.object({
        applicationId: z.number(),
        status: z.enum(["submitted", "under_review", "shortlisted", "rejected", "hired"]),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }
        return await db.updateApplicationStatus(input.applicationId, input.status);
      }),
  }),

  // Assessments
  assessments: router({
    create: protectedProcedure
      .input(z.object({
        type: z.enum(["practical", "written", "hybrid"]).default("hybrid"),
        title: z.string(),
        description: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }
        return await db.createAssessment(ctx.user.id, input);
      }),

    list: protectedProcedure
      .query(async ({ ctx }) => {
        return await db.getAssessmentsByUserId(ctx.user.id);
      }),

    submitAssessment: protectedProcedure
      .input(z.object({
        assessmentId: z.number(),
        video_url: z.string().optional(),
        project_file_url: z.string().optional(),
        file_type: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const submission = await db.createAssessmentSubmission(
          input.assessmentId,
          ctx.user.id,
          {
            video_url: input.video_url,
            project_file_url: input.project_file_url,
            file_type: input.file_type,
            status: "submitted",
          }
        );

        // Trigger LLM feedback generation in background
        setTimeout(async () => {
          try {
            const feedback = await invokeLLM({
              messages: [
                {
                  role: "system",
                  content: "You are an expert animation evaluator. Provide constructive feedback on animation submissions.",
                },
                {
                  role: "user",
                  content: `Evaluate this animation submission and provide feedback on: timing accuracy, motion fluidity, creativity, technical execution, and file cleanliness. Provide a score 0-100 and specific recommendations.`,
                },
              ],
            });

            // Update submission with LLM feedback
            if (feedback.choices[0]?.message?.content) {
              // In production, save this feedback to the database
              console.log("LLM Feedback:", feedback.choices[0].message.content);
            }
          } catch (error) {
            console.error("LLM feedback generation failed:", error);
          }
        }, 0);

        return submission;
      }),

    getSubmissions: protectedProcedure
      .input(z.object({
        assessmentId: z.number(),
      }))
      .query(async ({ input }) => {
        return await db.getAssessmentSubmissions(input.assessmentId);
      }),
  }),

  // Tasks
  tasks: router({
    list: protectedProcedure
      .query(async ({ ctx }) => {
        return await db.getTasksByAssignedTo(ctx.user.id);
      }),

    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        description: z.string().optional(),
        type: z.enum(["learning", "production"]),
        assigned_to: z.number(),
        deadline: z.date().optional(),
        priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
        difficulty_rating: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }
        return await db.createTask({
          ...input,
          assigned_by: ctx.user.id,
        });
      }),

    updateStatus: protectedProcedure
      .input(z.object({
        taskId: z.number(),
        status: z.enum(["pending", "in_progress", "submitted", "under_review", "completed", "rejected"]),
      }))
      .mutation(async ({ input }) => {
        return await db.updateTaskStatus(input.taskId, input.status);
      }),

    submitTask: protectedProcedure
      .input(z.object({
        taskId: z.number(),
        file_url: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return await db.createTaskSubmission(input.taskId, ctx.user.id, {
          file_url: input.file_url,
          notes: input.notes,
          status: "submitted",
        });
      }),
  }),

  // Learning
  learning: router({
    getModules: protectedProcedure
      .input(z.object({
        limit: z.number().default(50),
        offset: z.number().default(0),
      }))
      .query(async ({ input }) => {
        return await db.getLearningModules(input.limit, input.offset);
      }),

    getProgress: protectedProcedure
      .input(z.object({
        moduleId: z.number(),
      }))
      .query(async ({ ctx, input }) => {
        return await db.getUserProgress(ctx.user.id, input.moduleId);
      }),

    updateProgress: protectedProcedure
      .input(z.object({
        moduleId: z.number(),
        progress_percentage: z.number(),
        completed: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return await db.updateUserProgress(ctx.user.id, input.moduleId, {
          progress_percentage: input.progress_percentage,
          completed: input.completed,
        });
      }),
  }),

  // Notifications
  notifications: router({
    list: protectedProcedure
      .input(z.object({
        unreadOnly: z.boolean().default(false),
      }))
      .query(async ({ ctx, input }) => {
        return await db.getNotificationsByUserId(ctx.user.id, input.unreadOnly);
      }),

    markAsRead: protectedProcedure
      .input(z.object({
        notificationId: z.number(),
      }))
      .mutation(async ({ input }) => {
        return await db.markNotificationAsRead(input.notificationId);
      }),
  }),

  // User Profile
  profile: router({
    get: protectedProcedure
      .query(async ({ ctx }) => {
        return await db.getUserById(ctx.user.id);
      }),

    update: protectedProcedure
      .input(z.object({
        name: z.string().optional(),
        bio: z.string().optional(),
        avatar_url: z.string().optional(),
        portfolio_links: z.array(z.string()).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Update user in database
        // This would require adding an update function to db.ts
        return { success: true };
      }),

    getBadges: protectedProcedure
      .query(async ({ ctx }) => {
        return await db.getUserBadges(ctx.user.id);
      }),

    getAnalytics: protectedProcedure
      .query(async ({ ctx }) => {
        return await db.getOrCreateAnalytics(ctx.user.id);
      }),
  }),

  // Payments
  payments: router({
    list: protectedProcedure
      .query(async ({ ctx }) => {
        return await db.getPaymentsByUserId(ctx.user.id);
      }),

    requestWithdrawal: protectedProcedure
      .input(z.object({
        amount: z.number(),
        method: z.enum(["bank", "mobile_money", "crypto"]),
      }))
      .mutation(async ({ ctx, input }) => {
        return await db.createPayment(ctx.user.id, {
          amount: input.amount,
          type: "withdrawal",
          method: input.method,
          status: "pending",
        });
      }),
  }),
});

export type AppRouter = typeof appRouter;
