import { withAuth } from '@/lib/api-handler';
import { getMyProfile, updateMyProfile } from '@dream-team/backend';
import { ProfileUpdateSchema } from '@dream-team/shared';

export async function GET(request: Request) {
  return withAuth((userId) => getMyProfile(userId), request);
}

export async function PATCH(request: Request) {
  return withAuth(async (userId, req) => {
    const body = await req.json();
    const data = ProfileUpdateSchema.parse(body);
    return updateMyProfile(userId, data);
  }, request);
}
