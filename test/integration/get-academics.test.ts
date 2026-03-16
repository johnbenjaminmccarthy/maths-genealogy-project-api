import { afterEach, beforeAll, describe, expect, it } from "vitest";

import { MgpClient } from "../../lib/client.js";
import { isSuccess, unwrapResult } from "../../lib/types/result.js";
import { createClient } from "../helpers/create-client.js";
import { wait } from "../helpers/wait.js";

describe.sequential.skip("getAcademicsInRange", () => {
  let client: MgpClient;

  beforeAll(() => {
    client = createClient();
  });

  afterEach(async () => {
    await wait();
  });

  it("should return academics within the given range", async () => {
    const academicsResult = await client.getAcademicsInRange({
      startMgpId: 1000,
      endMgpId: 1050,
    });

    expect(isSuccess(academicsResult)).toBe(true);

    const academics = unwrapResult(academicsResult);

    expect(academics.numberOfResults).toBeGreaterThan(0);
    expect(academics.startMgpId).toBe(1000);
    expect(academics.endMgpId).toBe(1050);
    expect(academics.results.length).toBeLessThanOrEqual(50);
  }, 60_000);
});
