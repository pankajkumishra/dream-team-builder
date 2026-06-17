import { z } from 'zod';

export const ApiErrorCodeSchema = z.enum([
  'VALIDATION_ERROR',
  'UNAUTHORIZED',
  'FORBIDDEN',
  'NOT_FOUND',
  'CONFLICT',
  'BUSINESS_RULE_VIOLATION',
  'INTERNAL_ERROR',
]);

export const ApiErrorDetailSchema = z.object({
  field: z.string().optional(),
  message: z.string(),
});

export const ApiErrorResponseSchema = z.object({
  error: z.object({
    code: ApiErrorCodeSchema,
    message: z.string(),
    details: z.array(ApiErrorDetailSchema).optional(),
  }),
});

export type ApiErrorCode = z.infer<typeof ApiErrorCodeSchema>;
export type ApiErrorResponse = z.infer<typeof ApiErrorResponseSchema>;
