import { create } from "zustand";
import { persist } from "zustand/middleware";
import { personas } from "../fixtures/personas";
import type {
  AccessibilityPreferences,
  BookingState,
  BusState,
  CommunicationPreferences,
  MemoryItem,
  OrderState,
  PersonaId,
  ScreenRequestState,
  ServiceState,
  VenueId,
  VisitStage,
} from "../types/domain";

export type DemoScenario = "flagship" | "sports-night" | "accessibility";

interface DemoData {
  personaId: PersonaId;
  venueId: VenueId;
  simulatedDay: string;
  simulatedTime: string;
  stage: VisitStage;
  bookingState: BookingState;
  selectedTableId: string;
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
  screenRequestState: ScreenRequestState;
  serviceRequestKind: string | null;
  serviceRequestState: ServiceState | null;
  kitchenWaitTime: number;
  activePromotion: string;
  staffReview: boolean;
  phoneAudioAvailable: boolean;
  soldOutItemIds: string[];
  drawEntries: number;
  memories: Record<PersonaId, MemoryItem[]>;
  accessibility: Record<PersonaId, AccessibilityPreferences>;
  communications: Record<PersonaId, CommunicationPreferences>;
  demoOpen: boolean;
  assistantOpen: boolean;
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
  selectTable: (tableId: string) => void;
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
  setScreenRequestState: (state: ScreenRequestState) => void;
  requestService: (kind: string) => void;
  setServiceRequestState: (state: ServiceState | null) => void;
  setKitchenWaitTime: (minutes: number) => void;
  setActivePromotion: (promotion: string) => void;
  setStaffReview: (enabled: boolean) => void;
  setPhoneAudio: (enabled: boolean) => void;
  toggleSoldOut: (itemId: string) => void;
  updateMemory: (id: string, value: string) => void;
  setMemoryStatus: (id: string, status: "active" | "paused" | "removed") => void;
  toggleAccessibility: (key: keyof AccessibilityPreferences) => void;
  toggleCommunication: (key: keyof CommunicationPreferences) => void;
  setDemoOpen: (open: boolean) => void;
  setAssistantOpen: (open: boolean) => void;
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

const initialData = (): DemoData => ({
  personaId: "alex",
  venueId: "harbour",
  simulatedDay: "Wednesday",
  simulatedTime: "5:50 pm",
  stage: "before-visit",
  bookingState: "held",
  selectedTableId: "table-23",
  partySize: 6,
  arrivalTime: "6:45 pm",
  preferredZone: "Bistro",
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
  screenRequestState: "idle",
  serviceRequestKind: null,
  serviceRequestState: null,
  kitchenWaitTime: 18,
  activePromotion: "$5 demo bistro voucher",
  staffReview: false,
  phoneAudioAvailable: true,
  soldOutItemIds: [],
  drawEntries: 17,
  memories: clonePersonaRecords("memories"),
  accessibility: clonePersonaRecords("accessibility"),
  communications: clonePersonaRecords("communications"),
  demoOpen: false,
  assistantOpen: false,
  notice: null,
});

const scenarioData = (scenario: DemoScenario): Partial<DemoData> => {
  if (scenario === "sports-night") {
    return {
      personaId: "jordan",
      venueId: "northside",
      simulatedDay: "Saturday",
      simulatedTime: "6:30 pm",
      stage: "before-visit",
      bookingState: "confirmed",
      selectedTableId: "north-12",
      partySize: 4,
      arrivalTime: "7:30 pm",
      preferredZone: "Sports Bar",
      rideBooked: false,
      rideState: "requested",
      orderState: "draft",
      screenRequestState: "scheduled",
      activePromotion: "UFC group food package - Demo data",
      drawEntries: 8,
    };
  }
  if (scenario === "accessibility") {
    return {
      personaId: "taylor",
      venueId: "hinterland",
      simulatedDay: "Tuesday",
      simulatedTime: "5:15 pm",
      stage: "approaching",
      bookingState: "confirmed",
      selectedTableId: "hinterland-4",
      partySize: 3,
      arrivalTime: "6:15 pm",
      preferredZone: "Dining Room",
      rideBooked: true,
      rideState: "driver-assigned",
      inboundPassengers: 1,
      returnPassengers: 1,
      activePromotion: "Trivia dinner bundle - Demo data",
      drawEntries: 11,
    };
  }
  return initialData();
};

export const useDemoStore = create<DemoStore>()(
  persist(
    (set) => ({
      ...initialData(),
      setPersona: (personaId) => {
        const persona = personas.find((item) => item.id === personaId)!;
        set({
          personaId,
          venueId: persona.usualVenueId,
          selectedTableId: persona.preferredTableId,
          partySize: persona.partySize,
          arrivalTime: persona.arrivalTime,
          preferredZone: persona.preferredZone,
          drawEntries: persona.drawEntries,
          notice: `Loaded ${persona.firstName}'s synthetic profile`,
        });
      },
      setVenue: (venueId) => set({ venueId, notice: "Venue-local fixtures updated" }),
      setStage: (stage) => set({ stage }),
      setSimulatedDay: (simulatedDay) => set({ simulatedDay }),
      setSimulatedTime: (simulatedTime) => set({ simulatedTime }),
      setBookingState: (bookingState) => set({ bookingState }),
      confirmVisit: () =>
        set({ bookingState: "confirmed", notice: "Demo visit confirmed - no venue was contacted" }),
      cancelVisit: () =>
        set({ bookingState: "cancelled", notice: "This synthetic visit was removed" }),
      checkIn: () =>
        set({
          bookingState: "checked-in",
          stage: "in-venue",
          simulatedDay: "Thursday",
          simulatedTime: "6:45 pm",
          notice: "Simulated check-in complete",
        }),
      selectTable: (selectedTableId) =>
        set({ selectedTableId, bookingState: "changed", notice: "Table preference updated" }),
      setPartySize: (partySize) => set({ partySize, bookingState: "changed" }),
      setArrivalTime: (arrivalTime) => set({ arrivalTime, bookingState: "changed" }),
      setPreferredZone: (preferredZone) => set({ preferredZone, bookingState: "changed" }),
      toggleBookingPreference: (preference) =>
        set(
          (state) =>
            ({ [preference]: !state[preference], bookingState: "changed" }) as Partial<DemoData>,
        ),
      setRideState: (rideState) => set({ rideState }),
      confirmRide: () =>
        set({
          rideBooked: true,
          rideState: "window-confirmed",
          notice: "Demo ride windows confirmed - no driver was contacted",
        }),
      setRidePassengers: (leg, count) =>
        set(leg === "inbound" ? { inboundPassengers: count } : { returnPassengers: count }),
      setRideWindow: (leg, value) =>
        set(leg === "inbound" ? { inboundWindow: value } : { returnWindow: value }),
      chooseOrder: (orderItemId, orderModifier) =>
        set({
          orderItemId,
          orderModifier,
          orderState: "awaiting-confirmation",
          notice: "Added to your simulated order",
        }),
      setOrderState: (orderState) =>
        set({
          orderState,
          notice:
            orderState === "submitted"
              ? "Demo order submitted - no payment or kitchen connection"
              : null,
        }),
      setGroupPayment: (groupPayment) =>
        set({ groupPayment, notice: "Payment split saved for the demo - no charge occurred" }),
      setScreenRequestState: (screenRequestState) =>
        set({
          screenRequestState,
          notice:
            screenRequestState === "approved" ? "Screen 7 request approved in the demo" : null,
        }),
      requestService: (serviceRequestKind) =>
        set({
          serviceRequestKind,
          serviceRequestState: "requested",
          notice: "Synthetic service request created",
        }),
      setServiceRequestState: (serviceRequestState) => set({ serviceRequestState }),
      setKitchenWaitTime: (kitchenWaitTime) => set({ kitchenWaitTime }),
      setActivePromotion: (activePromotion) => set({ activePromotion }),
      setStaffReview: (staffReview) => set({ staffReview }),
      setPhoneAudio: (phoneAudioAvailable) => set({ phoneAudioAvailable }),
      toggleSoldOut: (itemId) =>
        set((state) => ({
          soldOutItemIds: state.soldOutItemIds.includes(itemId)
            ? state.soldOutItemIds.filter((id) => id !== itemId)
            : [...state.soldOutItemIds, itemId],
        })),
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
      setNotice: (notice) => set({ notice }),
      loadScenario: (scenario) =>
        set({
          ...initialData(),
          ...scenarioData(scenario),
          demoOpen: false,
          assistantOpen: false,
          notice: `${scenario === "flagship" ? "Flagship" : scenario === "sports-night" ? "Sports-night" : "Accessibility"} journey loaded`,
        }),
      resetDemo: () => set({ ...initialData(), notice: "Demo reset to the flagship journey" }),
    }),
    {
      name: "star-local-demo-v1",
      version: 1,
      partialize: (state) => ({ ...state, demoOpen: false, assistantOpen: false, notice: null }),
    },
  ),
);
