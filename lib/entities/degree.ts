import type { MgpAcademicDegree } from "../dto/api-v2/mgp-academic.js";
import { type ResultSuccess, success } from "../types/result.js";
import type { Advisor } from "./advisor.js";

/**
 * A degree entity in the Mathematics Genealogy Project
 */
export type Degree = {
  /**
   * A list of advisors for the degree, consisting of their MGP ID and name.
   */
  advisors: Advisor[];
  /**
   * The MSC classification number of the degree, e.g. "60"
   */
  mscClassification: string;
  /**
   * The type of degree, e.g. "PhD", "MS", "BA", etc.
   */
  type: string;
  /**
   * The degree year, e.g. "2020", "1993/1994", etc.
   */
  year: string;
  /**
   * The names of the schools that awarded the degree.
   */
  schoolNames: string[];
  /**
   * The title of the thesis.
   */
  thesisTitle: string;
};

/**
 * Converts a MGP academic degree DTO to a degree entity.
 *
 * @param params     - Parameters for the to degree method.
 * @param params.dto - The MGP academic degree DTO to convert.
 * @returns          A parse result containing the converted degree entity.
 */
export function toDegree(params: { dto: MgpAcademicDegree }): ResultSuccess<Degree> {
  const { dto } = params;

  const advisors = Object.entries(dto["advised by"]).map(([mgpId, name]) => ({
    mgpId,
    name,
  }));

  return success({
    advisors,
    mscClassification: dto.degree_msc,
    type: dto.degree_type,
    year: dto.degree_year,
    schoolNames: dto.schools,
    thesisTitle: dto.thesis_title,
  });
}
