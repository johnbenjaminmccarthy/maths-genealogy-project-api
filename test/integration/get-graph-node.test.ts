import { afterEach, beforeAll, describe, expect, it } from "vitest";

import { MgpClient } from "../../lib/client.js";
import { isSome, unwrapOption } from "../../lib/types/option.js";
import { isSuccess, unwrapResult } from "../../lib/types/result.js";
import { createClient } from "../helpers/create-client.js";
import { wait } from "../helpers/wait.js";

describe.sequential.skip("getGraphNode", () => {
  let client: MgpClient;

  beforeAll(() => {
    client = createClient();
  });

  afterEach(async () => {
    await wait();
  });

  it("should return a graph node for an MGP ID which has multiple parents and children", async () => {
    const graphNodeResult = await client.getGraphNode("36909");

    expect(isSuccess(graphNodeResult)).toBe(true);

    const graphNodeOption = unwrapResult(graphNodeResult);

    expect(isSome(graphNodeOption)).toBe(true);

    const graphNode = unwrapOption(graphNodeOption);

    expect(graphNode.mgpId).toBe("36909");

    expect(graphNode.parentNodeMgpIds.length).toBeGreaterThan(1);
    expect(graphNode.childNodeMgpIds.length).toBeGreaterThan(0);
  }, 10_000);

  it("should return a graph node for an MGP ID which has no parents", async () => {
    const graphNodeResult = await client.getGraphNode("310782");

    expect(isSuccess(graphNodeResult)).toBe(true);

    const graphNodeOption = unwrapResult(graphNodeResult);

    expect(isSome(graphNodeOption)).toBe(true);

    const graphNode = unwrapOption(graphNodeOption);

    expect(graphNode.mgpId).toBe("310782");

    expect(graphNode.parentNodeMgpIds.length).toBe(0);
  }, 10_000);

  it("should return a graph node for an MGP ID which has no children", async () => {
    const graphNodeResult = await client.getGraphNode("293462");

    expect(isSuccess(graphNodeResult)).toBe(true);

    const graphNodeOption = unwrapResult(graphNodeResult);

    expect(isSome(graphNodeOption)).toBe(true);

    const graphNode = unwrapOption(graphNodeOption);

    expect(graphNode.mgpId).toBe("293462");

    expect(graphNode.childNodeMgpIds.length).toBe(0);
  }, 10_000);
});
