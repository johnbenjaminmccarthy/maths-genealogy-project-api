import type { HttpError, RangeRequestError, UnknownError, ValidationError } from "./error.js";
import type { RangeResult } from "./range-result.js";
import type { Result } from "./result.js";

/**
 * A single page of results from a paginated fetch, with a `next` method to fetch the subsequent page.
 *
 * Consumers control the rate of fetching by choosing when to call `next()`.
 */
export type PagedResult<T> = RangeResult<T> & {
  hasNextPage: boolean;
  next: () => Promise<
    Result<PagedResult<T>, HttpError | UnknownError | ValidationError | RangeRequestError>
  >;
};
