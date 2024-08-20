import { expect, describe, it, afterEach, beforeAll, afterAll } from 'vitest'
import IntersectionGUI from './IntersectionGUI';
import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event';
import {http, HttpResponse} from 'msw';
import {setupServer} from 'msw/node';

const server = setupServer(
  http.get('/greeting', () => {
    return HttpResponse.json({greeting: 'hello there'})
  }),
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe("While testing IntersectionGUI", () => {
  afterEach(() => {
    cleanup();
  });

  it("should display name", async () => {
    render(<IntersectionGUI/>);
    
    expect(await screen.findByText("Intersection Tool")).not.toBeNull();
  });

  it("should show intersection given by server", async () => {
    const user = userEvent.setup();

    server.use(
      http.post('/api/intersect', () => {
        return new HttpResponse(JSON.stringify({intersection: ["a", "b", "c"], calculationTimeMs: 1}), {status: 200})
      }),
    )

    render(<IntersectionGUI/>);
    
    await user.click(screen.getByText("Generate Lists"));
    await user.click(screen.getByText("Calculate Intersection"));
    
    const intersection = screen.getByText("[a, b, c]");
    
    expect(intersection).not.toBeNull();
  });
});

