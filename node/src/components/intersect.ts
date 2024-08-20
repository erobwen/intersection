
/**
 * Intersect
 * 
 * Note: if there are duplicates of string S in either array, the resulting intersection will contain the minimum occurances of S in either array. 
 */
export function intersect(listA: string[], listB: string[]) {
  const listAHash = new Map<string, number>();
  const result: string[] = [];

  function getCount(item: string): number {
    return listAHash.has(item) ? listAHash.get(item) as number : 0;
  }

  listA.forEach(item => {
    const count = getCount(item);
    listAHash.set(item, count + 1);
  });

  listB.forEach(item => { 
    if(listAHash.has(item)) {
      const count = getCount(item);
      if (count === 1) {
        listAHash.delete(item);
      } else {
        listAHash.set(item, count - 1);
      }

      result.push(item);
    }
  });

  return result;
}

/**
 * Optimizes intersection by choosing the shortest list for the creation of the hash map.
 */
export function optimizedIntersect(listA: string[], listB: string[]) {
  if (listA.length < listB.length) {
    return intersect(listA, listB);
  } else {
    return intersect(listB, listA);
  }
}
