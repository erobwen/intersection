import { expect, describe, it, afterEach } from 'vitest'
import { ListDisplay } from './ListDisplay';
import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event';

describe("While testing ListDisplay", () => {
  afterEach(() => {
    cleanup();
  });

  it("should display name", async () => {
    render(
      <ListDisplay name="Test Name" list={["a", "b", "c"]}/>
    );
    
    expect(await screen.findByText("Test Name")).not.toBeNull();
  });

  it("should display list", async () => {
    render(
      <ListDisplay name="Test Name" list={["a", "b", "c"]}/>
    );
    
    expect(await screen.findByText("[a, b, c]")).not.toBeNull();
  });

  it("should open details dialog when clicked on", async () => {
    const user = userEvent.setup();

    render(
      <ListDisplay name="Test Name" list={["a", "b", "c"]}/>
    );
    
    await user.click(await screen.getByText("[a, b, c]"));
    
    const closeButton = await screen.getByText("Close");
    
    expect(closeButton).not.toBeNull();
  });
});


