import dotenv from "dotenv";

import { MgpClient } from "../../lib/client.js";

/**
 * Loads the API key from the environment and returns an {@link MgpClient}.
 *
 * Intended to be called inside a `beforeAll` block within a skipped `describe`,
 * so that CI environments without an API key never reach this code.
 *
 * @returns An {@link MgpClient} instance.
 */
export function createClient(): MgpClient {
  dotenv.config({ quiet: true });

  const apiKey = process.env["MGP_API_ACCESS_TOKEN"];

  if (!apiKey) {
    throw new Error("MGP_API_ACCESS_TOKEN is not set");
  }

  return new MgpClient({ apiKey });
}
