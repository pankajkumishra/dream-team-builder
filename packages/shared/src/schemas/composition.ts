import { z } from 'zod';

export const ProjectIntentSchema = z.object({
  title: z.string().min(1).max(200),
  domain: z.enum(['saas', 'research', 'hackathon', 'student', 'other']),
  stage: z.enum(['idea', 'mvp', 'growth']),
  description: z.string().min(1).max(1000),
  timeline: z.string().max(100).optional(),
  goals: z.array(z.string()).default([]),
});

export const CompositionCreateSchema = z.object({
  projectIntent: ProjectIntentSchema,
  existingMemberProfileIds: z.array(z.string().uuid()).optional(),
});

export const RecommendedRoleSchema = z.object({
  title: z.string(),
  prioritySkills: z.array(z.string()),
  idealTraits: z.array(z.string()),
  rationale: z.string(),
});

export const CompositionResultSchema = z.object({
  id: z.string().uuid(),
  recommendedRoles: z.array(RecommendedRoleSchema),
  filledRoles: z.array(z.object({ title: z.string(), coveredBy: z.string().uuid().optional() })),
  gapRoles: z.array(z.object({ title: z.string(), priority: z.string().optional() })),
  insights: z.array(z.string()),
  rationale: z.string(),
});

export type CompositionCreate = z.infer<typeof CompositionCreateSchema>;
export type CompositionResult = z.infer<typeof CompositionResultSchema>;
