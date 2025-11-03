import { z } from "zod";

type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type { Json };

export const jsonSchema: z.ZodType<Json> = z.lazy(() =>
  z.union([z.string(), z.number(), z.boolean(), z.null(), z.array(jsonSchema), z.record(jsonSchema)])
);

export const eventSchema = z.object({
  type: z.enum(["page_view", "cta_click", "book_click", "itinerary_open"]),
  path: z.string().min(1),
  sessionId: z.string().min(1).max(128).optional(),
  meta: jsonSchema.optional(),
});

export const leadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  country: z.string().min(2),
  travel_window: z.string().min(2),
  notes: z.string().trim().max(2000).optional(),
  source: z.string().trim().max(120).optional(),
  utm: jsonSchema.optional(),
});

export const inquirySchema = z.object({
  lead_id: z.string().uuid(),
  channel: z.enum(["whatsapp", "email", "form"]),
  message: z.string().min(1).max(2000),
});

export const bookingSchema = z.object({
  lead_id: z.string().uuid(),
  package_id: z.string().uuid(),
  amount_estimate: z.number().int().min(0).optional(),
  meta: jsonSchema.optional(),
});

export const bookingStatusSchema = z.object({
  status: z.enum(["new", "consulting", "docs", "booked", "closed"]),
});

export const exportQuerySchema = z.object({
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
});

export const packageUpdateSchema = z.object({
  title: z.string().min(3).max(160),
  days: z.number().int().min(1).max(60),
  highlights: z.array(z.string().min(1).max(200)).min(1).max(12),
  price_from: z.number().int().min(0).nullable().optional(),
  active: z.boolean().optional(),
});
