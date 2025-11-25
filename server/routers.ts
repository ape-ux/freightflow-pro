import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";

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

  quotes: router({
    list: publicProcedure.query(async () => {
      // TODO: Implement quote listing with filters
      return [];
    }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        // TODO: Implement quote retrieval
        return null;
      }),
    create: protectedProcedure
      .input(z.object({
        customerId: z.number(),
        origin: z.object({}).passthrough(),
        destination: z.object({}).passthrough(),
        containerInfo: z.object({}).passthrough(),
        serviceType: z.string(),
        pickupDate: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        // TODO: Implement quote creation with AI pricing
        return { success: true, quoteId: 0 };
      }),
  }),

  dispatches: router({
    list: publicProcedure.query(async () => {
      // TODO: Implement dispatch listing with status filters
      return [];
    }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        // TODO: Implement dispatch retrieval
        return null;
      }),
    create: protectedProcedure
      .input(z.object({
        quoteId: z.number(),
        carrierId: z.number(),
        pickupAppointment: z.string(),
        deliveryAppointment: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        // TODO: Implement dispatch creation
        return { success: true, dispatchId: 0 };
      }),
    updateStatus: protectedProcedure
      .input(z.object({
        dispatchId: z.number(),
        status: z.string(),
        location: z.object({}).passthrough().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        // TODO: Implement status update with real-time notifications
        return { success: true };
      }),
  }),

  carriers: router({
    list: publicProcedure.query(async () => {
      // TODO: Implement carrier listing
      return [];
    }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        // TODO: Implement carrier retrieval
        return null;
      }),
    getRates: publicProcedure
      .input(z.object({
        carrierId: z.number(),
        origin: z.object({}).passthrough(),
        destination: z.object({}).passthrough(),
      }))
      .query(async ({ input }) => {
        // TODO: Implement carrier rate retrieval
        return { rates: [] };
      }),
  }),
});

export type AppRouter = typeof appRouter;
