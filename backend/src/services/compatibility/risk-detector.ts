import type { Profile, Assessment } from '@prisma/client';
import { parseGoals, parseSkills } from '../profile/completion.service';
import type { DimensionScores } from './scorer';

export interface RiskFlag {
  type:
    | 'skill_gap'
    | 'skill_redundancy'
    | 'goal_conflict'
    | 'work_style_clash'
    | 'incomplete_profile'
    | 'low_confidence';
  severity: 'low' | 'medium' | 'high';
  explanation: string;
}

export function detectRisks(
  profiles: (Profile & { assessment: Assessment | null })[],
  scores: DimensionScores,
): RiskFlag[] {
  const flags: RiskFlag[] = [];

  flags.push(...detectSkillRisks(profiles));
  flags.push(...detectGoalConflicts(profiles));
  flags.push(...detectWorkStyleClashes(scores));
  flags.push(...detectIncompleteProfiles(profiles));

  return flags;
}

function detectSkillRisks(profiles: Profile[]): RiskFlag[] {
  const flags: RiskFlag[] = [];
  const primaryBySkill: Record<string, number> = {};

  for (const profile of profiles) {
    for (const skill of parseSkills(profile.skills).filter((s) => s.isPrimary)) {
      const key = skill.name.toLowerCase();
      primaryBySkill[key] = (primaryBySkill[key] ?? 0) + 1;
    }
  }

  const redundant = Object.entries(primaryBySkill).filter(([, count]) => count >= 2);
  if (redundant.length > 0) {
    const skills = redundant.map(([s]) => s).join(', ');
    flags.push({
      type: 'skill_redundancy',
      severity: redundant.some(([, c]) => c >= 3) ? 'high' : 'medium',
      explanation: `Multiple members list the same primary skills (${skills}); consider diversifying expertise.`,
    });
  }

  const allPrimary = new Set(Object.keys(primaryBySkill));
  const commonGaps = ['backend', 'frontend', 'design', 'marketing'].filter(
    (area) => !allPrimary.has(area) && !allPrimary.has(area.replace('-', '')),
  );
  if (commonGaps.length >= 2) {
    flags.push({
      type: 'skill_gap',
      severity: 'medium',
      explanation: `No primary coverage detected for key areas. Consider adding members with complementary skills.`,
    });
  }

  return flags;
}

function detectGoalConflicts(profiles: Profile[]): RiskFlag[] {
  const timelines = profiles.map((p) => parseGoals(p.goals).timeline?.toLowerCase() ?? '');
  const hasShort = timelines.some((t) => t.includes('month') || t.includes('quick') || t.includes('exit'));
  const hasLong = timelines.some((t) => t.includes('year') || t.includes('research') || t.includes('long'));

  if (hasShort && hasLong) {
    return [
      {
        type: 'goal_conflict',
        severity: 'high',
        explanation:
          'Team members have conflicting timelines (short-term vs. long-term). Discuss commitment and exit expectations before committing.',
      },
    ];
  }
  return [];
}

function detectWorkStyleClashes(scores: DimensionScores): RiskFlag[] {
  if (scores.workStyleAlignment < 0.4) {
    return [
      {
        type: 'work_style_clash',
        severity: 'medium',
        explanation:
          'Work-style alignment is low. Team members may have different preferences for pace, collaboration, and communication.',
      },
    ];
  }
  return [];
}

function detectIncompleteProfiles(
  profiles: (Profile & { assessment: Assessment | null })[],
): RiskFlag[] {
  const incomplete = profiles.filter(
    (p) => p.completionStatus !== 'complete' || p.assessment?.skipped,
  );
  if (incomplete.length > 0) {
    return [
      {
        type: 'incomplete_profile',
        severity: 'low',
        explanation: `${incomplete.length} member(s) have incomplete profiles or skipped the assessment, reducing prediction confidence.`,
      },
    ];
  }
  return [];
}
