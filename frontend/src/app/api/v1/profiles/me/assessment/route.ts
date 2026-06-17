import { withAuth } from '@/lib/api-handler';
import { getAssessment, updateAssessment } from '@dream-team/backend';
import { AssessmentUpdateSchema } from '@dream-team/shared';

export async function GET(request: Request) {
  return withAuth((userId) => getAssessment(userId), request);
}

export async function PUT(request: Request) {
  return withAuth(async (userId, req) => {
    const body = await req.json();
    const data = AssessmentUpdateSchema.parse(body);
    return updateAssessment(userId, data);
  }, request);
}
