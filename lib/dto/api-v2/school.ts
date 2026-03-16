import z from "zod";

/**
 * The response schema for the schoolnames_by_id endpoint.
 *
 * Returns a dictionary of school IDs (as strings) to school names (including country).
 */
export const schoolNamesByIdResponseSchema = z.record(z.string(), z.string());

/**
 * @see {@link schoolNamesByIdResponseSchema}
 */
export type SchoolNamesByIdResponse = z.infer<typeof schoolNamesByIdResponseSchema>;

/**
 * The response schema for the schoolnames_by_country endpoint.
 *
 * Returns a dictionary of country names to a dictionary of school names to school IDs.
 */
export const schoolNamesByCountryResponseSchema = z.record(
  z.string(),
  z.record(z.string(), z.number()),
);

/**
 * @see {@link schoolNamesByCountryResponseSchema}
 */
export type SchoolNamesByCountryResponse = z.infer<typeof schoolNamesByCountryResponseSchema>;
