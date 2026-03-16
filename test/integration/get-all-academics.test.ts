import { afterEach, beforeAll, describe, expect, it } from "vitest";

import { MgpClient } from "../../lib/client.js";
import { isSuccess, unwrapResult } from "../../lib/types/result.js";
import { createClient } from "../helpers/create-client.js";
import { wait } from "../helpers/wait.js";

describe.sequential.skip("getAllAcademics", () => {
  let client: MgpClient;

  beforeAll(() => {
    client = createClient();
  });

  afterEach(async () => {
    await wait();
  });

  it("should return the first page and allow fetching the next", async () => {
    const firstPageResult = await client.getAllAcademics({ startMgpId: 1000, pageSize: 50 });

    expect(isSuccess(firstPageResult)).toBe(true);

    const firstPage = unwrapResult(firstPageResult);

    expect(firstPage.startMgpId).toBe(1000);
    expect(firstPage.endMgpId).toBe(1050);
    expect(firstPage.numberOfResults).toBeGreaterThan(0);
    expect(firstPage.results.length).toBeLessThanOrEqual(50);
    expect(firstPage.hasNextPage).toBe(true);

    await wait();

    const secondPageResult = await firstPage.next();

    expect(isSuccess(secondPageResult)).toBe(true);

    const secondPage = unwrapResult(secondPageResult);

    expect(secondPage.startMgpId).toBe(1050);
    expect(secondPage.endMgpId).toBe(1100);
  }, 120_000);

  it("should reject a page size exceeding 10,000", async () => {
    const result = await client.getAllAcademics({ pageSize: 10_001 });

    expect(isSuccess(result)).toBe(false);
    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.error.type).toBe("range-request");
    }
  });
});
