import { prisma } from '../../lib/prisma';
import { Errors } from '../../lib/errors';
import type { TeamAnalysisCreate } from '@dream-team/shared';
import { scoreTeam, computeSuccessProbability } from './scorer';
import { detectRisks } from './risk-detector';
import { computeConfidence } from './confidence';
import { generateExplanations } from './explanation.generator';

export async function createAnalysis(requesterId: string, data: TeamAnalysisCreate) {
  if (data.memberProfileIds.length < 2) {
    throw Errors.businessRule(
      'Team analysis requires at least two profiles. Invite another teammate or complete another profile to continue.',
    );
  }

  const profiles = await prisma.profile.findMany({
    where: { id: { in: data.memberProfileIds } },
    include: { assessment: true },
  });

  if (profiles.length !== data.memberProfileIds.length) {
    throw Errors.notFound('One or more profiles');
  }

  const userIds = profiles.map((p) => p.userId);
  if (new Set(userIds).size !== userIds.length) {
    throw Errors.conflict('Cannot analyze the same person twice in one team analysis.');
  }

  const memberProfileVersions = Object.fromEntries(
    profiles.map((p) => [p.id, p.profileVersion]),
  );

  const analysis = await prisma.teamAnalysis.create({
    data: {
      requesterId,
      projectIntentId: data.projectIntentId,
      memberProfileIds: data.memberProfileIds,
      memberProfileVersions,
      status: 'pending',
    },
  });

  await runAnalysis(analysis.id);
  return getAnalysis(analysis.id, requesterId);
}

async function runAnalysis(analysisId: string) {
  const analysis = await prisma.teamAnalysis.findUnique({ where: { id: analysisId } });
  if (!analysis) return;

  const profiles = await prisma.profile.findMany({
    where: { id: { in: analysis.memberProfileIds } },
    include: { assessment: true },
  });

  const dimensionScores = scoreTeam(profiles);
  const successProbability = computeSuccessProbability(dimensionScores);
  const riskFlags = detectRisks(profiles, dimensionScores);
  const confidenceLevel = computeConfidence(profiles);
  const explanations = await generateExplanations(dimensionScores, riskFlags, successProbability);

  if (confidenceLevel === 'low') {
    riskFlags.push({
      type: 'low_confidence',
      severity: 'medium',
      explanation: 'Prediction confidence is low due to incomplete profile data or skipped assessments.',
    });
  }

  await prisma.teamAnalysis.update({
    where: { id: analysisId },
    data: {
      dimensionScores: dimensionScores as object,
      successProbability,
      confidenceLevel,
      riskFlags: riskFlags as object[],
      explanations: explanations as object,
      status: 'complete',
      completedAt: new Date(),
    },
  });
}

export async function getAnalysis(analysisId: string, requesterId: string) {
  const analysis = await prisma.teamAnalysis.findUnique({ where: { id: analysisId } });
  if (!analysis) throw Errors.notFound('Analysis');
  if (analysis.requesterId !== requesterId) throw Errors.forbidden();

  const profiles = await prisma.profile.findMany({
    where: { id: { in: analysis.memberProfileIds } },
    select: { id: true, headline: true, profileVersion: true },
  });

  let status = analysis.status;
  let staleReason: string | undefined;

  if (status === 'complete') {
    const versions = analysis.memberProfileVersions as Record<string, number>;
    const staleMembers = profiles.filter((p) => versions[p.id] !== p.profileVersion);
    if (staleMembers.length > 0) {
      status = 'stale';
      staleReason = `Profile data changed for ${staleMembers.length} team member(s) since this analysis was run.`;
      await prisma.teamAnalysis.update({ where: { id: analysisId }, data: { status: 'stale' } });
    }
  }

  return {
    id: analysis.id,
    status,
    memberProfiles: profiles.map((p) => ({ id: p.id, headline: p.headline })),
    dimensionScores: analysis.dimensionScores as Record<string, number>,
    successProbability: analysis.successProbability,
    confidenceLevel: analysis.confidenceLevel,
    riskFlags: analysis.riskFlags as unknown[],
    explanations: analysis.explanations as Record<string, string>,
    staleReason,
    createdAt: analysis.createdAt.toISOString(),
    completedAt: analysis.completedAt?.toISOString() ?? null,
  };
}

export async function listAnalyses(requesterId: string) {
  const analyses = await prisma.teamAnalysis.findMany({
    where: { requesterId },
    orderBy: { createdAt: 'desc' },
  });
  return analyses.map((a) => ({
    id: a.id,
    status: a.status,
    successProbability: a.successProbability,
    createdAt: a.createdAt.toISOString(),
  }));
}
