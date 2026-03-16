import { afterEach, beforeAll, describe, expect, it } from "vitest";

import { MgpClient } from "../../lib/client.js";
import { isSuccess, unwrapResult } from "../../lib/types/result.js";
import { createClient } from "../helpers/create-client.js";
import { wait } from "../helpers/wait.js";

describe.sequential.skip("searchAcademics", () => {
  let client: MgpClient;

  beforeAll(() => {
    client = createClient();
  });

  afterEach(async () => {
    await wait();
  });

  it("should return all academic IDs matching the filters", async () => {
    const academicsResult = await client.searchAcademics({ filters: { familyName: "Gauss" } });

    expect(isSuccess(academicsResult)).toBe(true);

    const academics = unwrapResult(academicsResult);

    expect(academics.length).toBeGreaterThan(0);
  });

  it("should return an empty list if no academics match the filters", async () => {
    const academicsResult = await client.searchAcademics({
      filters: { familyName: "NonExistentasdfasdfasdf" },
    });

    expect(isSuccess(academicsResult)).toBe(true);

    const academics = unwrapResult(academicsResult);

    expect(academics.length).toBe(0);
  });
});
