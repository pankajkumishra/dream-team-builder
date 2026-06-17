import type { ApiErrorCode } from '@dream-team/shared';

export class AppError extends Error {
  constructor(
    public readonly code: ApiErrorCode,
    message: string,
    public readonly status: number,
    public readonly details?: { field?: string; message: string }[],
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function toErrorResponse(error: unknown): {
  status: number;
  body: { error: { code: ApiErrorCode; message: string; details?: { field?: string; message: string }[] } };
} {
  if (error instanceof AppError) {
    return {
      status: error.status,
      body: {
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
      },
    };
  }

  console.error('Unhandled error:', error);
  return {
    status: 500,
    body: {
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred. Please try again later.',
      },
    },
  };
}

export const Errors = {
  unauthorized: () => new AppError('UNAUTHORIZED', 'Authentication required', 401),
  forbidden: (msg = 'Access denied') => new AppError('FORBIDDEN', msg, 403),
  notFound: (resource: string) => new AppError('NOT_FOUND', `${resource} not found`, 404),
  validation: (details: { field?: string; message: string }[]) =>
    new AppError('VALIDATION_ERROR', 'Invalid input', 400, details),
  conflict: (msg: string) => new AppError('CONFLICT', msg, 409),
  businessRule: (msg: string) => new AppError('BUSINESS_RULE_VIOLATION', msg, 422),
};
