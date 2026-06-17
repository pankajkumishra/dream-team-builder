import type { Profile, Assessment } from '@prisma/client';

export type ConfidenceLevel = 'high' | 'medium' | 'low';

export function computeConfidence(
  profiles: (Profile & { assessment: Assessment | null })[],
): ConfidenceLevel {
  let score = 1.0;

  for (const profile of profiles) {
    if (profile.completionStatus !== 'complete') score -= 0.15;
    if (!profile.assessment?.completedAt) score -= 0.2;
    if (profile.assessment?.skipped) score -= 0.25;
  }

  if (score >= 0.75) return 'high';
  if (score >= 0.5) return 'medium';
  return 'low';
}
