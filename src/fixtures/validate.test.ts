import { describe, expect, it } from "vitest";
import { layouts } from "./layouts";
import { menuItems } from "./menus";
import { personas } from "./personas";
import { validateFixtures } from "./validate";
import { venues } from "./venues";

describe("synthetic fixture invariants", () => {
  it("keeps entity relationships valid and all top-level fixtures synthetic", () => {
    expect(validateFixtures({ personas, venues, layouts, menuItems })).toEqual([]);
  });

  it("keeps regulated gaming zones outside customer-visible recommendations", () => {
    const visibleZones = venues.flatMap((venue) =>
      venue.zones.filter((zone) => zone.customerVisible),
    );
    expect(visibleZones.some((zone) => zone.kind === "Gaming Room")).toBe(false);
  });
});
