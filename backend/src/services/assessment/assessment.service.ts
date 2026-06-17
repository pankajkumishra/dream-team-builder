import { prisma } from '../../lib/prisma';
import { Errors } from '../../lib/errors';
import type { AssessmentUpdate } from '@dream-team/shared';
import { ASSESSMENT_QUESTIONS, computeDimensionScores, type WorkStyleDimension } from './questions';
import { generateWorkStyleSummary } from './summary.generator';
import { computeCompletionStatus } from '../profile/completion.service';
import { markAnalysesStaleForProfile } from '../profile/profile.service';

export async function getAssessment(userId: string) {
  const profile = await prisma.profile.findUnique({
    where: { userId },
    include: { assessment: true },
  });
  if (!profile) throw Errors.notFound('Profile');

  if (!profile.assessment) {
    return {
      questions: ASSESSMENT_QUESTIONS,
      completedAt: null,
      skipped: false,
      dimensionScores: {},
      responses: {},
    };
  }

  return {
    questions: ASSESSMENT_QUESTIONS,
    completedAt: profile.assessment.completedAt?.toISOString() ?? null,
    skipped: profile.assessment.skipped,
    dimensionScores: profile.assessment.dimensionScores as Record<string, number>,
    responses: profile.assessment.responses as Record<string, number>,
  };
}

export async function updateAssessment(userId: string, data: AssessmentUpdate) {
  const profile = await prisma.profile.findUnique({
    where: { userId },
    include: { assessment: true, pastProjects: true },
  });
  if (!profile) throw Errors.notFound('Profile');

  const dimensionScores: Record<WorkStyleDimension, number> = data.submit
    ? computeDimensionScores(data.responses)
    : ({} as Record<WorkStyleDimension, number>);
  let workStyleSummary = profile.workStyleSummary;

  if (data.submit) {
    workStyleSummary = await generateWorkStyleSummary(dimensionScores);
    await markAnalysesStaleForProfile(profile.id);
  }

  const assessment = await prisma.assessment.upsert({
    where: { profileId: profile.id },
    create: {
      profileId: profile.id,
      responses: data.responses,
      dimensionScores,
      completedAt: data.submit ? new Date() : null,
      skipped: false,
    },
    update: {
      responses: data.responses,
      ...(data.submit && {
        dimensionScores,
        completedAt: new Date(),
        skipped: false,
      }),
    },
  });

  if (data.submit) {
    await prisma.profile.update({
      where: { id: profile.id },
      data: {
        workStyleSummary,
        profileVersion: { increment: 1 },
        completionStatus: computeCompletionStatus(
          profile,
          assessment,
          profile.pastProjects.length,
        ),
      },
    });
  }

  return {
    completedAt: assessment.completedAt?.toISOString() ?? null,
    skipped: assessment.skipped,
    dimensionScores: assessment.dimensionScores as Record<string, number>,
    workStyleSummary: data.submit ? workStyleSummary : profile.workStyleSummary,
  };
}

export async function skipAssessment(userId: string) {
  const profile = await prisma.profile.findUnique({
    where: { userId },
    include: { pastProjects: true },
  });
  if (!profile) throw Errors.notFound('Profile');

  const assessment = await prisma.assessment.upsert({
    where: { profileId: profile.id },
    create: { profileId: profile.id, skipped: true },
    update: { skipped: true, completedAt: null },
  });

  const completionStatus = computeCompletionStatus(profile, assessment, profile.pastProjects.length);
  await prisma.profile.update({
    where: { id: profile.id },
    data: { completionStatus },
  });

  return { skipped: true };
}
