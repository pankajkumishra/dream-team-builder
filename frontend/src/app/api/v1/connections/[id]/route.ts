import { withAuth } from '@/lib/api-handler';
import { updateConnection } from '@dream-team/backend';
import { ConnectionUpdateSchema } from '@dream-team/shared';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return withAuth(async (userId, req) => {
    const body = await req.json();
    const { status } = ConnectionUpdateSchema.parse(body);
    return updateConnection(userId, id, status);
  }, request);
}
