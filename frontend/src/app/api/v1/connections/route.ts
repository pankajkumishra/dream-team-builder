import { withAuth } from '@/lib/api-handler';
import { createConnection, listConnections } from '@dream-team/backend';
import { ConnectionCreateSchema } from '@dream-team/shared';

export async function GET(request: Request) {
  return withAuth(async (userId, req) => {
    const { searchParams } = new URL(req.url);
    return listConnections(userId, {
      direction: searchParams.get('direction') ?? undefined,
      status: searchParams.get('status') ?? undefined,
    });
  }, request);
}

export async function POST(request: Request) {
  return withAuth(async (userId, req) => {
    const body = await req.json();
    const data = ConnectionCreateSchema.parse(body);
    return createConnection(userId, data);
  }, request);
}
