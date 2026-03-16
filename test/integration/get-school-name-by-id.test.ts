import { afterEach, beforeAll, describe, expect, it } from "vitest";

import { MgpClient } from "../../lib/client.js";
import { isNone, isSome, unwrapOption } from "../../lib/types/option.js";
import { isSuccess, unwrapResult } from "../../lib/types/result.js";
import { createClient } from "../helpers/create-client.js";
import { wait } from "../helpers/wait.js";

describe.sequential.skip("getSchoolNameById", () => {
  let client: MgpClient;

  beforeAll(() => {
    client = createClient();
  });

  afterEach(async () => {
    await wait();
  });

  it("should return a school name for a valid school ID", async () => {
    const result = await client.getSchoolNameById("122");

    expect(isSuccess(result)).toBe(true);

    const option = unwrapResult(result);

    expect(isSome(option)).toBe(true);

    const schoolName = unwrapOption(option);

    expect(schoolName.schoolId).toBe("122");
    expect(schoolName.name).toBe("Donetsk University, Ukraine");
  }, 10_000);

  it("should return none for a school ID that does not exist", async () => {
    const result = await client.getSchoolNameById("110");

    expect(isSuccess(result)).toBe(true);

    const option = unwrapResult(result);

    expect(isNone(option)).toBe(true);
  }, 10_000);
});
