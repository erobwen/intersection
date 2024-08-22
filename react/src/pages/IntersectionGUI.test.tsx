import { expect, describe, it, afterEach, beforeAll, afterAll, vi } from 'vitest'
import IntersectionGUI from './IntersectionGUI';
import { render, screen, cleanup, waitForElementToBeRemoved } from '@testing-library/react'
import userEvent from '@testing-library/user-event';
import {http, HttpResponse} from 'msw';
import {setupServer} from 'msw/node';
import '@vitest/web-worker';
import ListCreatorWebWorker from "../webworker/listCreator?worker";
// import { ListCreatorWorkerResponse } from '../webworker/ListCreatorWorkerResponse';
// import { ListCreatorWorkerRequest } from '../webworker/ListCreatorWorkerRequest';

const server = setupServer(
  http.get('/greeting', () => {
    return HttpResponse.json({greeting: 'hello there'})
  }),
)

beforeAll(() => server.listen())
afterEach(() => {
  vi.restoreAllMocks()
  server.resetHandlers()
})
  
afterAll(() => server.close())


// class WorkerMock {
//   url: string;
//   onmessage: (handler: MessageEvent<ListCreatorWorkerResponse>) => void;
//   constructor(stringUrl: string) {
//     this.url = stringUrl;
//     this.onmessage = ()=> {};
//   }
//   postMessage(msg: ListCreatorWorkerRequest): void {
//     this.onmessage(msg);
//   }
// }

// type MessageHandler = (msg: string) => void;

// class Worker {
//     url: string;
//     onmessage: MessageHandler;
//     constructor(stringUrl: string) {
//         this.url = stringUrl;
//         this.onmessage = () => {};
//     }
//     postMessage(msg: string): void {
//         this.onmessage(msg);
//     }
// }

// vi.stubGlobal('Worker', Worker)

describe("While testing IntersectionGUI", () => {
  afterEach(() => {
    cleanup();
  });

  it("should display name", async () => {
    let worker = new ListCreatorWebWorker();
    render(<IntersectionGUI givenWorker={worker}/>);
    
    expect(await screen.findByText("This tool allows you to caclulate intersections of random lists.")).not.toBeNull();
  });

  it("should show intersection given by server", async () => {
    const user = userEvent.setup();

    server.use(
      http.post('/api/intersect', () => {
        return new HttpResponse(JSON.stringify({intersection: ["a", "b", "c"], calculationTimeMs: 1}), {status: 200})
      }),
    )
    let worker = new ListCreatorWebWorker();
    render(<IntersectionGUI givenWorker={worker}/>);
    
    await user.click(screen.getByText("Generate Lists"));
    await waitForElementToBeRemoved(screen.getByRole("progressbar"));
    await user.click(screen.getByText("Calculate Intersection"));

    
    const intersection = screen.getByText("[a, b, c]");
    
    expect(intersection).not.toBeNull();
  });
});

