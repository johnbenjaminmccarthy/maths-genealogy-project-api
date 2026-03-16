import { describe, expect, it } from "vitest";

import { mgpAcademicResponseSchema } from "../../../lib/dto/api-v2/mgp-academic.js";
import ac7824 from "../../assets/mgp-academic/7824.json" with { type: "json" };
import ac60985 from "../../assets/mgp-academic/60985.json" with { type: "json" };
import ac217413 from "../../assets/mgp-academic/217413.json" with { type: "json" };
import ac293462 from "../../assets/mgp-academic/293462.json" with { type: "json" };
import ac298616 from "../../assets/mgp-academic/298616.json" with { type: "json" };
import ac310782 from "../../assets/mgp-academic/310782.json" with { type: "json" };

/**
 * Tests a raw academic response against the MGP academic response schema.
 *
 * @param raw - The raw academic response to test.
 */
function testRawSchema(raw: unknown): void {
  const validatedAcademic = mgpAcademicResponseSchema.safeParse(raw);

  expect(validatedAcademic.success).toBe(true);
}

describe("mgpAcademicSchema", () => {
  it("should validate an academic with multiple years for a degree", () => {
    testRawSchema(ac7824);
  });

  it("should validate an academic with multiple degrees, some of which have an unknown title", () => {
    testRawSchema(ac60985);
  });

  it("should validate an academic with a degree with no advisors and no title", () => {
    testRawSchema(ac310782);
  });

  it("should validate an academic with special characters in the name", () => {
    testRawSchema(ac217413);
  });

  it("Should validate an academic with no descendents", () => {
    testRawSchema(ac293462);
  });

  it("should validate an academic with three advisors", () => {
    testRawSchema(ac298616);
  });
});
