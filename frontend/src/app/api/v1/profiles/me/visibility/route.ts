import { withAuth } from '@/lib/api-handler';
import { updateVisibility } from '@dream-team/backend';
import { VisibilitySettingsSchema } from '@dream-team/shared';

export async function PUT(request: Request) {
  return withAuth(async (userId, req) => {
    const body = await req.json();
    const data = VisibilitySettingsSchema.parse(body);
    return updateVisibility(userId, data);
  }, request);
}
