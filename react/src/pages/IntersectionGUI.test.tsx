import { expect, describe, it, afterEach, beforeAll, afterAll, vi } from 'vitest'
import IntersectionGUI from './IntersectionGUI';
import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event';
import {http, HttpResponse} from 'msw';
import {setupServer} from 'msw/node';
import '@vitest/web-worker';
import ListCreatorWebWorker from "../webworker/listCreator?worker";


describe("While testing IntersectionGUI", () => {
  
  const server = setupServer(
    http.get('/greeting', () => {
      return HttpResponse.json({greeting: 'hello there'})
    }),
  )
  
  const worker = new ListCreatorWebWorker();

  beforeAll(() => server.listen())
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks()
    server.resetHandlers()
  });  
  afterAll(() => server.close())

  it("should display name", async () => {
    render(<IntersectionGUI createListsWorker={worker}/>);
    
    expect(await screen.findByText("This tool allows you to caclulate intersections of random lists.")).not.toBeNull();
  });

  it("should show intersection given by server", async () => {
    const user = userEvent.setup();

    server.use(
      http.post('/api/intersect', () => {
        return new HttpResponse(JSON.stringify({intersection: ["a", "b", "c"], calculationTimeMs: 1}), {status: 200})
      }),
    )

    render(<IntersectionGUI createListsWorker={worker}/>);
    
    await user.click(screen.getByText("Generate Lists"));
    await user.click(screen.getByText("Calculate Intersection"));

    const intersection = screen.getByText("[a, b, c]");
    
    expect(intersection).not.toBeNull();
  });
});

