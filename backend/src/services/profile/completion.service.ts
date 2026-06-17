import type { Profile, Assessment, PastProject } from '@prisma/client';
import type { Goals, Skill } from '@dream-team/shared';

const MATERIAL_FIELDS = ['skills', 'goals'] as const;

export function parseSkills(skills: unknown): Skill[] {
  if (!Array.isArray(skills)) return [];
  return skills as Skill[];
}

export function parseGoals(goals: unknown): Goals {
  if (!goals || typeof goals !== 'object') {
    return { projectTypes: [], interests: [] };
  }
  return goals as Goals;
}

export function computeCompletionStatus(
  profile: Pick<Profile, 'skills' | 'goals'>,
  assessment: Assessment | null,
  pastProjectCount: number,
): 'draft' | 'partial' | 'complete' {
  const skills = parseSkills(profile.skills);
  const goals = parseGoals(profile.goals);
  const hasSkills = skills.length > 0;
  const hasGoals =
    goals.projectTypes.length > 0 || (goals.interests?.length ?? 0) > 0 || !!goals.timeline;
  const hasAssessment = !!assessment?.completedAt || assessment?.skipped === true;
  const hasPastProject = pastProjectCount > 0;

  if (hasSkills && hasAssessment && hasGoals && hasPastProject) return 'complete';
  if (hasSkills || hasGoals || hasAssessment || hasPastProject) return 'partial';
  return 'draft';
}

export function isMaterialChange(data: Record<string, unknown>): boolean {
  return MATERIAL_FIELDS.some((field) => field in data);
}

export type ProfileWithRelations = Profile & {
  assessment: Assessment | null;
  pastProjects: PastProject[];
};

export function toProfileResponse(profile: ProfileWithRelations) {
  return {
    id: profile.id,
    headline: profile.headline,
    bio: profile.bio,
    skills: parseSkills(profile.skills),
    experienceYears: profile.experienceYears,
    expertiseAreas: profile.expertiseAreas,
    goals: parseGoals(profile.goals),
    workStyleSummary: profile.workStyleSummary,
    completionStatus: profile.completionStatus,
    profileVersion: profile.profileVersion,
    pastProjects: profile.pastProjects.map((p) => ({
      id: p.id,
      title: p.title,
      role: p.role,
    })),
  };
}
