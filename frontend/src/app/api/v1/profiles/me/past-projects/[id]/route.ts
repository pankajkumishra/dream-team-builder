import { withAuth } from '@/lib/api-handler';
import { deletePastProject } from '@dream-team/backend';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return withAuth((userId) => deletePastProject(userId, id), request);
}
