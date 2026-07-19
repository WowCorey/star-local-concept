import { layoutPresets } from "../../fixtures/layoutPresets";
import { screenSchedules } from "../../fixtures/entertainment";
import { serviceTeams } from "../../fixtures/operations";
import type {
  BookingState,
  LayoutPresetId,
  OrderState,
  ParticipantAcceptance,
  ScreenRequestState,
  ServiceTeamId,
  ServiceState,
  TableFilter,
  VenueScreen,
  VenueTable,
  VisitStage,
} from "../../types/domain";

export function tableMatchesFilter(table: VenueTable, filter: TableFilter): boolean {
  if (table.matchTags?.includes(filter)) return true;
  const matches: Record<TableFilter, boolean> = {
    family: table.familySuitable,
    "screen-view": table.nearbyScreenIds.length > 0,
    quiet: table.noiseLevel === "quiet",
    "step-free": table.accessibility,
    outdoor: Boolean(table.outdoor),
    amenities: Boolean(table.nearAmenities),
    "standard-height": table.tableType === "standard" || table.tableType === "low",
    "high-table": table.tableType === "high",
    "large-group": table.maximumCapacity >= 6,
    "live-entertainment": Boolean(table.nearEntertainment),
  };
  return matches[filter];
}

export function tableMatchReasons(table: VenueTable, filters: TableFilter[]): string[] {
  return filters
    .filter((filter) => tableMatchesFilter(table, filter))
    .map((filter) => filter.replaceAll("-", " "));
}

export function applyLayoutPreset(table: VenueTable, presetId: LayoutPresetId): VenueTable | null {
  const preset = layoutPresets.find((item) => item.id === presetId);
  if (!preset || preset.hiddenTableIds.includes(table.id)) return preset ? null : table;
  const shift = preset.positionShift[table.id];
  return shift ? { ...table, ...shift } : table;
}

export function canRequestScreen(screen: VenueScreen): boolean {
  return screen.screenClass === "requestable";
}

export function getNearbyScreenSchedules(venueId: string, tableId: string) {
  return screenSchedules.filter(
    (schedule) =>
      schedule.venueId === venueId &&
      schedule.viewQualityByTable[tableId] &&
      schedule.viewQualityByTable[tableId] !== "none",
  );
}

export function routeServiceRequest(kind: string): ServiceTeamId {
  const value = kind.toLowerCase();
  if (value.includes("first aid") || value.includes("urgent")) return "immediate-human";
  if (value.includes("accessibility") || value.includes("manager") || value.includes("person"))
    return "duty-manager";
  if (value.includes("drink") || value.includes("bar")) return "bar-team";
  if (
    value.includes("meal") ||
    value.includes("sauce") ||
    value.includes("cutlery") ||
    value.includes("high chair")
  )
    return "bistro-team";
  return "floor-team";
}

export function getServiceTeam(kind: string) {
  const id = routeServiceRequest(kind);
  return serviceTeams.find((team) => team.id === id)!;
}

export function getHomeNextAction(input: {
  bookingState: BookingState;
  selectedZoneId: string | null;
  selectedTableValid: boolean;
  courtesyBus: boolean;
  stage: VisitStage;
  rideBooked: boolean;
  orderState: OrderState;
  groupParticipantStates: ParticipantAcceptance[];
  screenRequestState: ScreenRequestState;
  returnPassengers: number;
  serviceRequestState: ServiceState | null;
}) {
  if (input.stage === "after-visit")
    return { label: "Review receipt and memories", route: "/me/receipts" };
  if (["suggested", "held", "changed", "cancelled"].includes(input.bookingState))
    return {
      label: input.bookingState === "changed" ? "Review changed booking" : "Confirm your visit",
      route: "/visit",
    };
  if (!input.selectedZoneId || !input.selectedTableValid)
    return { label: "Choose a valid zone and table", route: "/visit/floor-plan" };
  if (input.courtesyBus && !input.rideBooked)
    return { label: "Plan courtesy transport", route: "/ride" };
  if (input.stage === "approaching") return { label: "Check in at your table", route: "/visit" };
  if (
    input.stage === "in-venue" &&
    (["draft", "awaiting-confirmation"].includes(input.orderState) ||
      input.groupParticipantStates.includes("pending"))
  )
    return { label: "Start the group order", route: "/order/group" };
  if (
    input.stage === "in-venue" &&
    ["idle", "requested", "scheduled"].includes(input.screenRequestState)
  )
    return {
      label:
        input.screenRequestState === "idle"
          ? "Check what is starting near you"
          : "View your screen request",
      route: "/visit/watch",
    };
  if (input.stage === "in-venue" && input.courtesyBus && input.returnPassengers === 0)
    return { label: "Confirm the return ride", route: "/ride" };
  if (!input.courtesyBus) return { label: "Review safe travel options", route: "/ride" };
  if (input.serviceRequestState && input.serviceRequestState !== "completed")
    return { label: "View active service request", route: "service" };
  return { label: "Review tonight's plan", route: "/visit" };
}
