import { z, type ZodType, type ZodSchema } from "zod";
import { APIError } from "./errors";

type Output<T extends ZodSchema> = z.output<T>;

export function validateBody<S extends ZodSchema>(schema: S, body: unknown): Output<S> {
  const result = schema.safeParse(body);
  if (!result.success) {
    throw new APIError("Validation failed", 400, "VALIDATION_ERROR", result.error.flatten());
  }
  return result.data;
}

export function validateQuery<S extends ZodSchema>(
  schema: S,
  query: Record<string, string | string[]>,
): Output<S> {
  const result = schema.safeParse(query);
  if (!result.success) {
    throw new APIError("Invalid query parameters", 400, "VALIDATION_ERROR", result.error.flatten());
  }
  return result.data;
}

// Common validation schemas

export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(20),
});

export const idParamSchema = z.object({
  id: z.string().uuid("Invalid ID format"),
});
