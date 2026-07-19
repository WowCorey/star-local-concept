import { describe, expect, it } from "vitest";
import { matchIntent } from "./intents";

describe("scripted assistant intent matching", () => {
  it.each([
    ["Book our usual table for Thursday", "book-usual"],
    ["Make my parmi with barbecue sauce", "modify-meal"],
    ["When is the bus arriving?", "bus-status"],
    ["Put the Cowboys game on near us", "screen-request"],
    ["Show what you remember about me", "show-memory"],
    ["I need a staff member", "human"],
    ["Can I reserve a gaming machine?", "gaming-boundary"],
  ])("maps %s to %s", (input, expected) => {
    expect(matchIntent(input)).toBe(expected);
  });

  it("falls back honestly for unsupported requests", () => {
    expect(matchIntent("Predict next month's weather")).toBe("unknown");
  });
});
