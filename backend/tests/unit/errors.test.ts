import { describe, it, expect } from 'vitest';
import { AppError, toErrorResponse } from '../../src/lib/errors';

describe('errors', () => {
  it('maps AppError to response', () => {
    const err = new AppError('VALIDATION_ERROR', 'Invalid input', 400);
    const { status, body } = toErrorResponse(err);
    expect(status).toBe(400);
    expect(body.error.code).toBe('VALIDATION_ERROR');
  });

  it('hides internal error details', () => {
    const { status, body } = toErrorResponse(new Error('secret stack trace'));
    expect(status).toBe(500);
    expect(body.error.message).not.toContain('stack');
  });
});
