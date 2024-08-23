import { generateRandomList } from "../components/randomListGenerator";
import { ListCreatorWorkerRequest } from "./ListCreatorWorkerRequest";

self.onmessage = function(request: MessageEvent<ListCreatorWorkerRequest>) {
  const {lengthListA, lengthListB} = request.data;
  const lists = {
    listA: generateRandomList(lengthListA),
    listB: generateRandomList(lengthListB)
  }
  self.postMessage(lists);
};


// return new Promise((resolve) => {
//   const {lengthListA, lengthListB} = request.data;
//   const lists = {
//     listA: generateRandomList(lengthListA),
//     listB: generateRandomList(lengthListB)
//   }
//   resolve(lists);
// }).then(lists => postMessage(lists)); 