import { create } from "zustand";
import { persist } from "zustand/middleware";
import { personas } from "../fixtures/personas";
import { venues } from "../fixtures/venues";
import { layouts } from "../fixtures/layouts";
import { routeServiceRequest } from "../features/v02/model";
import type {
  AccessibilityPreferences,
  BookingState,
  BottleShopCollection,
  BottleShopCollectionState,
  BusState,
  CommunicationPreferences,
  DrinkOrder,
  DrinkOrderState,
  GroupRound,
  LayoutPresetId,
  MarketingInteraction,
  MarketingLevel,
  MemoryItem,
  OrderState,
  ParticipantAcceptance,
  PersonaId,
  PhoneAudioState,
  PhoneCallState,
  ScreenRequestState,
  ServiceRequest,
  ServiceState,
  TableFilter,
  VenueId,
  VisitStage,
} from "../types/domain";

export type DemoScenario =
  | "flagship"
  | "sports-night"
  | "accessibility"
  | "executive"
  | "drinks-service"
  | "television"
  | "phone-reception";

export interface DemoData {
  personaId: PersonaId;
  venueId: VenueId;
  simulatedDay: string;
  simulatedTime: string;
  stage: VisitStage;
  bookingState: BookingState;
  selectedZoneId: string;
  selectedTableId: string;
  layoutPresetId: LayoutPresetId;
  tableFilters: TableFilter[];
  partySize: number;
  arrivalTime: string;
  preferredZone: string;
  highChair: boolean;
  quieterSeating: boolean;
  screenVisibility: boolean;
  rideState: BusState;
  rideBooked: boolean;
  inboundPassengers: number;
  returnPassengers: number;
  inboundWindow: string;
  returnWindow: string;
  orderState: OrderState;
  orderItemId: string | null;
  orderModifier: "usual" | "standard" | "custom" | null;
  groupPayment: "mine" | "even" | "items" | "staff" | null;
  drinkOrder: DrinkOrder;
  groupRound: GroupRound;
  screenRequestState: ScreenRequestState;
  screenRequestScreenId: string | null;
  screenRequestContent: string | null;
  watchReminder: boolean;
  phoneAudioState: PhoneAudioState;
  phoneAudioScreenId: string | null;
  phoneAudioVolume: number;
  serviceRequestKind: string | null;
  serviceRequestState: ServiceState | null;
  serviceRequest: ServiceRequest | null;
  kitchenWaitTime: number;
  barWaitTime: number;
  activePromotion: string;
  marketingLevel: MarketingLevel;
  marketingInteraction: MarketingInteraction;
  staffReview: boolean;
  phoneAudioAvailable: boolean;
  soldOutItemIds: string[];
  bottleShopCollection: BottleShopCollection;
  phoneScenarioId: string;
  phoneCallState: PhoneCallState;
  drawEntries: number;
  drawCountdown: number;
  fictionalDrawResult: "pending" | "not-selected" | "selected";
  presentationActive: boolean;
  presentationStep: number;
  memories: Record<PersonaId, MemoryItem[]>;
  accessibility: Record<PersonaId, AccessibilityPreferences>;
  communications: Record<PersonaId, CommunicationPreferences>;
  demoOpen: boolean;
  assistantOpen: boolean;
  serviceOpen: boolean;
  phoneOpen: boolean;
  notice: string | null;
}

interface DemoActions {
  setPersona: (id: PersonaId) => void;
  setVenue: (id: VenueId) => void;
  setStage: (stage: VisitStage) => void;
  setSimulatedDay: (day: string) => void;
  setSimulatedTime: (time: string) => void;
  setBookingState: (state: BookingState) => void;
  confirmVisit: () => void;
  cancelVisit: () => void;
  checkIn: () => void;
  selectZone: (zoneId: string) => void;
  selectTable: (tableId: string) => void;
  setLayoutPreset: (preset: LayoutPresetId) => void;
  toggleTableFilter: (filter: TableFilter) => void;
  clearTableFilters: () => void;
  setPartySize: (size: number) => void;
  setArrivalTime: (time: string) => void;
  setPreferredZone: (zone: string) => void;
  toggleBookingPreference: (
    preference: "highChair" | "quieterSeating" | "screenVisibility",
  ) => void;
  setRideState: (state: BusState) => void;
  confirmRide: () => void;
  setRidePassengers: (leg: "inbound" | "return", count: number) => void;
  setRideWindow: (leg: "inbound" | "return", window: string) => void;
  chooseOrder: (itemId: string, modifier: "usual" | "standard" | "custom") => void;
  setOrderState: (state: OrderState) => void;
  setGroupPayment: (method: "mine" | "even" | "items" | "staff") => void;
  chooseDrink: (itemId: string, size: string, participantId?: string) => void;
  setDrinkOrderState: (state: DrinkOrderState) => void;
  assignRoundItem: (participantId: string, itemId: string | null) => void;
  setParticipantAcceptance: (participantId: string, state: ParticipantAcceptance) => void;
  addWaterForEveryone: () => void;
  setScreenRequestState: (state: ScreenRequestState) => void;
  requestScreen: (screenId: string, content: string) => void;
  setWatchReminder: (enabled: boolean) => void;
  setPhoneAudioState: (state: PhoneAudioState, screenId?: string) => void;
  setPhoneAudioVolume: (volume: number) => void;
  requestService: (kind: string, note?: string) => void;
  setServiceRequestState: (state: ServiceState | null) => void;
  advanceServiceRequest: () => void;
  cancelServiceRequest: () => void;
  setServiceNote: (note: string) => void;
  setKitchenWaitTime: (minutes: number) => void;
  setBarWaitTime: (minutes: number) => void;
  setActivePromotion: (promotion: string) => void;
  setMarketingLevel: (level: MarketingLevel) => void;
  setMarketingInteraction: (interaction: MarketingInteraction) => void;
  setStaffReview: (enabled: boolean) => void;
  setPhoneAudio: (enabled: boolean) => void;
  toggleSoldOut: (itemId: string) => void;
  setBottleShopItem: (itemId: string) => void;
  setBottleShopState: (state: BottleShopCollectionState) => void;
  setPhoneScenario: (id: string) => void;
  setPhoneCallState: (state: PhoneCallState) => void;
  completePhoneScenario: (createsRide: boolean) => void;
  setDrawCountdown: (minutes: number) => void;
  setFictionalDrawResult: (result: "pending" | "not-selected" | "selected") => void;
  startPresentation: () => void;
  nextPresentationStep: () => void;
  previousPresentationStep: () => void;
  exitPresentation: () => void;
  updateMemory: (id: string, value: string) => void;
  setMemoryStatus: (id: string, status: "active" | "paused" | "removed") => void;
  toggleAccessibility: (key: keyof AccessibilityPreferences) => void;
  toggleCommunication: (key: keyof CommunicationPreferences) => void;
  setDemoOpen: (open: boolean) => void;
  setAssistantOpen: (open: boolean) => void;
  setServiceOpen: (open: boolean) => void;
  setPhoneOpen: (open: boolean) => void;
  setNotice: (notice: string | null) => void;
  loadScenario: (scenario: DemoScenario) => void;
  resetDemo: () => void;
}

export type DemoStore = DemoData & DemoActions;

const clonePersonaRecords = <T extends "memories" | "accessibility" | "communications">(key: T) =>
  Object.fromEntries(
    personas.map((persona) => {
      const value = persona[key];
      return [persona.id, Array.isArray(value) ? value.map((item) => ({ ...item })) : { ...value }];
    }),
  ) as T extends "memories"
    ? Record<PersonaId, MemoryItem[]>
    : T extends "accessibility"
      ? Record<PersonaId, AccessibilityPreferences>
      : Record<PersonaId, CommunicationPreferences>;

const groupRound = (): GroupRound => ({
  id: "round-table-23",
  synthetic: true,
  tableId: "table-23",
  split: null,
  participants: [
    {
      id: "round-alex",
      synthetic: true,
      name: "Alex",
      adult: true,
      itemId: "harbour-lager",
      acceptance: "accepted",
    },
    {
      id: "round-jordan",
      synthetic: true,
      name: "Jordan",
      adult: true,
      itemId: "harbour-zero-lager",
      acceptance: "pending",
    },
    {
      id: "round-sam",
      synthetic: true,
      name: "Sam",
      adult: true,
      itemId: "harbour-wine",
      acceptance: "age-check",
    },
    {
      id: "round-morgan",
      synthetic: true,
      name: "Morgan",
      adult: true,
      itemId: "harbour-lime",
      acceptance: "pending",
    },
  ],
});

const contextForVenue = (venueId: VenueId) => {
  if (venueId === "northside")
    return {
      selectedZoneId: "north-sports",
      selectedTableId: "north-12",
      preferredZone: "Sports Bar",
      layoutPresetId: "ufc-night" as const,
    };
  if (venueId === "hinterland")
    return {
      selectedZoneId: "hinterland-dining",
      selectedTableId: "hinterland-4",
      preferredZone: "Dining room",
      layoutPresetId: "trivia-night" as const,
    };
  return {
    selectedZoneId: "harbour-bistro",
    selectedTableId: "table-23",
    preferredZone: "Bistro",
    layoutPresetId: "thursday-draw" as const,
  };
};

export const initialData = (): DemoData => ({
  personaId: "alex",
  venueId: "harbour",
  simulatedDay: "Wednesday",
  simulatedTime: "5:50 pm",
  stage: "before-visit",
  bookingState: "held",
  ...contextForVenue("harbour"),
  tableFilters: [],
  partySize: 6,
  arrivalTime: "6:45 pm",
  highChair: false,
  quieterSeating: true,
  screenVisibility: true,
  rideState: "window-confirmed",
  rideBooked: true,
  inboundPassengers: 2,
  returnPassengers: 6,
  inboundWindow: "6:15 pm - 6:45 pm",
  returnWindow: "10:00 pm - 10:30 pm",
  orderState: "draft",
  orderItemId: null,
  orderModifier: null,
  groupPayment: null,
  drinkOrder: {
    itemId: null,
    size: null,
    participantId: null,
    tableId: "table-23",
    state: "draft",
  },
  groupRound: groupRound(),
  screenRequestState: "idle",
  screenRequestScreenId: null,
  screenRequestContent: null,
  watchReminder: false,
  phoneAudioState: "available",
  phoneAudioScreenId: null,
  phoneAudioVolume: 62,
  serviceRequestKind: null,
  serviceRequestState: null,
  serviceRequest: null,
  kitchenWaitTime: 18,
  barWaitTime: 9,
  activePromotion: "$5 bistro voucher",
  marketingLevel: "customer",
  marketingInteraction: "shown",
  staffReview: false,
  phoneAudioAvailable: true,
  soldOutItemIds: [],
  bottleShopCollection: {
    itemId: null,
    pickupWindow: "6:00 pm - 6:30 pm",
    token: null,
    state: "not-started",
  },
  phoneScenarioId: "call-usual",
  phoneCallState: "incoming",
  drawEntries: 17,
  drawCountdown: 10,
  fictionalDrawResult: "pending",
  presentationActive: false,
  presentationStep: 0,
  memories: clonePersonaRecords("memories"),
  accessibility: clonePersonaRecords("accessibility"),
  communications: clonePersonaRecords("communications"),
  demoOpen: false,
  assistantOpen: false,
  serviceOpen: false,
  phoneOpen: false,
  notice: null,
});

const scenarioData = (scenario: DemoScenario): Partial<DemoData> => {
  if (scenario === "sports-night" || scenario === "television")
    return {
      personaId: "jordan",
      venueId: "northside",
      simulatedDay: "Saturday",
      simulatedTime: "6:30 pm",
      stage: scenario === "television" ? "in-venue" : "before-visit",
      bookingState: scenario === "television" ? "checked-in" : "confirmed",
      ...contextForVenue("northside"),
      partySize: 4,
      arrivalTime: "7:30 pm",
      rideBooked: false,
      rideState: "requested",
      screenRequestState: scenario === "television" ? "requested" : "scheduled",
      screenRequestScreenId: scenario === "television" ? "north-screen-4" : null,
      phoneAudioState: "available",
      activePromotion: "UFC group food package",
      marketingLevel: "venue",
      drawEntries: 8,
    };
  if (scenario === "accessibility")
    return {
      personaId: "taylor",
      venueId: "hinterland",
      simulatedDay: "Tuesday",
      simulatedTime: "5:15 pm",
      stage: "approaching",
      bookingState: "confirmed",
      ...contextForVenue("hinterland"),
      partySize: 3,
      arrivalTime: "6:15 pm",
      rideBooked: true,
      rideState: "driver-assigned",
      inboundPassengers: 1,
      returnPassengers: 1,
      activePromotion: "Trivia dinner bundle",
      marketingLevel: "venue",
      drawEntries: 11,
    };
  if (scenario === "drinks-service")
    return {
      stage: "in-venue",
      bookingState: "checked-in",
      orderState: "submitted",
      drinkOrder: {
        itemId: "harbour-lager",
        size: "Schooner",
        participantId: "round-alex",
        tableId: "table-23",
        state: "staff-review",
      },
      staffReview: true,
      serviceOpen: false,
    };
  if (scenario === "phone-reception")
    return { phoneOpen: true, phoneScenarioId: "call-usual", phoneCallState: "incoming" };
  if (scenario === "executive")
    return {
      stage: "before-visit",
      presentationActive: true,
      presentationStep: 0,
      phoneCallState: "incoming",
    };
  return initialData();
};

export function migrateDemoState(persistedState: unknown, version: number): DemoData {
  const base = initialData();
  if (!persistedState || typeof persistedState !== "object") return base;
  const incoming = persistedState as Partial<DemoData>;
  const venueId =
    incoming.venueId && ["harbour", "northside", "hinterland"].includes(incoming.venueId)
      ? incoming.venueId
      : base.venueId;
  const context = contextForVenue(venueId);
  const selectedZoneId =
    incoming.selectedZoneId ??
    venues
      .find((venue) => venue.id === venueId)
      ?.zones.find((zone) => zone.name.toLowerCase() === incoming.preferredZone?.toLowerCase())
      ?.id ??
    context.selectedZoneId;
  const validTable = layouts
    .find((layout) => layout.venueId === venueId)
    ?.tables.some((table) => table.id === incoming.selectedTableId);
  return {
    ...base,
    ...incoming,
    venueId,
    selectedZoneId,
    selectedTableId: validTable ? incoming.selectedTableId! : context.selectedTableId,
    layoutPresetId: incoming.layoutPresetId ?? context.layoutPresetId,
    tableFilters: Array.isArray(incoming.tableFilters) ? incoming.tableFilters : [],
    drinkOrder: { ...base.drinkOrder, ...(incoming.drinkOrder ?? {}) },
    groupRound: incoming.groupRound?.participants ? incoming.groupRound : base.groupRound,
    bottleShopCollection: {
      ...base.bottleShopCollection,
      ...(incoming.bottleShopCollection ?? {}),
    },
    serviceRequest: incoming.serviceRequest ?? null,
    memories: incoming.memories ?? base.memories,
    accessibility: incoming.accessibility ?? base.accessibility,
    communications: incoming.communications ?? base.communications,
    demoOpen: false,
    assistantOpen: false,
    serviceOpen: false,
    phoneOpen: false,
    notice:
      version < 2 ? "Star Local v0.2 is ready. Your visit preferences were safely upgraded." : null,
  };
}

export const useDemoStore = create<DemoStore>()(
  persist(
    (set) => ({
      ...initialData(),
      setPersona: (personaId) => {
        const persona = personas.find((item) => item.id === personaId)!;
        set({
          personaId,
          venueId: persona.usualVenueId,
          ...contextForVenue(persona.usualVenueId),
          partySize: persona.partySize,
          arrivalTime: persona.arrivalTime,
          drawEntries: persona.drawEntries,
          notice: `${persona.firstName}'s journey is ready`,
        });
      },
      setVenue: (venueId) =>
        set({
          venueId,
          ...contextForVenue(venueId),
          tableFilters: [],
          screenRequestState: "idle",
          screenRequestScreenId: null,
          screenRequestContent: null,
          phoneAudioState: venues.find((venue) => venue.id === venueId)?.services.phoneAudio
            ? "available"
            : "unavailable",
          notice: `${venues.find((venue) => venue.id === venueId)?.shortName} experience loaded`,
        }),
      setStage: (stage) => set({ stage }),
      setSimulatedDay: (simulatedDay) => set({ simulatedDay }),
      setSimulatedTime: (simulatedTime) => set({ simulatedTime }),
      setBookingState: (bookingState) => set({ bookingState }),
      confirmVisit: () => set({ bookingState: "confirmed", notice: "Visit confirmed" }),
      cancelVisit: () => set({ bookingState: "cancelled", notice: "Visit removed" }),
      checkIn: () =>
        set({
          bookingState: "checked-in",
          stage: "in-venue",
          simulatedTime: "6:45 pm",
          notice: "Check-in complete",
        }),
      selectZone: (selectedZoneId) =>
        set((state) => {
          const venue = venues.find((item) => item.id === state.venueId)!;
          const zone = venue.zones.find((item) => item.id === selectedZoneId)!;
          const firstTable = layouts
            .find((layout) => layout.venueId === state.venueId)
            ?.tables.find((table) => table.zoneId === selectedZoneId);
          return {
            selectedZoneId,
            preferredZone: zone?.name ?? state.preferredZone,
            selectedTableId: firstTable?.id ?? state.selectedTableId,
            bookingState: "changed",
            tableFilters: [],
            notice: `${zone?.name ?? "Zone"} selected`,
          };
        }),
      selectTable: (selectedTableId) =>
        set({ selectedTableId, bookingState: "changed", notice: "Table preference updated" }),
      setLayoutPreset: (layoutPresetId) => set({ layoutPresetId, notice: "Venue layout updated" }),
      toggleTableFilter: (filter) =>
        set((state) => ({
          tableFilters: state.tableFilters.includes(filter)
            ? state.tableFilters.filter((item) => item !== filter)
            : [...state.tableFilters, filter],
        })),
      clearTableFilters: () => set({ tableFilters: [] }),
      setPartySize: (partySize) => set({ partySize, bookingState: "changed" }),
      setArrivalTime: (arrivalTime) => set({ arrivalTime, bookingState: "changed" }),
      setPreferredZone: (preferredZone) =>
        set((state) => {
          const zone = venues
            .find((venue) => venue.id === state.venueId)
            ?.zones.find((item) => item.name === preferredZone);
          return {
            preferredZone,
            selectedZoneId: zone?.id ?? state.selectedZoneId,
            bookingState: "changed",
          };
        }),
      toggleBookingPreference: (preference) =>
        set(
          (state) =>
            ({ [preference]: !state[preference], bookingState: "changed" }) as Partial<DemoData>,
        ),
      setRideState: (rideState) => set({ rideState }),
      confirmRide: () =>
        set({ rideBooked: true, rideState: "window-confirmed", notice: "Ride windows confirmed" }),
      setRidePassengers: (leg, count) =>
        set(leg === "inbound" ? { inboundPassengers: count } : { returnPassengers: count }),
      setRideWindow: (leg, value) =>
        set(leg === "inbound" ? { inboundWindow: value } : { returnWindow: value }),
      chooseOrder: (orderItemId, orderModifier) =>
        set({
          orderItemId,
          orderModifier,
          orderState: "awaiting-confirmation",
          notice: "Added to your order",
        }),
      setOrderState: (orderState) =>
        set({ orderState, notice: orderState === "submitted" ? "Order received" : null }),
      setGroupPayment: (groupPayment) =>
        set((state) => ({
          groupPayment,
          groupRound: { ...state.groupRound, split: groupPayment },
          notice: "Split choice saved",
        })),
      chooseDrink: (itemId, size, participantId) =>
        set((state) => ({
          drinkOrder: {
            itemId,
            size,
            participantId: participantId ?? `round-${state.personaId}`,
            tableId: state.selectedTableId,
            state: "draft",
          },
          notice: "Drink ready for review",
        })),
      setDrinkOrderState: (drinkState) =>
        set((state) => ({
          drinkOrder: { ...state.drinkOrder, state: drinkState },
          staffReview: drinkState === "staff-review",
          notice:
            drinkState === "staff-review"
              ? "A team member will confirm supply at your table"
              : drinkState === "declined"
                ? "A team member can discuss alternatives"
                : `Drink order: ${drinkState.replaceAll("-", " ")}`,
        })),
      assignRoundItem: (participantId, itemId) =>
        set((state) => ({
          groupRound: {
            ...state.groupRound,
            participants: state.groupRound.participants.map((participant) =>
              participant.id === participantId
                ? { ...participant, itemId, acceptance: "pending" }
                : participant,
            ),
          },
        })),
      setParticipantAcceptance: (participantId, acceptance) =>
        set((state) => ({
          groupRound: {
            ...state.groupRound,
            participants: state.groupRound.participants.map((participant) =>
              participant.id === participantId ? { ...participant, acceptance } : participant,
            ),
          },
          notice: `Participant status: ${acceptance.replaceAll("-", " ")}`,
        })),
      addWaterForEveryone: () =>
        set((state) => ({
          groupRound: {
            ...state.groupRound,
            participants: state.groupRound.participants.map((participant) => ({ ...participant })),
          },
          notice: "Water added for everyone",
        })),
      setScreenRequestState: (screenRequestState) =>
        set({
          screenRequestState,
          notice: screenRequestState === "approved" ? "Screen request approved" : null,
        }),
      requestScreen: (screenRequestScreenId, screenRequestContent) =>
        set({
          screenRequestScreenId,
          screenRequestContent,
          screenRequestState: "requested",
          notice: "Screen request joined",
        }),
      setWatchReminder: (watchReminder) =>
        set({ watchReminder, notice: watchReminder ? "Start reminder saved" : "Reminder removed" }),
      setPhoneAudioState: (phoneAudioState, phoneAudioScreenId) =>
        set({
          phoneAudioState,
          phoneAudioScreenId: phoneAudioScreenId ?? null,
          notice: phoneAudioState === "active" ? "Venue audio active" : null,
        }),
      setPhoneAudioVolume: (phoneAudioVolume) => set({ phoneAudioVolume }),
      requestService: (kind, note = "") =>
        set({
          serviceRequestKind: kind,
          serviceRequestState: "requested",
          serviceRequest: {
            id: `service-${kind.toLowerCase().replaceAll(" ", "-")}`,
            synthetic: true,
            kind,
            teamId: routeServiceRequest(kind),
            state: "requested",
            note,
            urgent: routeServiceRequest(kind) === "immediate-human",
          },
          notice: "Service request created",
          serviceOpen: true,
        }),
      setServiceRequestState: (serviceRequestState) =>
        set((state) => ({
          serviceRequestState,
          serviceRequest:
            state.serviceRequest && serviceRequestState
              ? { ...state.serviceRequest, state: serviceRequestState }
              : state.serviceRequest,
        })),
      advanceServiceRequest: () =>
        set((state) => {
          const next: Record<ServiceState, ServiceState> = {
            requested: "accepted",
            accepted: "on-the-way",
            "on-the-way": "completed",
            completed: "completed",
          };
          if (!state.serviceRequest) return {};
          const serviceRequestState = next[state.serviceRequest.state];
          return {
            serviceRequestState,
            serviceRequest: { ...state.serviceRequest, state: serviceRequestState },
            notice: `Service request ${serviceRequestState.replaceAll("-", " ")}`,
          };
        }),
      cancelServiceRequest: () =>
        set((state) =>
          state.serviceRequest?.urgent
            ? { notice: "Urgent requests stay open; please speak to nearby staff" }
            : {
                serviceRequest: null,
                serviceRequestKind: null,
                serviceRequestState: null,
                serviceOpen: false,
                notice: "Service request cancelled",
              },
        ),
      setServiceNote: (note) =>
        set((state) => ({
          serviceRequest: state.serviceRequest ? { ...state.serviceRequest, note } : null,
        })),
      setKitchenWaitTime: (kitchenWaitTime) => set({ kitchenWaitTime }),
      setBarWaitTime: (barWaitTime) => set({ barWaitTime }),
      setActivePromotion: (activePromotion) => set({ activePromotion }),
      setMarketingLevel: (marketingLevel) => set({ marketingLevel, marketingInteraction: "shown" }),
      setMarketingInteraction: (marketingInteraction) =>
        set({
          marketingInteraction,
          notice:
            marketingInteraction === "category-disabled"
              ? "This offer category is now off"
              : `Offer ${marketingInteraction}`,
        }),
      setStaffReview: (staffReview) => set({ staffReview }),
      setPhoneAudio: (phoneAudioAvailable) =>
        set({
          phoneAudioAvailable,
          phoneAudioState: phoneAudioAvailable ? "available" : "unavailable",
        }),
      toggleSoldOut: (itemId) =>
        set((state) => ({
          soldOutItemIds: state.soldOutItemIds.includes(itemId)
            ? state.soldOutItemIds.filter((id) => id !== itemId)
            : [...state.soldOutItemIds, itemId],
        })),
      setBottleShopItem: (itemId) =>
        set((state) => ({ bottleShopCollection: { ...state.bottleShopCollection, itemId } })),
      setBottleShopState: (collectionState) =>
        set((state) => ({
          bottleShopCollection: {
            ...state.bottleShopCollection,
            state: collectionState,
            token:
              collectionState === "not-started"
                ? null
                : (state.bottleShopCollection.token ?? "LOCAL-482"),
          },
          notice: `Collection ${collectionState.replaceAll("-", " ")}`,
        })),
      setPhoneScenario: (phoneScenarioId) => set({ phoneScenarioId, phoneCallState: "incoming" }),
      setPhoneCallState: (phoneCallState) => set({ phoneCallState }),
      completePhoneScenario: (createsRide) =>
        set({
          phoneCallState: "completed",
          bookingState: "confirmed",
          rideBooked: createsRide,
          rideState: createsRide ? "window-confirmed" : "requested",
          notice: "Phone plan added to the visit",
        }),
      setDrawCountdown: (drawCountdown) => set({ drawCountdown }),
      setFictionalDrawResult: (fictionalDrawResult) => set({ fictionalDrawResult }),
      startPresentation: () =>
        set({
          presentationActive: true,
          presentationStep: 0,
          demoOpen: false,
          notice: "Presentation mode started",
        }),
      nextPresentationStep: () =>
        set((state) => ({ presentationStep: Math.min(15, state.presentationStep + 1) })),
      previousPresentationStep: () =>
        set((state) => ({ presentationStep: Math.max(0, state.presentationStep - 1) })),
      exitPresentation: () =>
        set({ presentationActive: false, presentationStep: 0, notice: "Presentation mode closed" }),
      updateMemory: (id, value) =>
        set((state) => ({
          memories: {
            ...state.memories,
            [state.personaId]: state.memories[state.personaId].map((memory) =>
              memory.id === id ? { ...memory, value, status: "active" } : memory,
            ),
          },
        })),
      setMemoryStatus: (id, status) =>
        set((state) => ({
          memories: {
            ...state.memories,
            [state.personaId]: state.memories[state.personaId].map((memory) =>
              memory.id === id ? { ...memory, status } : memory,
            ),
          },
        })),
      toggleAccessibility: (key) =>
        set((state) => ({
          accessibility: {
            ...state.accessibility,
            [state.personaId]: {
              ...state.accessibility[state.personaId],
              [key]: !state.accessibility[state.personaId][key],
            },
          },
        })),
      toggleCommunication: (key) =>
        set((state) => ({
          communications: {
            ...state.communications,
            [state.personaId]: {
              ...state.communications[state.personaId],
              [key]: !state.communications[state.personaId][key],
            },
          },
        })),
      setDemoOpen: (demoOpen) => set({ demoOpen }),
      setAssistantOpen: (assistantOpen) => set({ assistantOpen }),
      setServiceOpen: (serviceOpen) => set({ serviceOpen }),
      setPhoneOpen: (phoneOpen) => set({ phoneOpen }),
      setNotice: (notice) => set({ notice }),
      loadScenario: (scenario) =>
        set({
          ...initialData(),
          ...scenarioData(scenario),
          demoOpen: false,
          assistantOpen: false,
          notice: `${scenario.replaceAll("-", " ")} journey loaded`,
        }),
      resetDemo: () => set({ ...initialData(), notice: "Demo reset to the flagship journey" }),
    }),
    {
      name: "star-local-demo-v1",
      version: 2,
      migrate: (persistedState, version) => migrateDemoState(persistedState, version),
      partialize: (state) => ({
        ...state,
        demoOpen: false,
        assistantOpen: false,
        serviceOpen: false,
        phoneOpen: false,
        notice: null,
      }),
    },
  ),
);
