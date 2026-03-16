import { afterEach, beforeAll, describe, expect, it } from "vitest";

import { MgpClient } from "../../lib/client.js";
import { isSuccess, unwrapResult } from "../../lib/types/result.js";
import { createClient } from "../helpers/create-client.js";
import { wait } from "../helpers/wait.js";

describe.sequential.skip("getAllAcademicIds", () => {
  let client: MgpClient;

  beforeAll(() => {
    client = createClient();
  });

  afterEach(async () => {
    await wait();
  });

  it("should return all academic IDs", async () => {
    const academicIdsResult = await client.getAllAcademicIds();
    expect(isSuccess(academicIdsResult)).toBe(true);
    const academicIds = unwrapResult(academicIdsResult);
    expect(academicIds.length).toBeGreaterThan(100000);
  });
});
