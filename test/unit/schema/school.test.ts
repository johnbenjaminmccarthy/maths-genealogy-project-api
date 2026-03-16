import { describe, expect, it } from "vitest";

import {
  schoolNamesByCountryResponseSchema,
  schoolNamesByIdResponseSchema,
} from "../../../lib/dto/api-v2/school.js";
import { parseSchoolNameHtml } from "../../../lib/entities/school.js";
import schoolNamesByCountry from "../../assets/school-names-by-country.json" with { type: "json" };
import schoolNamesById from "../../assets/school-names-by-id.json" with { type: "json" };

describe("schoolNamesByIdResponseSchema", () => {
  it("should validate school names by id", () => {
    const result = schoolNamesByIdResponseSchema.safeParse(schoolNamesById);

    expect(result.success).toBe(true);
  });
});

describe("schoolNamesByCountryResponseSchema", () => {
  it("should validate school names by country", () => {
    const result = schoolNamesByCountryResponseSchema.safeParse(schoolNamesByCountry);

    expect(result.success).toBe(true);
  });
});

describe("parseSchoolNameHtml", () => {
  it("should parse a valid school name from HTML", () => {
    const html =
      "<h1> School key: school name, country</h1><h2>122: Donetsk University, Ukraine</h2><p> For a full list use the endpoint             <code>/api/v2/MGP/schoolnames/</code>, although              this may take some time.";

    const result = parseSchoolNameHtml(html);

    expect(result).toEqual({ schoolId: "122", name: "Donetsk University, Ukraine" });
  });

  it("should return null for a school ID that does not exist", () => {
    const html =
      "<h1> School key: school name, country</h1><h2>110: None</h2><p> For a full list use the endpoint             <code>/api/v2/MGP/schoolnames/</code>, although              this may take some time.";

    const result = parseSchoolNameHtml(html);

    expect(result).toBeNull();
  });
});
