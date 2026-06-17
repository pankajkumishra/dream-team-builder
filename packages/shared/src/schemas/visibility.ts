import { z } from 'zod';

export const VisibilitySettingsSchema = z.object({
  discoverable: z.boolean(),
  showSkills: z.boolean(),
  showGoals: z.boolean(),
  showAssessmentSummary: z.boolean(),
  showPastProjects: z.boolean(),
});

export type VisibilitySettings = z.infer<typeof VisibilitySettingsSchema>;
