import { describe, expect, it } from "vitest";
import z from "zod";

import { mgpAcademicResponseSchema } from "../../../lib/dto/api-v2/mgp-academic.js";
import cohort293462 from "../../assets/cohort/293462.json" with { type: "json" };
import siblings293462 from "../../assets/siblings/293462.json" with { type: "json" };

const siblingsResponseSchema = z.array(mgpAcademicResponseSchema);

describe("siblings response schema", () => {
  it("should validate a siblings response with multiple academics", () => {
    const result = siblingsResponseSchema.safeParse(siblings293462);

    expect(result.success).toBe(true);
  });

  it("should contain the expected number of sibling academics", () => {
    const result = siblingsResponseSchema.safeParse(siblings293462);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toHaveLength(3);
    }
  });
});

describe("cohort response schema", () => {
  it("should validate a cohort response with multiple academics", () => {
    const result = siblingsResponseSchema.safeParse(cohort293462);

    expect(result.success).toBe(true);
  });

  it("should contain the expected number of cohort academics", () => {
    const result = siblingsResponseSchema.safeParse(cohort293462);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toHaveLength(2);
    }
  });
});
