import { Controller, Post, Route, Response, Body, SuccessResponse } from "tsoa";
import { IntersectionResponse } from '../models/IntersectionResponse.js';
import { intersect, optimizedIntersect } from '../components/intersect.js';
import { IntersectionRequest } from "../models/IntersectionRequest.js";
import { getTimestamp } from "../components/utility.js";


/**
 * Intersection controller
 */

@Route("intersect")
export class Intersection extends Controller {

  @Response("500", "Internal server error")
  @SuccessResponse("200", "Calculated intersection")
  @Post()
  public async intersect(@Body() request: IntersectionRequest): Promise<IntersectionResponse|string> {
    
    const { listA, listB } = request;

    try {
      this.setStatus(200);

      const timeStart: number = getTimestamp();
      const intersection: string[] = intersect(listA, listB);
      const timeEnd: number = getTimestamp();

      const optimizedTimeStart: number = getTimestamp();
      const optimizedIntersection: string[] = optimizedIntersect(listA, listB);
      const optimizedTimeEnd: number = getTimestamp();

      return {
        intersection,
        calculationTimeMs: timeEnd - timeStart,
        
        optimizedIntersection,
        optimizedCalculationTimeMs: optimizedTimeEnd - optimizedTimeStart
      };
    } catch (error: unknown) {
      this.setStatus(500);
      return (error instanceof Error) ? (error as Error).message : ""; 
    }   
  }
}