import { withAuth } from '@/lib/api-handler';
import { createAnalysis, listAnalyses } from '@dream-team/backend';
import { TeamAnalysisCreateSchema } from '@dream-team/shared';

export async function GET(request: Request) {
  return withAuth((userId) => listAnalyses(userId), request);
}

export async function POST(request: Request) {
  return withAuth(async (userId, req) => {
    const body = await req.json();
    const data = TeamAnalysisCreateSchema.parse(body);
    return createAnalysis(userId, data);
  }, request);
}
