import { expect, test, describe } from 'vitest'
import { generateRandomList } from './randomListGenerator';

describe("Random list generator test", () => {
  test("Test length correct", async () => {
    const randomList = generateRandomList(10);
    expect(randomList.length).toBe(10);
  });
})