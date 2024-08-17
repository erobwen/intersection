# About

List intersection full stack app


# Pseudo code

function computeIntersection(listA, listB) {
  const firstListHash = {};
  const result = [];
  listA.forEach(item => firstListHash[item.id] = id);
  listB.forEach(item => { 
    if(firstListHash[item.id]) {
      result.push(item);
    }
  });
  return result;
}

O(listA.lenght + listB.length);