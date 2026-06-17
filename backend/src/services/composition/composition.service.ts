import { prisma } from '../../lib/prisma';
import { Errors } from '../../lib/errors';
import type { CompositionCreate } from '@dream-team/shared';
import { ROLE_TEMPLATES } from './role-templates';
import { analyzeGaps } from './gap-analyzer';
import { generateText } from '../../lib/llm';

export async function createComposition(requesterId: string, data: CompositionCreate) {
  const profile = await prisma.profile.findUnique({ where: { userId: requesterId } });
  if (!profile) throw Errors.notFound('Profile');

  const projectIntent = await prisma.projectIntent.create({
    data: {
      profileId: profile.id,
      title: data.projectIntent.title,
      domain: data.projectIntent.domain,
      stage: data.projectIntent.stage,
      description: data.projectIntent.description,
      timeline: data.projectIntent.timeline,
      goals: data.projectIntent.goals,
    },
  });

  const existingProfiles = data.existingMemberProfileIds?.length
    ? await prisma.profile.findMany({
        where: { id: { in: data.existingMemberProfileIds } },
      })
    : [];

  const templates = ROLE_TEMPLATES[data.projectIntent.domain];
  const { filledRoles, gapRoles } = analyzeGaps(templates, existingProfiles);

  const recommendedRoles = templates.map((role) => ({
    ...role,
    rationale: `Recommended for ${data.projectIntent.domain} projects at ${data.projectIntent.stage} stage.`,
  }));

  const insights = [
    `For a ${data.projectIntent.timeline ?? 'new'} ${data.projectIntent.domain} project, aim for ${templates.length} core roles.`,
    gapRoles.length > 0
      ? `Priority gap: ${gapRoles[0].title} — common failure pattern when this role is missing.`
      : 'Your current team covers the core role template.',
    'Discuss commitment levels and timeline expectations with all members before starting.',
    data.projectIntent.stage === 'idea'
      ? 'Validate your idea with users before scaling the team.'
      : 'Focus on execution roles that match your current stage.',
  ].slice(0, 4);

  const rationale = await generateText(
    `Summarize in 2-3 sentences why this team composition fits a ${data.projectIntent.domain} project: "${data.projectIntent.description}"`,
    'Plain language for non-technical founders.',
  );

  const recommendation = await prisma.compositionRecommendation.create({
    data: {
      requesterId,
      projectIntentId: projectIntent.id,
      existingMemberProfileIds: data.existingMemberProfileIds ?? [],
      recommendedRoles,
      filledRoles,
      gapRoles,
      insights,
      rationale,
    },
  });

  return {
    id: recommendation.id,
    recommendedRoles,
    filledRoles,
    gapRoles,
    insights,
    rationale,
  };
}
