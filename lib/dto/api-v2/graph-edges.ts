import z from "zod";

/**
 * The response schema for the graph edges endpoint.
 */
export const mgpGraphEdgesResponseSchema = z.object({
  number_of_edges: z.number(),
  number_of_nodes: z.number(),
  directed_edges: z.array(z.tuple([z.number(), z.number()])),
});

/**
 * @see {@link mgpGraphEdgesResponseSchema}
 */
export type MgpGraphEdgesResponse = z.infer<typeof mgpGraphEdgesResponseSchema>;
