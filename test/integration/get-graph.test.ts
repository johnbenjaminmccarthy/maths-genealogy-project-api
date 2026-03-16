import { afterEach, beforeAll, describe, expect, it } from "vitest";

import { MgpClient } from "../../lib/client.js";
import { isSuccess, unwrapResult } from "../../lib/types/result.js";
import { createClient } from "../helpers/create-client.js";
import { wait } from "../helpers/wait.js";

describe.sequential.skip("getGraph", () => {
  let client: MgpClient;

  beforeAll(() => {
    client = createClient();
  });

  afterEach(async () => {
    await wait();
  });

  it("should return the entire Mathematics Genealogy Project graph", async () => {
    const graphResult = await client.getGraph();
    expect(isSuccess(graphResult)).toBe(true);

    const graph = unwrapResult(graphResult);

    expect(graph.numberOfNodes).toBeGreaterThan(100000);
    expect(graph.numberOfEdges).toBeGreaterThan(100000);
  }, 60_000);
});
