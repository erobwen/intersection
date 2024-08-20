import axios from "axios";
import { IntersectionResponse } from "./models/IntersectionResponse";

const baseUrl = "http://localhost:3000/api/";

export async function intersect(listA: string[], listB: string[]): Promise<IntersectionResponse> {
  try {
    const result = await axios.post(
      baseUrl + "intersect", 
      {listA, listB}
    );
    return result.data; 
  } catch(error:any) {
    throw new Error("Cannot connect to server, try again later.");
  }
}