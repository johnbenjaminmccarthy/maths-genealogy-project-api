import { describe, expect, it } from "vitest";
import z from "zod";

import { mgpAcademicResponseSchema } from "../../../lib/dto/api-v2/mgp-academic.js";
import academics from "../../assets/academics.json" with { type: "json" };

describe("mgpAcademicSchema", () => {
  it("should validate a list of academics fetched from the range starting at MGP ID 1000 and returning 50 academics", () => {
    const validatedAcademics = z.array(mgpAcademicResponseSchema).safeParse(academics);

    expect(validatedAcademics.success).toBe(true);

    expect(validatedAcademics.data?.length).toBeLessThanOrEqual(50);
  });
});
