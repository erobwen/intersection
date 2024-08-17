import { expect, test, describe } from 'vitest'
import { intersect } from './intersect';

describe("Test intersection", () => {
  
  test("Basic case", () => {
    const listA = ["a", "b", "c"];
    const listB = ["b", "c", "d"];
    const intersection = intersect(listA, listB);
    expect(intersection.length).toBe(2);
    expect(intersection[0]).toBe("b");
    expect(intersection[1]).toBe("c");
  });

  test("One list empty", () => {
    const listA: string[] = [];
    const listB = ["b", "c", "d"];
    const intersection = intersect(listA, listB);
    expect(intersection.length).toBe(0);
  });

  test("Other list empty", () => {
    const listA = ["b", "c", "d"];
    const listB: string[] = [];
    const intersection = intersect(listA, listB);
    expect(intersection.length).toBe(0);
  });

  test("Duplicates count", () => {
    const listA = ["a", "a"];
    const listB = ["a", "a", "a"];
    const intersection = intersect(listA, listB);
    expect(intersection.length).toBe(2);
    expect(intersection[0]).toBe("a");
    expect(intersection[1]).toBe("a");
  })

  test("Duplicates count reverse limitation", () => {
    const listA = ["a", "a", "a"];
    const listB = ["a", "a"];
    const intersection = intersect(listA, listB);
    expect(intersection.length).toBe(2);
    expect(intersection[0]).toBe("a");
    expect(intersection[1]).toBe("a");
  })
});
