import type z from "zod";

/**
 * An HTTP error.
 */
export type HttpError = {
  type: "http";
  statusCode: string;
  statusText: string;
  cause?: unknown;
};

/**
 * An unknown error.
 */
export type UnknownError = {
  type: "unknown";
  cause?: unknown;
};

/**
 * A validation error.
 */
export type ValidationError = {
  type: "validation";
  details: z.ZodError;
};

/**
 * A range request error.
 */
export type RangeRequestError = {
  type: "range-request";
  message: string;
};
