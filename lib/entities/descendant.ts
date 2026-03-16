import type { MgpAcademicDescendant } from "../dto/api-v2/mgp-academic.js";
import { type ResultSuccess, success } from "../types/result.js";

/**
 * A descendant entity in the Mathematics Genealogy Project
 */
export type Descendant = {
  mgpId: string;
  name: string;
};

/**
 * Converts a MGP academic descendant DTO to a descendant entity.
 *
 * @param params     - Parameters for the to descendant method.
 * @param params.dto - The MGP academic descendant DTO to convert.
 * @returns          A parse result containing the converted descendant entity.
 */
export function toDescendant(params: { dto: MgpAcademicDescendant }): ResultSuccess<Descendant> {
  const { dto } = params;

  return success({
    mgpId: dto[0],
    name: dto[1],
  });
}
