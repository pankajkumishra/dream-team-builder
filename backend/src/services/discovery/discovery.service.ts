import { prisma } from '../../lib/prisma';
import { Errors } from '../../lib/errors';
import { previewCompatibility } from './preview-scorer';
import { parseGoals, parseSkills } from '../profile/completion.service';

export async function discoverProfiles(
  userId: string,
  options: { skills?: string; projectType?: string; limit?: number; offset?: number },
) {
  const viewer = await prisma.profile.findUnique({
    where: { userId },
    include: { assessment: true },
  });
  if (!viewer) throw Errors.notFound('Profile');

  const limit = Math.min(options.limit ?? 20, 50);
  const offset = options.offset ?? 0;

  const candidates = await prisma.profile.findMany({
    where: {
      userId: { not: userId },
      completionStatus: 'complete',
      user: { visibilitySettings: { discoverable: true } },
    },
    include: { assessment: true, user: { include: { visibilitySettings: true } } },
    take: limit,
    skip: offset,
  });

  let filtered = candidates;
  if (options.skills) {
    const skillFilter = options.skills.toLowerCase().split(',');
    filtered = candidates.filter((c) => {
      const skills = parseSkills(c.skills).map((s) => s.name.toLowerCase());
      return skillFilter.some((sf) => skills.some((s) => s.includes(sf.trim())));
    });
  }

  if (options.projectType) {
    filtered = filtered.filter((c) => {
      const goals = parseGoals(c.goals);
      return goals.projectTypes.includes(options.projectType!);
    });
  }

  const results = filtered.map((candidate) => {
    const preview = previewCompatibility(viewer, candidate);
    const settings = candidate.user.visibilitySettings;
    return {
      profileId: candidate.id,
      headline: candidate.headline,
      compatibilityPreview: preview,
      showSkills: settings?.showSkills ?? true,
      showGoals: settings?.showGoals ?? true,
    };
  });

  results.sort((a, b) => b.compatibilityPreview.score - a.compatibilityPreview.score);

  return {
    results,
    total: results.length,
    guidance:
      results.length === 0
        ? 'No matches found. Try broadening skill filters or invite teammates to join.'
        : undefined,
  };
}

export async function getCandidateDetail(viewerUserId: string, profileId: string) {
  const viewer = await prisma.profile.findUnique({
    where: { userId: viewerUserId },
    include: { assessment: true },
  });
  if (!viewer) throw Errors.notFound('Profile');

  const candidate = await prisma.profile.findUnique({
    where: { id: profileId },
    include: { assessment: true, user: { include: { visibilitySettings: true } } },
  });
  if (!candidate) throw Errors.notFound('Profile');
  if (!candidate.user.visibilitySettings?.discoverable) {
    throw Errors.forbidden('This profile is not discoverable');
  }

  const preview = previewCompatibility(viewer, candidate);
  const settings = candidate.user.visibilitySettings;
  const goals = parseGoals(candidate.goals);

  return {
    profileId: candidate.id,
    headline: candidate.headline,
    skills: settings.showSkills ? parseSkills(candidate.skills) : [],
    goals: settings.showGoals ? goals : { projectTypes: [], interests: [] },
    workStyleSummary: settings.showAssessmentSummary ? candidate.workStyleSummary : null,
    compatibilityPreview: preview,
  };
}
