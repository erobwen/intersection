import axios from "axios";
import { IntersectionResponse } from "./models/IntersectionResponse";
import { apiPort } from "../main";

const baseUrl = `http://localhost:${apiPort}/api/`;

export async function intersect(listA: string[], listB: string[]): Promise<IntersectionResponse> {
  try {
    const result = await axios.post(
      baseUrl + "intersect", 
      {listA, listB}
    );
    return result.data; 
  } catch(error: unknown) {
    throw new Error("Cannot connect to server, try again later.");
  }
}