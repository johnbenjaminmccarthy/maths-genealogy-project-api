import type { MgpAcademicDescendant, MgpAcademicResponse } from "../dto/api-v2/mgp-academic.js";
import { type ResultSuccess, success } from "../types/result.js";
import { type Degree, toDegree } from "./degree.js";
import { type Descendant, toDescendant } from "./descendant.js";

/**
 * An academic entity in the Mathematics Genealogy Project
 */
export type Academic = {
  mgpId: string;
  givenName: string;
  familyName: string;
  otherNames: string;
  degrees: Degree[];
  descendants: Descendant[];
  descendantsCount: number;
};

/**
 *
 * Converts a MGP academic DTO to an academic entity.
 *
 * @param params     - Parameters for the to academic method.
 * @param params.dto - The MGP academic DTO to convert.
 * @returns          A parse result containing the converted academic entity.
 */
export function toAcademic(params: { dto: MgpAcademicResponse }): ResultSuccess<Academic> {
  const { dto } = params;

  const mgpAcademic = dto.MGP_academic;

  const rawAdvisees = mgpAcademic.student_data.descendants.advisees;

  /**
   * Checks if the academic has advisees.
   *
   * @param rawAdvisees - The raw advisees to check.
   * @returns           True if the academic has advisees, false otherwise.
   */
  function hasAdvisees(
    rawAdvisees: MgpAcademicDescendant[] | [""],
  ): rawAdvisees is MgpAcademicDescendant[] {
    return !(rawAdvisees.length === 1 && rawAdvisees[0] === "");
  }

  const advisees = hasAdvisees(rawAdvisees)
    ? rawAdvisees.map((descendant) => toDescendant({ dto: descendant }).value)
    : [];

  return success({
    mgpId: mgpAcademic.ID,
    givenName: mgpAcademic.given_name,
    familyName: mgpAcademic.family_name,
    otherNames: mgpAcademic.other_names,
    degrees: mgpAcademic.student_data.degrees.map((degree) => toDegree({ dto: degree }).value),
    descendants: advisees,
    descendantsCount: mgpAcademic.student_data.descendants.descendant_count,
  });
}
