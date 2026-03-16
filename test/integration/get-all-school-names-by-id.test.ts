import { afterEach, beforeAll, describe, expect, it } from "vitest";

import { MgpClient } from "../../lib/client.js";
import { isSuccess, unwrapResult } from "../../lib/types/result.js";
import { createClient } from "../helpers/create-client.js";
import { wait } from "../helpers/wait.js";

describe.sequential.skip("getAllSchoolNamesById", () => {
  let client: MgpClient;

  beforeAll(() => {
    client = createClient();
  });

  afterEach(async () => {
    await wait();
  });

  it("should return all school names indexed by ID", async () => {
    const result = await client.getAllSchoolNamesById();

    expect(isSuccess(result)).toBe(true);

    const schools = unwrapResult(result);

    expect(schools.length).toBeGreaterThan(0);
    expect(schools[0]).toHaveProperty("schoolId");
    expect(schools[0]).toHaveProperty("name");
  }, 30_000);
});
