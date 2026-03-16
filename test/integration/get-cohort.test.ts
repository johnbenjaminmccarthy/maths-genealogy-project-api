import { afterEach, beforeAll, describe, expect, it } from "vitest";

import { MgpClient } from "../../lib/client.js";
import { isSuccess, unwrapResult } from "../../lib/types/result.js";
import { createClient } from "../helpers/create-client.js";
import { wait } from "../helpers/wait.js";

describe.sequential.skip("getCohort", () => {
  let client: MgpClient;

  beforeAll(() => {
    client = createClient();
  });

  afterEach(async () => {
    await wait();
  });

  it("should return the cohort for a mathematician", async () => {
    const result = await client.getCohort("293462", { window: 1 });

    expect(isSuccess(result)).toBe(true);

    const cohort = unwrapResult(result);

    expect(cohort.length).toBeGreaterThan(0);
    expect(cohort[0]).toHaveProperty("mgpId");
    expect(cohort[0]).toHaveProperty("familyName");
    expect(cohort[0]).toHaveProperty("givenName");
  }, 30_000);

  it("should return the cohort with default window", async () => {
    const result = await client.getCohort("293462");

    expect(isSuccess(result)).toBe(true);

    const cohort = unwrapResult(result);

    expect(cohort.length).toBeGreaterThan(0);
  }, 30_000);
});
