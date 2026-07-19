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
});
