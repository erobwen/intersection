import { expect, test, describe } from 'vitest'
import { Intersection } from './Intersection';

describe("Test intersection controller", () => {
  test("Test post", async () => {
    const controller = new Intersection();
    const returnValue = await controller.intersect({
      listA: ["a", "b", "c", "d"],
      listB: ["b", "c", "d", "e"]
    })

    expect(returnValue.intersection.length).toBe(3);
    expect(returnValue.intersection[0]).toBe("b");
    expect(returnValue.intersection[1]).toBe("c");
    expect(returnValue.intersection[2]).toBe("d");

    expect(returnValue.optimizedIntersection.length).toBe(3);
    expect(returnValue.optimizedIntersection[0]).toBe("b");
    expect(returnValue.optimizedIntersection[1]).toBe("c");
    expect(returnValue.optimizedIntersection[2]).toBe("d");
  });
})