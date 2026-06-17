import { withAuth } from '@/lib/api-handler';
import { skipAssessment } from '@dream-team/backend';

export async function POST(request: Request) {
  return withAuth((userId) => skipAssessment(userId), request);
}
