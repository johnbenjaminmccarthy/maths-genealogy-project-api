/**
 * A wrapper type for a range-based fetch, consisting of the requested range bounds and the results.
 */
export type RangeResult<T> = {
  startMgpId: number;
  endMgpId: number;
  numberOfResults: number;
  results: T[];
};
