import { beforeEach, describe, expect, it } from "vitest";
import { matchIntent } from "../assistant/intents";
import { demoRepository } from "../../services/demoRepository";
import { phoneCallScenarios } from "../../fixtures/operations";
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
        bookingState: "held",
        selectedZoneId: "harbour-bistro",
        selectedTableValid: true,
        courtesyBus: true,
        stage: "before-visit",
        rideBooked: false,
        orderState: "draft",
        groupParticipantStates: ["pending"],
        screenRequestState: "idle",
        returnPassengers: 0,
        serviceRequestState: null,
      }),
    ).toEqual({ label: "Confirm your visit", route: "/visit" });
    expect(
      getHomeNextAction({
        bookingState: "confirmed",
        selectedZoneId: "harbour-bistro",
        selectedTableValid: true,
        courtesyBus: true,
        stage: "in-venue",
        rideBooked: true,
        orderState: "draft",
        groupParticipantStates: ["accepted"],
        screenRequestState: "idle",
        returnPassengers: 6,
        serviceRequestState: null,
      }).route,
    ).toBe("/order/group");
  });

  it("uses safe-travel wording without outranking a no-bus venue booking", () => {
    const base = {
      selectedZoneId: "north-sports",
      selectedTableValid: true,
      courtesyBus: false,
      stage: "before-visit" as const,
      rideBooked: false,
      orderState: "submitted" as const,
      groupParticipantStates: ["accepted" as const],
      screenRequestState: "active" as const,
      returnPassengers: 0,
      serviceRequestState: null,
    };
    expect(getHomeNextAction({ ...base, bookingState: "held" }).label).toBe("Confirm your visit");
    expect(getHomeNextAction({ ...base, bookingState: "confirmed" })).toEqual({
      label: "Review safe travel options",
      route: "/ride",
    });
    expect(
      getHomeNextAction({
        ...base,
        bookingState: "confirmed",
        serviceRequestState: "accepted",
      }),
    ).toEqual({
      label: "View active service request",
      route: "service",
    });
  });

  it("matches the new structured Ask Star workflows", () => {
    expect(
      matchIntent("Find somewhere in the Sports Bar where six of us can watch the Cowboys game."),
    ).toBe("sports-table");
    expect(matchIntent("Order a round for four adults.")).toBe("group-round");
    expect(matchIntent("Can I listen to Screen 7?")).toBe("listen-screen");
  });

  it("writes the complete Harbour phone outcome into visit and ride state", () => {
    useDemoStore.getState().completePhoneScenario(phoneCallScenarios[0]!);
    expect(useDemoStore.getState()).toMatchObject({
      phoneCallState: "completed",
      venueId: "harbour",
      selectedZoneId: "harbour-bistro",
      selectedTableId: "table-23",
      layoutPresetId: "thursday-draw",
      partySize: 6,
      arrivalTime: "6:45 pm",
      bookingState: "confirmed",
      rideBooked: true,
      inboundPassengers: 2,
      inboundWindow: "6:15 pm - 6:45 pm",
    });
  });

  it("writes the complete UFC phone outcome without a courtesy-bus booking", () => {
    useDemoStore.getState().completePhoneScenario(phoneCallScenarios[1]!);
    expect(useDemoStore.getState()).toMatchObject({
      phoneCallState: "completed",
      venueId: "northside",
      selectedZoneId: "north-sports",
      selectedTableId: "north-12",
      layoutPresetId: "ufc-night",
      partySize: 4,
      arrivalTime: "7:30 pm",
      bookingState: "confirmed",
      rideBooked: false,
      inboundPassengers: 0,
    });
  });

  it("preserves visit state and the shown transcript during an allergy transfer", () => {
    useDemoStore.setState({
      venueId: "hinterland",
      selectedZoneId: "hinterland-dining",
      selectedTableId: "hinterland-4",
      bookingState: "checked-in",
      partySize: 3,
      phoneTranscriptTurnCount: 3,
    });
    const before = useDemoStore.getState();
    const allergy = phoneCallScenarios[2]!;
    useDemoStore.getState().completePhoneScenario(allergy);
    expect(useDemoStore.getState()).toMatchObject({
      venueId: before.venueId,
      selectedZoneId: before.selectedZoneId,
      selectedTableId: before.selectedTableId,
      bookingState: before.bookingState,
      partySize: before.partySize,
      phoneCallState: "human-transfer",
      phoneTranscriptTurnCount: allergy.turns.length,
    });
    useDemoStore.getState().setPhoneCallState("human-transfer");
    expect(useDemoStore.getState().phoneTranscriptTurnCount).toBe(allergy.turns.length);
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

  it("executes Table Service and Phone Receptionist presentation setup", () => {
    useDemoStore.getState().applyPresentationStep(6);
    expect(useDemoStore.getState().drinkOrder).toMatchObject({
      itemId: "harbour-lager",
      state: "staff-review",
    });
    expect(
      useDemoStore
        .getState()
        .groupRound.participants.find((participant) => participant.id === "round-alex")?.acceptance,
    ).toBe("age-check");
    useDemoStore.getState().applyPresentationStep(7);
    expect(useDemoStore.getState()).toMatchObject({
      screenRequestScreenId: "screen-7",
      screenRequestState: "requested",
      phoneAudioState: "active",
      phoneAudioScreenId: "screen-7",
    });
    useDemoStore.getState().applyPresentationStep(8);
    expect(useDemoStore.getState()).toMatchObject({
      presentationStep: 8,
      serviceOpen: true,
      phoneOpen: false,
    });
    useDemoStore.getState().applyPresentationStep(11);
    expect(useDemoStore.getState()).toMatchObject({
      venueId: "harbour",
      presentationStep: 11,
      serviceOpen: false,
      phoneOpen: true,
      phoneScenarioId: "call-usual",
    });
    useDemoStore.getState().applyPresentationStep(12);
    expect(useDemoStore.getState().venueId).toBe("northside");
    useDemoStore.getState().previousPresentationStep();
    expect(useDemoStore.getState()).toMatchObject({
      venueId: "harbour",
      presentationStep: 11,
      phoneOpen: true,
    });
  });

  it("replaces a selected table when a preset hides it", () => {
    useDemoStore.getState().selectTable("table-18");
    useDemoStore.getState().setLayoutPreset("large-birthday");
    expect(useDemoStore.getState().selectedTableId).not.toBe("table-18");
    expect(useDemoStore.getState().notice).toContain("selected instead");
  });

  it("adds a zero-cost water assignment for every participant", () => {
    useDemoStore.getState().addWaterForEveryone();
    expect(useDemoStore.getState().groupRound.addOns).toContainEqual({
      id: "round-table-water",
      synthetic: true,
      name: "Table water",
      quantity: 4,
      unitPrice: 0,
    });
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
