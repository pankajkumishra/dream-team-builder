import { z } from 'zod';

export const SkillLevelSchema = z.enum(['beginner', 'intermediate', 'advanced', 'expert']);

export const SkillSchema = z.object({
  name: z.string().min(1).max(50),
  level: SkillLevelSchema,
  isPrimary: z.boolean().default(false),
});

export const GoalsSchema = z.object({
  projectTypes: z.array(z.string()).default([]),
  timeline: z.string().max(100).optional(),
  commitmentLevel: z.enum(['part-time', 'full-time', 'flexible']).optional(),
  interests: z.array(z.string()).default([]),
});

export const ProfileUpdateSchema = z.object({
  headline: z.string().max(120).optional(),
  bio: z.string().max(500).optional(),
  skills: z.array(SkillSchema).optional(),
  experienceYears: z.number().int().min(0).max(50).optional(),
  expertiseAreas: z.array(z.string()).optional(),
  goals: GoalsSchema.optional(),
});

export const CompletionStatusSchema = z.enum(['draft', 'partial', 'complete']);

export const ProfileResponseSchema = z.object({
  id: z.string().uuid(),
  headline: z.string().nullable(),
  bio: z.string().nullable(),
  skills: z.array(SkillSchema),
  experienceYears: z.number().nullable(),
  expertiseAreas: z.array(z.string()),
  goals: GoalsSchema,
  workStyleSummary: z.string().nullable(),
  completionStatus: CompletionStatusSchema,
  profileVersion: z.number().int(),
  pastProjects: z
    .array(
      z.object({
        id: z.string().uuid(),
        title: z.string(),
        role: z.string().nullable(),
      }),
    )
    .optional(),
});

export type Skill = z.infer<typeof SkillSchema>;
export type Goals = z.infer<typeof GoalsSchema>;
export type ProfileUpdate = z.infer<typeof ProfileUpdateSchema>;
export type ProfileResponse = z.infer<typeof ProfileResponseSchema>;
