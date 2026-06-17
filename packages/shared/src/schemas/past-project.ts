import { z } from 'zod';

export const ProjectOutcomeSchema = z.enum(['completed', 'ongoing', 'abandoned']);

export const PastProjectCreateSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  role: z.string().max(100).optional(),
  outcome: ProjectOutcomeSchema.optional(),
  teamSize: z.number().int().min(1).max(50).optional(),
  highlights: z.array(z.string().max(200)).max(5).default([]),
});

export const PastProjectResponseSchema = PastProjectCreateSchema.extend({
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
});

export type PastProjectCreate = z.infer<typeof PastProjectCreateSchema>;
export type PastProjectResponse = z.infer<typeof PastProjectResponseSchema>;
