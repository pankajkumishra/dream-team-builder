import { z } from 'zod';

export const TeamAnalysisCreateSchema = z.object({
  memberProfileIds: z.array(z.string().uuid()).min(2).max(6),
  projectIntentId: z.string().uuid().optional(),
});

export const TeamDimensionScoresSchema = z.object({
  workStyleAlignment: z.number().min(0).max(1),
  goalAlignment: z.number().min(0).max(1),
  skillComplementarity: z.number().min(0).max(1),
  communicationFit: z.number().min(0).max(1),
});

export const RiskFlagSchema = z.object({
  type: z.enum([
    'skill_gap',
    'skill_redundancy',
    'goal_conflict',
    'work_style_clash',
    'incomplete_profile',
    'low_confidence',
  ]),
  severity: z.enum(['low', 'medium', 'high']),
  explanation: z.string(),
});

export const TeamAnalysisResultSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(['pending', 'complete', 'stale', 'failed']),
  memberProfiles: z.array(z.object({ id: z.string().uuid(), headline: z.string().nullable() })),
  dimensionScores: TeamDimensionScoresSchema.optional(),
  successProbability: z.number().min(0).max(100).optional(),
  confidenceLevel: z.enum(['high', 'medium', 'low']),
  riskFlags: z.array(RiskFlagSchema),
  explanations: z.record(z.string(), z.string()).optional(),
  staleReason: z.string().optional(),
  createdAt: z.string().datetime(),
  completedAt: z.string().datetime().nullable().optional(),
});

export type TeamAnalysisCreate = z.infer<typeof TeamAnalysisCreateSchema>;
export type TeamAnalysisResult = z.infer<typeof TeamAnalysisResultSchema>;
