import { withAuth } from '@/lib/api-handler';
import { getAnalysis } from '@dream-team/backend';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return withAuth((userId) => getAnalysis(id, userId), request);
}
