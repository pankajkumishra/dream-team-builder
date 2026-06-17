import { z } from 'zod';

export const AssessmentResponsesSchema = z.record(
  z.string(),
  z.number().int().min(1).max(5),
);

export const AssessmentUpdateSchema = z.object({
  responses: AssessmentResponsesSchema,
  submit: z.boolean().default(false),
});

export const DimensionScoresSchema = z.record(z.string(), z.number().min(0).max(1));

export const AssessmentResponseSchema = z.object({
  completedAt: z.string().datetime().nullable(),
  skipped: z.boolean(),
  dimensionScores: DimensionScoresSchema,
  workStyleSummary: z.string().nullable().optional(),
});

export type AssessmentUpdate = z.infer<typeof AssessmentUpdateSchema>;
export type AssessmentResponse = z.infer<typeof AssessmentResponseSchema>;
