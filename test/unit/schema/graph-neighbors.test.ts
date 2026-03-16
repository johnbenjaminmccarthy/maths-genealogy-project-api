import { describe, expect, it } from "vitest";

import { graphNeighboursResponseSchema } from "../../../lib/dto/api-v2/graph-neighbors.js";
import gn36909 from "../../assets/graph-neighbors/36909.json" with { type: "json" };
import gn293462 from "../../assets/graph-neighbors/293462.json" with { type: "json" };
import gn310782 from "../../assets/graph-neighbors/310782.json" with { type: "json" };

/**
 * Tests a raw academic response against the MGP academic response schema.
 *
 * @param raw - The raw academic response to test.
 */
function testRawSchema(raw: unknown): void {
  const validatedAcademic = graphNeighboursResponseSchema.safeParse(raw);

  expect(validatedAcademic.success).toBe(true);
}

describe("mgpAcademicSchema", () => {
  it("should validate a graph node with multiple parents and children", () => {
    testRawSchema(gn36909);
  });

  it("should validate a graph with no parents", () => {
    testRawSchema(gn310782);
  });

  it("should validate a graph with no children", () => {
    testRawSchema(gn293462);
  });
});
