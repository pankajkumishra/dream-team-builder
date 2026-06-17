import { z } from 'zod';

export const ConnectionCreateSchema = z.object({
  recipientId: z.string().uuid(),
  message: z.string().max(300).optional(),
});

export const ConnectionUpdateSchema = z.object({
  status: z.enum(['accepted', 'declined', 'withdrawn']),
});

export const ConnectionResponseSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(['pending', 'accepted', 'declined', 'withdrawn']),
  createdAt: z.string().datetime(),
  respondedAt: z.string().datetime().nullable().optional(),
});

export type ConnectionCreate = z.infer<typeof ConnectionCreateSchema>;
export type ConnectionUpdate = z.infer<typeof ConnectionUpdateSchema>;
