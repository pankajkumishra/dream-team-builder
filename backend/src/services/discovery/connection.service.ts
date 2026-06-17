import { prisma } from '../../lib/prisma';
import { Errors } from '../../lib/errors';
import type { ConnectionCreate, VisibilitySettings } from '@dream-team/shared';
import { previewCompatibility } from './preview-scorer';

export async function updateVisibility(userId: string, settings: VisibilitySettings) {
  return prisma.visibilitySettings.upsert({
    where: { userId },
    create: { userId, ...settings },
    update: settings,
  });
}

export async function createConnection(initiatorId: string, data: ConnectionCreate) {
  if (initiatorId === data.recipientId) {
    throw Errors.businessRule('Cannot connect to yourself.');
  }

  const recipient = await prisma.user.findUnique({ where: { id: data.recipientId } });
  if (!recipient) throw Errors.notFound('User');

  const existing = await prisma.connection.findUnique({
    where: {
      initiatorId_recipientId: { initiatorId, recipientId: data.recipientId },
    },
  });
  if (existing && existing.status !== 'withdrawn') {
    throw Errors.conflict('Connection request already exists.');
  }

  const [initiatorProfile, recipientProfile] = await Promise.all([
    prisma.profile.findUnique({ where: { userId: initiatorId }, include: { assessment: true } }),
    prisma.profile.findUnique({
      where: { userId: data.recipientId },
      include: { assessment: true },
    }),
  ]);

  const preview =
    initiatorProfile && recipientProfile
      ? previewCompatibility(initiatorProfile, recipientProfile)
      : { score: 0, highlights: [], frictionPoints: [] };

  const connection = await prisma.connection.create({
    data: {
      initiatorId,
      recipientId: data.recipientId,
      message: data.message,
      compatibilityPreview: preview,
    },
  });

  return {
    id: connection.id,
    status: connection.status,
    createdAt: connection.createdAt.toISOString(),
  };
}

export async function updateConnection(
  userId: string,
  connectionId: string,
  status: 'accepted' | 'declined' | 'withdrawn',
) {
  const connection = await prisma.connection.findUnique({ where: { id: connectionId } });
  if (!connection) throw Errors.notFound('Connection');

  const isRecipient = connection.recipientId === userId;
  const isInitiator = connection.initiatorId === userId;

  if (status === 'withdrawn' && !isInitiator) throw Errors.forbidden();
  if ((status === 'accepted' || status === 'declined') && !isRecipient) {
    throw Errors.forbidden();
  }

  const updated = await prisma.connection.update({
    where: { id: connectionId },
    data: { status, respondedAt: new Date() },
  });

  return {
    id: updated.id,
    status: updated.status,
    createdAt: updated.createdAt.toISOString(),
    respondedAt: updated.respondedAt?.toISOString() ?? null,
  };
}

export async function listConnections(
  userId: string,
  options: { direction?: string; status?: string },
) {
  const where: Record<string, unknown> = {};
  if (options.direction === 'inbox') where.recipientId = userId;
  else if (options.direction === 'sent') where.initiatorId = userId;
  else where.OR = [{ initiatorId: userId }, { recipientId: userId }];

  if (options.status) where.status = options.status;

  const connections = await prisma.connection.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });

  return connections.map((c) => ({
    id: c.id,
    status: c.status,
    initiatorId: c.initiatorId,
    recipientId: c.recipientId,
    message: c.message,
    compatibilityPreview: c.compatibilityPreview,
    createdAt: c.createdAt.toISOString(),
    respondedAt: c.respondedAt?.toISOString() ?? null,
  }));
}
