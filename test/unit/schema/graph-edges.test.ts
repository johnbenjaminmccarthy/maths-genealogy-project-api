import { describe, expect, it } from "vitest";

import { mgpGraphEdgesResponseSchema } from "../../../lib/dto/api-v2/graph-edges.js";
import graphEdges from "../../assets/graph-edges.json" with { type: "json" };

describe("mgpAcademicSchema", () => {
  it("should validate a graph node with multiple parents and children", () => {
    const validatedAcademic = mgpGraphEdgesResponseSchema.safeParse(graphEdges);

    expect(validatedAcademic.success).toBe(true);
  });
});
