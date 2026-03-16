/**
 * A successful result.
 */
export type ResultSuccess<T> = {
  ok: true;
  value: T;
};

/**
 * A failure result.
 */
export type ResultFailure<E> = {
  ok: false;
  error: E;
};

/**
 * A result, consisting of a success or failure.
 */
export type Result<T, E = unknown> = ResultSuccess<T> | ResultFailure<E>;

/**
 * Check if a result is successful.
 *
 * Asserts the type of the result to ResultSuccess if true.
 *
 * @param result The result to check.
 * @returns      True if the result is successful, false otherwise.
 */
export function isSuccess<T, E = unknown>(result: Result<T, E>): result is ResultSuccess<T> {
  return result.ok === true;
}

/**
 * Check if a result is a failure.
 *
 * Asserts the type of the result to ResultFailure if true.
 *
 * @param result The result to check.
 * @returns      True if the result is a failure, false otherwise.
 */
export function isFailure<T, E = unknown>(result: Result<T, E>): result is ResultFailure<E> {
  return result.ok === false;
}

/**
 * Create a successful result.
 *
 * @param value The value to create a successful result for.
 * @returns     A successful result.
 */
export function success<T>(value: T): ResultSuccess<T> {
  return { ok: true, value };
}

/**
 * Create a failed result.
 *
 * @param error The error to create a failed result for.
 * @returns     A failed result.
 */
export function failure<E>(error: E): ResultFailure<E> {
  return { ok: false, error };
}

/**
 * Unwrap a result.
 *
 * @param result The result to unwrap.
 * @returns      The value of the result.
 */
export function unwrapResult<T, E = unknown>(result: Result<T, E>): T {
  if (isSuccess(result)) {
    return result.value;
  } else {
    throw new Error(`Result is a failure: ${JSON.stringify(result.error, null, 2)}`);
  }
}
