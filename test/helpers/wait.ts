/**
 * Waits for a given number of milliseconds.
 *
 * To be used for polite integration testing, so we don't nuke the MGP API.
 *
 * @param ms - The number of milliseconds to wait.
 */
export async function wait(ms = 1_000): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}
