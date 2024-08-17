import { Controller, Get, Route } from "tsoa";
import { IntersectionResponse } from '../models/IntersectionResponse.js';
import { intersect, optimizedIntersect } from '../components/intersect.js';

function getTimestamp() {
  let d = new Date();
  return d.getTime();
}

/**
 * Players controller
 */

@Route("intersect")
export class Intersection extends Controller {

  @Get()
  public async getIntersection(): Promise<IntersectionResponse> {
    try {
      this.setStatus(200);

      const timeStart: number = getTimestamp();
      const intersection: string[] = intersect(["a", "b", "c"], ["b", "c", "d"]);
      const timeEnd: number = getTimestamp();

      const optimizedTimeStart: number = getTimestamp();
      const optimizedIntersection: string[] = optimizedIntersect(["a", "b", "c"], ["b", "c", "d"]);
      const optimizedTimeEnd: number = getTimestamp();

      return {
        intersection,
        calculationTimeMs: timeEnd - timeStart,
        
        optimizedIntersection,
        optimizedCalculationTimeMs: optimizedTimeEnd - optimizedTimeStart
      };
    } catch (error: any) {
      this.setStatus(500);
      return error.message; 
    }  
  }
}