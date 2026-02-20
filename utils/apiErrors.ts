// /standardflow/utils/apiErrors.ts
import { NextResponse } from "next/server";

export type ApiErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "VALIDATION_ERROR"
  | "INTERNAL_SERVER_ERROR";

export interface ApiErrorResponse {
  success: false;
  error: {
    code: ApiErrorCode;
    message: string;
    details?: unknown;
  };
}

/**
 * Standardized API error response helper
 */
export function apiError(
  status: number,
  code: ApiErrorCode,
  message: string,
  details?: unknown
) {
    const error: ApiErrorResponse["error"] = {
        code,
        message,
    };

    if (details !== undefined) {
        error.details = details;
    }

  return NextResponse.json<ApiErrorResponse>(
    {
      success: false,
      error,
    },
    { status }
  );
}

/**
 * Common shortcuts
 */
export const badRequest = (message = "Bad request", details?: unknown) =>
  apiError(400, "BAD_REQUEST", message, details);

export const unauthorized = (message = "Unauthorized") =>
  apiError(401, "UNAUTHORIZED", message);

export const forbidden = (message = "Forbidden") =>
  apiError(403, "FORBIDDEN", message);

export const notFound = (message = "Resource not found") =>
  apiError(404, "NOT_FOUND", message);

export const conflict = (message = "Conflict") =>
  apiError(409, "CONFLICT", message);

export const validationError = (details: unknown, message = "Validation failed") =>
  apiError(422, "VALIDATION_ERROR", message, details);

export const internalServerError = (
  message = "Internal server error",
  details?: unknown
) => apiError(500, "INTERNAL_SERVER_ERROR", message, details);

