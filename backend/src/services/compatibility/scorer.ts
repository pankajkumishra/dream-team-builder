import type { Profile, Assessment } from '@prisma/client';
import { parseGoals, parseSkills } from '../profile/completion.service';

export interface DimensionScores {
  workStyleAlignment: number;
  goalAlignment: number;
  skillComplementarity: number;
  communicationFit: number;
}

export function scoreTeam(
  profiles: (Profile & { assessment: Assessment | null })[],
): DimensionScores {
  return {
    workStyleAlignment: scoreWorkStyle(profiles),
    goalAlignment: scoreGoals(profiles),
    skillComplementarity: scoreSkills(profiles),
    communicationFit: scoreCommunication(profiles),
  };
}

function scoreWorkStyle(profiles: (Profile & { assessment: Assessment | null })[]): number {
  const vectors = profiles
    .map((p) => p.assessment?.dimensionScores as Record<string, number> | undefined)
    .filter((v): v is Record<string, number> => !!v && Object.keys(v).length > 0);

  if (vectors.length < 2) return 0.5;

  let totalSim = 0;
  let pairs = 0;
  for (let i = 0; i < vectors.length; i++) {
    for (let j = i + 1; j < vectors.length; j++) {
      totalSim += cosineSimilarity(vectors[i], vectors[j]);
      pairs++;
    }
  }
  return pairs > 0 ? totalSim / pairs : 0.5;
}

function scoreGoals(profiles: Profile[]): number {
  const goals = profiles.map((p) => parseGoals(p.goals));
  if (goals.length < 2) return 0.5;

  let overlap = 0;
  let pairs = 0;
  for (let i = 0; i < goals.length; i++) {
    for (let j = i + 1; j < goals.length; j++) {
      const typesA = new Set(goals[i].projectTypes);
      const typesB = new Set(goals[j].projectTypes);
      const shared = [...typesA].filter((t) => typesB.has(t)).length;
      const union = new Set([...typesA, ...typesB]).size;
      overlap += union > 0 ? shared / union : 0;
      pairs++;
    }
  }
  return pairs > 0 ? overlap / pairs : 0.5;
}

function scoreSkills(profiles: Profile[]): number {
  const allSkills = profiles.map((p) => parseSkills(p.skills));
  const primarySkills = allSkills.map((skills) =>
    skills.filter((s) => s.isPrimary).map((s) => s.name.toLowerCase()),
  );
  const allUnique = new Set(primarySkills.flat());
  const coverage = allUnique.size / Math.max(profiles.length * 2, 1);
  const redundancyPenalty = primarySkills
    .flat()
    .reduce((acc, skill) => {
      const count = primarySkills.flat().filter((s) => s === skill).length;
      return acc + (count > 1 ? 0.1 : 0);
    }, 0);
  return Math.max(0, Math.min(1, coverage - redundancyPenalty));
}

function scoreCommunication(profiles: (Profile & { assessment: Assessment | null })[]): number {
  const commScores = profiles
    .map((p) => (p.assessment?.dimensionScores as Record<string, number>)?.communication)
    .filter((s): s is number => s !== undefined);

  if (commScores.length < 2) return 0.5;
  const avg = commScores.reduce((a, b) => a + b, 0) / commScores.length;
  const variance =
    commScores.reduce((sum, s) => sum + Math.pow(s - avg, 2), 0) / commScores.length;
  return Math.max(0, 1 - variance * 2);
}

export function computeSuccessProbability(scores: DimensionScores): number {
  const weighted =
    scores.workStyleAlignment * 0.25 +
    scores.goalAlignment * 0.3 +
    scores.skillComplementarity * 0.3 +
    scores.communicationFit * 0.15;
  return Math.round(weighted * 1000) / 10;
}

function cosineSimilarity(a: Record<string, number>, b: Record<string, number>): number {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  let dot = 0;
  let magA = 0;
  let magB = 0;
  for (const key of keys) {
    const va = a[key] ?? 0;
    const vb = b[key] ?? 0;
    dot += va * vb;
    magA += va * va;
    magB += vb * vb;
  }
  if (magA === 0 || magB === 0) return 0.5;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}
