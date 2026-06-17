import { prisma } from '../../lib/prisma';
import { Errors } from '../../lib/errors';
import type { PastProjectCreate } from '@dream-team/shared';
import { computeCompletionStatus } from './completion.service';

export async function createPastProject(userId: string, data: PastProjectCreate) {
  const profile = await prisma.profile.findUnique({ where: { userId } });
  if (!profile) throw Errors.notFound('Profile');

  const project = await prisma.pastProject.create({
    data: {
      profileId: profile.id,
      title: data.title,
      description: data.description,
      role: data.role,
      outcome: data.outcome,
      teamSize: data.teamSize,
      highlights: data.highlights ?? [],
    },
  });

  await refreshCompletionStatus(profile.id);
  return project;
}

export async function deletePastProject(userId: string, projectId: string) {
  const profile = await prisma.profile.findUnique({ where: { userId } });
  if (!profile) throw Errors.notFound('Profile');

  const project = await prisma.pastProject.findFirst({
    where: { id: projectId, profileId: profile.id },
  });
  if (!project) throw Errors.notFound('Past project');

  await prisma.pastProject.delete({ where: { id: projectId } });
  await refreshCompletionStatus(profile.id);
}

async function refreshCompletionStatus(profileId: string) {
  const profile = await prisma.profile.findUnique({
    where: { id: profileId },
    include: { assessment: true, pastProjects: true },
  });
  if (!profile) return;

  const status = computeCompletionStatus(
    profile,
    profile.assessment,
    profile.pastProjects.length,
  );
  await prisma.profile.update({
    where: { id: profileId },
    data: { completionStatus: status },
  });
}
