import { expect, describe, it } from 'vitest'
import { ListDisplay } from './ListDisplay';
import {render, screen} from '@testing-library/react'
import '@testing-library/dom'

describe("Test List Display", () => {
  it("should display list", async () => {
    render(
      <ListDisplay name="Test Name" list={["a", "b", "c"]}/>
    );
    screen.debug(await screen.findByText("[a, b, c]"));
    
    expect(await screen.findByText("[a, b, c]")).toBeTruthy();
  });
})

