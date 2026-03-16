import { afterEach, beforeAll, describe, expect, it } from "vitest";

import { MgpClient } from "../../lib/client.js";
import { isSuccess, unwrapResult } from "../../lib/types/result.js";
import { createClient } from "../helpers/create-client.js";
import { wait } from "../helpers/wait.js";

describe.sequential.skip("getSiblings", () => {
  let client: MgpClient;

  beforeAll(() => {
    client = createClient();
  });

  afterEach(async () => {
    await wait();
  });

  it("should return siblings for a mathematician", async () => {
    const result = await client.getSiblings("293462");

    expect(isSuccess(result)).toBe(true);

    const siblings = unwrapResult(result);

    expect(siblings.length).toBeGreaterThan(0);
    expect(siblings[0]).toHaveProperty("mgpId");
    expect(siblings[0]).toHaveProperty("familyName");
    expect(siblings[0]).toHaveProperty("givenName");
  }, 10_000);

  it("should return siblings with a year window", async () => {
    const result = await client.getSiblings("293462", { window: 3 });

    expect(isSuccess(result)).toBe(true);

    const siblings = unwrapResult(result);

    expect(siblings.length).toBeGreaterThan(0);
  }, 10_000);
});
