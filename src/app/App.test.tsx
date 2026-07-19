import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { useDemoStore } from "../state/demoStore";
import { App } from "./App";

describe("Star Local app shell", () => {
  beforeEach(() => {
    useDemoStore.getState().resetDemo();
    useDemoStore.getState().setNotice(null);
  });

  it("renders the flagship next action and primary navigation", async () => {
    render(<App />);
    expect(await screen.findByRole("heading", { name: "Good evening, Alex" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Your usual Thursday night?" })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Primary navigation" })).toBeInTheDocument();
  });

  it("opens the scripted assistant with keyboard-usable prompts", async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findByRole("heading", { name: "Good evening, Alex" });
    await user.click(screen.getByRole("button", { name: "Ask Star" }));
    expect(screen.getByRole("dialog", { name: "Ask Star" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "When is the bus arriving?" }));
    expect(screen.getByRole("heading", { name: "Your private ride status" })).toBeInTheDocument();
  });

  it("moves focus into a dialog, traps it, and restores the trigger on close", async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findByRole("heading", { name: "Good evening, Alex" });
    const trigger = screen.getByRole("button", { name: "Ask Star" });
    await user.click(trigger);
    const dialog = screen.getByRole("dialog", { name: "Ask Star" });
    expect(dialog).toContainElement(document.activeElement as HTMLElement);
    expect(screen.getByRole("main")).toHaveProperty("inert", true);
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog", { name: "Ask Star" })).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("warns before an urgent assistance view is dismissed", async () => {
    const user = userEvent.setup();
    useDemoStore.setState({ stage: "in-venue" });
    useDemoStore.getState().requestService("First aid / urgent assistance");
    render(<App />);
    const dialog = await screen.findByRole("dialog", { name: "Table Service" });
    await user.keyboard("{Escape}");
    expect(dialog).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent("Urgent request remains active");
    await user.click(screen.getByRole("button", { name: "Close view and keep request active" }));
    expect(screen.queryByRole("dialog", { name: "Table Service" })).not.toBeInTheDocument();
    expect(useDemoStore.getState().serviceRequest?.state).toBe("requested");
  });
});
