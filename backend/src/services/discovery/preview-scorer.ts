import type { Profile, Assessment } from '@prisma/client';
import { scoreTeam, computeSuccessProbability } from '../compatibility/scorer';
import { parseGoals, parseSkills } from '../profile/completion.service';

export function previewCompatibility(
  viewer: Profile & { assessment: Assessment | null },
  candidate: Profile & { assessment: Assessment | null },
) {
  const scores = scoreTeam([viewer, candidate]);
  const score = computeSuccessProbability(scores);
  const viewerGoals = parseGoals(viewer.goals);
  const candidateGoals = parseGoals(candidate.goals);
  const sharedTypes = viewerGoals.projectTypes.filter((t) =>
    candidateGoals.projectTypes.includes(t),
  );

  const viewerSkills = parseSkills(viewer.skills).map((s) => s.name);
  const candidateSkills = parseSkills(candidate.skills).map((s) => s.name);
  const complementary = candidateSkills.filter((s) => !viewerSkills.includes(s)).slice(0, 2);

  return {
    score,
    highlights: [
      sharedTypes.length > 0
        ? `Shared interest in ${sharedTypes.join(', ')} projects`
        : 'Different project focus areas',
      complementary.length > 0
        ? `Complementary skills: ${complementary.join(', ')}`
        : 'Overlapping skill sets',
    ],
    frictionPoints:
      viewerGoals.commitmentLevel !== candidateGoals.commitmentLevel
        ? ['Different commitment levels']
        : [],
  };
}
