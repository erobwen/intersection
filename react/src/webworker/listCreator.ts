import { generateRandomList } from "../components/randomListGenerator";
import { ListCreatorWorkerRequest } from "./ListCreatorWorkerRequest";

self.onmessage = async function(request: MessageEvent<ListCreatorWorkerRequest>) {  
  console.log("In webworker... ");
  const {lengthListA, lengthListB} = request.data;
  const lists = {
    listA: generateRandomList(lengthListA),
    listB: generateRandomList(lengthListB)
  }
  postMessage(lists);
};


// return new Promise((resolve) => {
//   const {lengthListA, lengthListB} = request.data;
//   const lists = {
//     listA: generateRandomList(lengthListA),
//     listB: generateRandomList(lengthListB)
//   }
//   resolve(lists);
// }).then(lists => postMessage(lists)); 