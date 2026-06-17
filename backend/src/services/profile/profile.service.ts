import { prisma } from '../../lib/prisma';
import { Errors } from '../../lib/errors';
import type { ProfileUpdate } from '@dream-team/shared';
import {
  computeCompletionStatus,
  isMaterialChange,
  toProfileResponse,
  type ProfileWithRelations,
} from './completion.service';

async function getProfileWithRelations(userId: string): Promise<ProfileWithRelations> {
  let profile = await prisma.profile.findUnique({
    where: { userId },
    include: { assessment: true, pastProjects: true },
  });

  if (!profile) {
    profile = await prisma.profile.create({
      data: { userId },
      include: { assessment: true, pastProjects: true },
    });
  }

  return profile;
}

export async function getMyProfile(userId: string) {
  const profile = await getProfileWithRelations(userId);
  return toProfileResponse(profile);
}

export async function updateMyProfile(userId: string, data: ProfileUpdate) {
  const existing = await getProfileWithRelations(userId);
  const material = isMaterialChange(data as Record<string, unknown>);

  const updated = await prisma.profile.update({
    where: { id: existing.id },
    data: {
      ...(data.headline !== undefined && { headline: data.headline }),
      ...(data.bio !== undefined && { bio: data.bio }),
      ...(data.skills !== undefined && { skills: data.skills }),
      ...(data.experienceYears !== undefined && { experienceYears: data.experienceYears }),
      ...(data.expertiseAreas !== undefined && { expertiseAreas: data.expertiseAreas }),
      ...(data.goals !== undefined && { goals: data.goals }),
      ...(material && { profileVersion: { increment: 1 } }),
    },
    include: { assessment: true, pastProjects: true },
  });

  if (material) {
    await markAnalysesStaleForProfile(updated.id);
  }

  const completionStatus = computeCompletionStatus(
    updated,
    updated.assessment,
    updated.pastProjects.length,
  );

  if (completionStatus !== updated.completionStatus) {
    const final = await prisma.profile.update({
      where: { id: updated.id },
      data: { completionStatus },
      include: { assessment: true, pastProjects: true },
    });
    return toProfileResponse(final);
  }

  return toProfileResponse(updated);
}

export async function getProfileById(profileId: string, requesterId: string) {
  const profile = await prisma.profile.findUnique({
    where: { id: profileId },
    include: {
      assessment: true,
      pastProjects: true,
      user: { include: { visibilitySettings: true } },
    },
  });

  if (!profile) throw Errors.notFound('Profile');

  const isOwner = profile.userId === requesterId;
  const settings = profile.user.visibilitySettings;
  const connection = await prisma.connection.findFirst({
    where: {
      status: 'accepted',
      OR: [
        { initiatorId: requesterId, recipientId: profile.userId },
        { initiatorId: profile.userId, recipientId: requesterId },
      ],
    },
  });

  if (!isOwner && !settings?.discoverable && !connection) {
    throw Errors.forbidden('This profile is not publicly visible');
  }

  return toProfileResponse(profile);
}

export async function markAnalysesStaleForProfile(profileId: string) {
  const analyses = await prisma.teamAnalysis.findMany({
    where: {
      memberProfileIds: { has: profileId },
      status: 'complete',
    },
  });

  const profile = await prisma.profile.findUnique({ where: { id: profileId } });
  if (!profile) return;

  for (const analysis of analyses) {
    const versions = analysis.memberProfileVersions as Record<string, number>;
    if (versions[profileId] !== profile.profileVersion) {
      await prisma.teamAnalysis.update({
        where: { id: analysis.id },
        data: { status: 'stale' },
      });
    }
  }
}
