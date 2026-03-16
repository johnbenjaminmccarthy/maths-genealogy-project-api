import type {
  SchoolNamesByCountryResponse,
  SchoolNamesByIdResponse,
} from "../dto/api-v2/school.js";
import { type ResultSuccess, success } from "../types/result.js";

/**
 * A school name entry from the Mathematics Genealogy Project.
 */
export type SchoolName = {
  schoolId: string;
  name: string;
};

/**
 * A collection of schools grouped by country.
 */
export type SchoolsByCountry = {
  country: string;
  schools: SchoolName[];
};

/**
 * Parses the HTML response from the schoolname_from_id endpoint.
 *
 * The MGP API returns HTML of the form:
 * `<h1>...</h1><h2>ID: SchoolName, Country</h2><p>...</p>`
 *
 * Returns `null` when the school ID does not exist (name is "None").
 *
 * @param html - The raw HTML response string.
 * @returns    The parsed school name, or null if the school does not exist.
 */
export function parseSchoolNameHtml(html: string): SchoolName | null {
  const match = html.match(/<h2>(\d+): (.+?)<\/h2>/);

  if (!match?.[1] || !match[2] || match[2] === "None") {
    return null;
  }

  return { schoolId: match[1], name: match[2] };
}

/**
 * Converts a schoolnames_by_id DTO to a list of school name entities.
 *
 * @param params     - Parameters for the to school directory method.
 * @param params.dto - The schoolnames_by_id DTO to convert.
 * @returns          A result containing the converted school name entities.
 */
export function toSchoolDirectory(params: {
  dto: SchoolNamesByIdResponse;
}): ResultSuccess<SchoolName[]> {
  const { dto } = params;

  const schools = Object.entries(dto).map(([schoolId, name]) => ({
    schoolId,
    name,
  }));

  return success(schools);
}

/**
 * Converts a schoolnames_by_country DTO to a list of schools grouped by country.
 *
 * @param params     - Parameters for the to schools by country method.
 * @param params.dto - The schoolnames_by_country DTO to convert.
 * @returns          A result containing the converted schools by country entities.
 */
export function toSchoolsByCountry(params: {
  dto: SchoolNamesByCountryResponse;
}): ResultSuccess<SchoolsByCountry[]> {
  const { dto } = params;

  const result = Object.entries(dto).map(([country, schools]) => ({
    country,
    schools: Object.entries(schools).map(([name, schoolId]) => ({
      schoolId: schoolId.toString(),
      name,
    })),
  }));

  return success(result);
}
