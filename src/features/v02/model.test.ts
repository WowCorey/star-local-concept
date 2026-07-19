import { beforeEach, describe, expect, it } from "vitest";
import { matchIntent } from "../assistant/intents";
import { demoRepository } from "../../services/demoRepository";
import { initialData, migrateDemoState, useDemoStore } from "../../state/demoStore";
import {
  applyLayoutPreset,
  canRequestScreen,
  getHomeNextAction,
  getNearbyScreenSchedules,
  routeServiceRequest,
  tableMatchesFilter,
} from "./model";

describe("Star Local v0.2 operating model", () => {
  beforeEach(() => {
    useDemoStore.getState().resetDemo();
    useDemoStore.getState().setNotice(null);
  });

  it("changes available tables with the selected zone", () => {
    expect(
      demoRepository.getZoneTables("harbour", "harbour-bistro").map((table) => table.id),
    ).toContain("table-23");
    expect(
      demoRepository.getZoneTables("harbour", "harbour-sports").map((table) => table.id),
    ).toEqual(["harbour-s12", "harbour-s14"]);
  });

  it("keeps zone floor plans meaningfully different", () => {
    const bistro = demoRepository.getZoneTables("harbour", "harbour-bistro");
    const sports = demoRepository.getZoneTables("harbour", "harbour-sports");
    expect(bistro.some((table) => table.familySuitable)).toBe(true);
    expect(sports.every((table) => table.noiseLevel === "lively")).toBe(true);
  });

  it("moves tables when a layout preset changes", () => {
    const table = demoRepository
      .getLayout("harbour")
      .tables.find((item) => item.id === "table-20")!;
    expect(applyLayoutPreset(table, "weekday-lunch")).toMatchObject({ x: 33, y: 22 });
    expect(applyLayoutPreset(table, "thursday-draw")).toMatchObject({ x: table.x, y: table.y });
  });

  it("matches floor-plan filters from explicit table attributes", () => {
    const table = demoRepository
      .getLayout("harbour")
      .tables.find((item) => item.id === "table-23")!;
    expect(tableMatchesFilter(table, "family")).toBe(true);
    expect(tableMatchesFilter(table, "screen-view")).toBe(true);
    expect(tableMatchesFilter(table, "high-table")).toBe(false);
  });

  it("prevents requests to locked screens", () => {
    const locked = demoRepository
      .getVenue("harbour")
      .screens.find((screen) => screen.screenClass === "locked")!;
    expect(canRequestScreen(locked)).toBe(false);
  });

  it("allows requests to requestable screens", () => {
    const requestable = demoRepository
      .getVenue("harbour")
      .screens.find((screen) => screen.screenClass === "requestable")!;
    expect(canRequestScreen(requestable)).toBe(true);
  });

  it("changes nearby screens with the selected table", () => {
    expect(getNearbyScreenSchedules("harbour", "table-23").map((item) => item.screenId)).toContain(
      "screen-7",
    );
    expect(getNearbyScreenSchedules("harbour", "table-26")).toEqual([]);
  });

  it("transitions phone audio locally", () => {
    useDemoStore.getState().setPhoneAudioState("active", "screen-7");
    expect(useDemoStore.getState()).toMatchObject({
      phoneAudioState: "active",
      phoneAudioScreenId: "screen-7",
    });
    useDemoStore.getState().setPhoneAudioState("paused", "screen-7");
    expect(useDemoStore.getState().phoneAudioState).toBe("paused");
  });

  it("routes an age-restricted drink through staff review", () => {
    useDemoStore.getState().chooseDrink("harbour-lager", "Schooner");
    useDemoStore.getState().setDrinkOrderState("staff-review");
    expect(useDemoStore.getState()).toMatchObject({
      staffReview: true,
      drinkOrder: { itemId: "harbour-lager", state: "staff-review" },
    });
  });

  it("retains calm alternatives after a declined drink", () => {
    useDemoStore.getState().chooseDrink("harbour-lager", "Schooner");
    useDemoStore.getState().setDrinkOrderState("declined");
    expect(useDemoStore.getState().drinkOrder.state).toBe("declined");
  });

  it("records participant acceptance in a group round", () => {
    useDemoStore.getState().setParticipantAcceptance("round-jordan", "accepted");
    expect(
      useDemoStore.getState().groupRound.participants.find((item) => item.id === "round-jordan")
        ?.acceptance,
    ).toBe("accepted");
  });

  it.each([
    ["Sauce", "bistro-team"],
    ["Missing drink", "bar-team"],
    ["Clean table", "floor-team"],
    ["Accessibility assistance", "duty-manager"],
    ["First aid / urgent assistance", "immediate-human"],
  ])("routes %s to %s", (kind, team) => {
    expect(routeServiceRequest(kind)).toBe(team);
  });

  it("selects a dynamic Home next action", () => {
    expect(
      getHomeNextAction({
        stage: "before-visit",
        rideBooked: false,
        orderState: "draft",
        screenRequestState: "idle",
        returnPassengers: 0,
        serviceRequestState: null,
      }),
    ).toEqual({ label: "Plan a safe ride", route: "/ride" });
    expect(
      getHomeNextAction({
        stage: "in-venue",
        rideBooked: true,
        orderState: "draft",
        screenRequestState: "idle",
        returnPassengers: 6,
        serviceRequestState: null,
      }).route,
    ).toBe("/order/group");
  });

  it("matches the new structured Ask Star workflows", () => {
    expect(
      matchIntent("Find somewhere in the Sports Bar where six of us can watch the Cowboys game."),
    ).toBe("sports-table");
    expect(matchIntent("Order a round for four adults.")).toBe("group-round");
    expect(matchIntent("Can I listen to Screen 7?")).toBe("listen-screen");
  });

  it("creates booking and ride state from the phone scenario", () => {
    useDemoStore.getState().completePhoneScenario(true);
    expect(useDemoStore.getState()).toMatchObject({
      phoneCallState: "completed",
      bookingState: "confirmed",
      rideBooked: true,
    });
  });

  it("supports marketing explanation and dismissal", () => {
    useDemoStore.getState().setMarketingInteraction("dismissed");
    expect(useDemoStore.getState().marketingInteraction).toBe("dismissed");
    expect(demoRepository.getCampaigns("harbour")[0]?.excludedInputs).toContain("Gaming data");
  });

  it("advances bottle-shop collection states", () => {
    useDemoStore.getState().setBottleShopItem("shop-pale-six");
    useDemoStore.getState().setBottleShopState("reserved");
    expect(useDemoStore.getState().bottleShopCollection).toMatchObject({
      itemId: "shop-pale-six",
      state: "reserved",
      token: "LOCAL-482",
    });
  });

  it("navigates presentation mode deterministically", () => {
    useDemoStore.getState().startPresentation();
    useDemoStore.getState().nextPresentationStep();
    expect(useDemoStore.getState()).toMatchObject({
      presentationActive: true,
      presentationStep: 1,
    });
    useDemoStore.getState().previousPresentationStep();
    expect(useDemoStore.getState().presentationStep).toBe(0);
  });

  it("migrates v1 localStorage state with safe v0.2 defaults", () => {
    const migrated = migrateDemoState(
      {
        ...initialData(),
        selectedZoneId: undefined,
        layoutPresetId: undefined,
        drinkOrder: undefined,
      },
      1,
    );
    expect(migrated).toMatchObject({
      selectedZoneId: "harbour-bistro",
      layoutPresetId: "thursday-draw",
      phoneAudioState: "available",
    });
    expect(migrated.notice).toContain("safely upgraded");
  });
});
