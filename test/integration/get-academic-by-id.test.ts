import { afterEach, beforeAll, describe, expect, it } from "vitest";

import { MgpClient } from "../../lib/client.js";
import { isNone, isSome, unwrapOption } from "../../lib/types/option.js";
import { isSuccess, unwrapResult } from "../../lib/types/result.js";
import { createClient } from "../helpers/create-client.js";
import { wait } from "../helpers/wait.js";

/**
 * Tests the academic by their MGP ID.
 *
 * @param id     - The MGP ID of the academic to test.
 * @param client - The MGP client to use.
 * @returns      A promise that resolves when the academic is tested.
 */
async function testAcademicById(id: string, client: MgpClient): Promise<void> {
  const academicResult = await client.getAcademicById(id);

  expect(isSuccess(academicResult)).toBe(true);

  const academicOption = unwrapResult(academicResult);

  expect(isSome(academicOption)).toBe(true);

  const academic = unwrapOption(academicOption);

  expect(academic.mgpId).toBe(id);
}

describe.sequential.skip("getAcademicById", () => {
  let client: MgpClient;

  beforeAll(() => {
    client = createClient();
  });

  afterEach(async () => {
    await wait();
  });

  it("should return an academic by their MGP ID 217413", async () => {
    await testAcademicById("217413", client);
  });

  it("should return an academic by their MGP ID 293462", async () => {
    await testAcademicById("293462", client);
  });

  it("should return an academic by their MGP ID 298616", async () => {
    await testAcademicById("298616", client);
  });

  it("should return an academic by their MGP ID 30949", async () => {
    await testAcademicById("30949", client);
  });

  it("should return an academic by their MGP ID 310782", async () => {
    await testAcademicById("310782", client);
  });

  it("should return an academic by their MGP ID 36909", async () => {
    await testAcademicById("36909", client);
  });

  it("should return an academic by their MGP ID 60985", async () => {
    await testAcademicById("60985", client);
  });

  it("should return an academic by their MGP ID 7824", async () => {
    await testAcademicById("7824", client);
  });

  it("should handle a non-existent academic", async () => {
    const academicResult = await client.getAcademicById("999999999");
    expect(isSuccess(academicResult)).toBe(true);
    const academicOption = unwrapResult(academicResult);
    expect(isNone(academicOption)).toBe(true);
  });
});
