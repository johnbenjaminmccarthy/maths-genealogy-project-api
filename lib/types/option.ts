/**
 * A some option type.
 */
export type Some<T> = {
  kind: "some";
  value: T;
};

/**
 * A none option type.
 */
export type None = {
  kind: "none";
};

/**
 * An optional value, consisting of a kind and a value.
 */
export type Option<T> = Some<T> | None;

/**
 * Check if an option is some.
 *
 * Asserts the type of the option to Some if true.
 *
 * @param option The option to check.
 * @returns      True if the option is some, false otherwise.
 */
export function isSome<T>(option: Option<T>): option is Some<T> {
  return option.kind === "some";
}

/**
 * Check if an option is none.
 *
 * Asserts the type of the option to None if true.
 *
 * @param option The option to check.
 * @returns      True if the option is none, false otherwise.
 */
export function isNone<T>(option: Option<T>): option is None {
  return option.kind === "none";
}

/**
 * Create a some option.
 *
 * @param value The value to create a some option for.
 * @returns     A some option.
 */
export function some<T>(value: T): Option<T> {
  return { kind: "some", value };
}

/**
 * A none option.
 */
export const none: None = {
  kind: "none",
};

/**
 * Unwrap an option if it is a some.
 *
 * Throws an error if the option is not a some.
 *
 * @param option The option to unwrap.
 * @returns      The value of the option.
 */
export function unwrapOption<T>(option: Option<T>): T {
  if (isSome(option)) {
    return option.value;
  }
  throw new Error("Option is not a some");
}
