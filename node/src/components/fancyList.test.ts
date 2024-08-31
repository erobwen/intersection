import { expect, test } from 'vitest'
import { FancyList } from './fancyList';


test("Test add and check", () => {
  const item = "A";
  const list = new FancyList<string>();
  list.add(item);
  expect(list.contains(item)).toBeTruthy();
});


test("Test undo", () => {
  const item = "A";
  const list = new FancyList<string>();
  list.add(item);
  expect(list.contains(item)).toBeTruthy();
  list.undo();
  expect(list.contains(item)).toBeFalsy();
});


test("Test undo", () => {
  const A = "A";
  const B = "B";
  const C = "C";
  const list = new FancyList<string>();
  list.add(A);
  list.add(B);
  list.add(C);
  expect(list.size()).toBe(3);
  list.remove(1);
  expect(list.unbox()).toStrictEqual([A, C]);

  list.remove(0);
  expect(list.unbox()).toStrictEqual([C]);
  
  list.undo();
  expect(list.unbox()).toStrictEqual([A, C]);

  list.undo();
  expect(list.unbox()).toStrictEqual([A, B, C]);
});


test("Test redo", () => {
  const A = "A";
  const B = "B";
  const C = "C";
  const list = new FancyList<string>();
  list.add(A);
  list.add(B);
  list.add(C);
  expect(list.size()).toBe(3);
  expect(list.unbox()).toStrictEqual([A, B, C]);
  list.remove(1);
  list.remove(0);
  
  expect(list.unbox()).toStrictEqual([C]);
  list.undo();
  list.undo();

  expect(list.unbox()).toStrictEqual([A, B, C]);

  list.redo();
  expect(list.unbox()).toStrictEqual([A, C]);
  list.redo();
  expect(list.unbox()).toStrictEqual([C]);
});


test("Test metadata", () => {
  const A = "A";
  const B = "B";
  const C = "C";
  const list = new FancyList<string>();
  list.add(A);
  list.add(B);
  list.add(C);
  expect(list.size()).toBe(3);
  expect(list.unbox()).toStrictEqual([A, B, C]);

  list.setMetadata(1, "meta");
  expect(list.getMetadata(1)).toBe("meta");
});

test("Test metadata 2", () => {
  const list : FancyList<string> = new FancyList()
  
  list.add("element");

  // metadata is not set
  expect(list.getMetadata(0)).toBe(null);

  list.setMetadata(0, "a");
  expect( list.getMetadata(0)).toBe("a");

  list.setMetadata(0, "b");
    expect( list.getMetadata(0)).toBe("b");

  // remove element
  list.remove(0);

  // undo remove element
  list.undo();
  expect( list.getMetadata(0)).toBe("b");

  // undo setting metadata "b"
  list.undo();
  expect( list.getMetadata(0)).toBe("a");

  // undo setting metadata "a"
  list.undo();
  expect(list.getMetadata(0)).toBe(null);
});

