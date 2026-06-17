import { withAuth } from '@/lib/api-handler';
import { createComposition } from '@dream-team/backend';
import { CompositionCreateSchema } from '@dream-team/shared';

export async function POST(request: Request) {
  return withAuth(async (userId, req) => {
    const body = await req.json();
    const data = CompositionCreateSchema.parse(body);
    return createComposition(userId, data);
  }, request);
}
