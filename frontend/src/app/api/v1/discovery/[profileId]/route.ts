import { withAuth } from '@/lib/api-handler';
import { getCandidateDetail } from '@dream-team/backend';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ profileId: string }> },
) {
  const { profileId } = await params;
  return withAuth((userId) => getCandidateDetail(userId, profileId), request);
}
