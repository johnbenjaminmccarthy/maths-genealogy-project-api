import z from "zod";

/**
 * A degree entity in the Mathematics Genealogy Project
 */
export const mgpAcademicDegreeSchema = z.object({
  "advised by": z.record(z.number().or(z.string()), z.string()),
  degree_msc: z.string(),
  degree_type: z.string(),
  degree_year: z.string(),
  schools: z.array(z.string()),
  thesis_title: z.string(),
});

/**
 * @see {@link mgpAcademicDegreeSchema}
 */
export type MgpAcademicDegree = z.infer<typeof mgpAcademicDegreeSchema>;

/**
 * A descendant entity in the Mathematics Genealogy Project.
 */
export const mgpAcademicDescendantSchema = z.tuple([z.string(), z.string()]);

/**
 * @see {@link mgpAcademicDescendantSchema}
 */
export type MgpAcademicDescendant = z.infer<typeof mgpAcademicDescendantSchema>;

/**
 * A academic entity in the Mathematics Genealogy Project.
 */
export const mgpAcademicSchema = z.object({
  ID: z.string(),
  family_name: z.string(),
  given_name: z.string(),
  other_names: z.string(),
  student_data: z.object({
    degrees: z.array(mgpAcademicDegreeSchema),
    descendants: z.object({
      advisees: z.union([z.array(mgpAcademicDescendantSchema), z.tuple([z.literal("")])]),
      descendant_count: z.number(),
    }),
  }),
});

/**
 * @see {@link mgpAcademicSchema}
 */
export type MgpAcademic = z.infer<typeof mgpAcademicSchema>;

/**
 * The response type for fetching an academic by their MGP ID from the MGP v2 API.
 */
export const mgpAcademicResponseSchema = z.object({
  MGP_academic: mgpAcademicSchema,
});

/**
 * @see {@link mgpAcademicResponseSchema}
 */
export type MgpAcademicResponse = z.infer<typeof mgpAcademicResponseSchema>;
