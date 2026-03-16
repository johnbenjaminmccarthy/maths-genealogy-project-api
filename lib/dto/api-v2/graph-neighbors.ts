import z from "zod";

/**
 * The response schema for the graph neighbours endpoint.
 */
export const graphNeighboursResponseSchema = z.object({
  node_neighbors: z.object({
    ID: z.string(),
    // MGP returns the number 0 for the adviceFrom list when there are no/unknown parents
    adviceFrom: z.union([z.array(z.string()), z.tuple([z.literal(0)])]),
    // MGP returns an array with the empty string for the adviceTo list when there are no children
    adviceTo: z.union([z.array(z.string()), z.tuple([z.literal("")])]),
  }),
});

/**
 * @see {@link graphNeighboursResponseSchema}
 */
export type GraphNeighboursResponse = z.infer<typeof graphNeighboursResponseSchema>;
