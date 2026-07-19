import { describe, expect, it } from "vitest";
import { layouts } from "./layouts";
import { layoutPresets } from "./layoutPresets";
import { menuItems } from "./menus";
import { drinkItems } from "./drinks";
import { entertainmentEvents, screenSchedules } from "./entertainment";
import { bottleShopItems, marketingCampaigns, phoneCallScenarios } from "./operations";
import { personas } from "./personas";
import { presentationSteps } from "./presentation";
import { validateFixtures, validateV02Fixtures } from "./validate";
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

  it("keeps every v0.2 fixture synthetic and cross-referenced", () => {
    expect(
      validateV02Fixtures({
        venues,
        drinks: drinkItems,
        presets: layoutPresets,
        schedules: screenSchedules,
        events: entertainmentEvents,
        campaigns: marketingCampaigns,
        collectionItems: bottleShopItems,
        phoneScenarios: phoneCallScenarios,
        presentationSteps,
      }),
    ).toEqual([]);
  });
});
