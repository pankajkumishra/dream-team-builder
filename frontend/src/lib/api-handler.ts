import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { toErrorResponse } from '@dream-team/backend';

export async function withAuth<T>(
  handler: (userId: string, request: Request) => Promise<T>,
  request: Request,
): Promise<NextResponse> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 },
      );
    }
    const result = await handler(session.user.id, request);
    return NextResponse.json(result);
  } catch (error) {
    const { status, body } = toErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}

export async function parseJson<T>(request: Request): Promise<T> {
  return request.json() as Promise<T>;
}
