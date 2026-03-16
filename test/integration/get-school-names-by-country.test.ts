import { afterEach, beforeAll, describe, expect, it } from "vitest";

import { MgpClient } from "../../lib/client.js";
import { isSuccess, unwrapResult } from "../../lib/types/result.js";
import { createClient } from "../helpers/create-client.js";
import { wait } from "../helpers/wait.js";

describe.sequential.skip("getSchoolNamesByCountry", () => {
  let client: MgpClient;

  beforeAll(() => {
    client = createClient();
  });

  afterEach(async () => {
    await wait();
  });

  it("should return school names grouped by country", async () => {
    const result = await client.getSchoolNamesByCountry();

    expect(isSuccess(result)).toBe(true);

    const schoolsByCountry = unwrapResult(result);

    expect(schoolsByCountry.length).toBeGreaterThan(0);

    const firstCountry = schoolsByCountry[0]!;
    expect(firstCountry).toHaveProperty("country");
    expect(firstCountry).toHaveProperty("schools");
    expect(firstCountry.schools.length).toBeGreaterThan(0);
    expect(firstCountry.schools[0]).toHaveProperty("schoolId");
    expect(firstCountry.schools[0]).toHaveProperty("name");
  }, 30_000);
});
