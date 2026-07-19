import { beforeEach, describe, expect, it } from "vitest";
import { useDemoStore } from "./demoStore";

describe("demo state transitions", () => {
  beforeEach(() => {
    useDemoStore.getState().resetDemo();
    useDemoStore.getState().setNotice(null);
  });

  it("completes the key flagship transitions", () => {
    const store = useDemoStore.getState();
    store.confirmVisit();
    expect(useDemoStore.getState().bookingState).toBe("confirmed");

    store.checkIn();
    expect(useDemoStore.getState()).toMatchObject({
      bookingState: "checked-in",
      stage: "in-venue",
    });

    store.chooseOrder("harbour-parmi", "usual");
    expect(useDemoStore.getState()).toMatchObject({
      orderState: "awaiting-confirmation",
      orderModifier: "usual",
    });

    store.setOrderState("submitted");
    store.setScreenRequestState("approved");
    expect(useDemoStore.getState()).toMatchObject({
      orderState: "submitted",
      screenRequestState: "approved",
    });
  });

  it("switches persona and venue together for scenario presets", () => {
    useDemoStore.getState().loadScenario("accessibility");
    expect(useDemoStore.getState()).toMatchObject({
      personaId: "taylor",
      venueId: "hinterland",
      selectedTableId: "hinterland-4",
    });

    useDemoStore.getState().loadScenario("sports-night");
    expect(useDemoStore.getState()).toMatchObject({
      personaId: "jordan",
      venueId: "northside",
      preferredZone: "Sports Bar",
    });
  });

  it("persists demo state to localStorage and resets cleanly", () => {
    useDemoStore.getState().setPartySize(8);
    expect(window.localStorage.getItem("star-local-demo-v1")).toContain('"partySize":8');
    useDemoStore.getState().resetDemo();
    expect(useDemoStore.getState().partySize).toBe(6);
  });
});
