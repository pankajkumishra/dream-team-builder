import { withAuth } from '@/lib/api-handler';
import { discoverProfiles } from '@dream-team/backend';

export async function GET(request: Request) {
  return withAuth(async (userId, req) => {
    const { searchParams } = new URL(req.url);
    return discoverProfiles(userId, {
      skills: searchParams.get('skills') ?? undefined,
      projectType: searchParams.get('projectType') ?? undefined,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : undefined,
      offset: searchParams.get('offset') ? Number(searchParams.get('offset')) : undefined,
    });
  }, request);
}
