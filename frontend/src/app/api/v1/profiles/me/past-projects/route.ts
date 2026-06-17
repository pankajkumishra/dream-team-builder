import { withAuth } from '@/lib/api-handler';
import { createPastProject } from '@dream-team/backend';
import { PastProjectCreateSchema } from '@dream-team/shared';

export async function POST(request: Request) {
  return withAuth(async (userId, req) => {
    const body = await req.json();
    const data = PastProjectCreateSchema.parse(body);
    return createPastProject(userId, data);
  }, request);
}
