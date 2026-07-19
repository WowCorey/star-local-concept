export interface SyntheticEntity {
  id: string;
  synthetic: true;
}

export type PersonaId = "alex" | "jordan" | "taylor";
export type VenueId = "harbour" | "northside" | "hinterland";
export type VisitStage = "before-visit" | "approaching" | "in-venue" | "after-visit";
export type BookingState =
  "suggested" | "held" | "confirmed" | "changed" | "cancelled" | "checked-in" | "completed";
export type OrderState =
  | "draft"
  | "awaiting-confirmation"
  | "submitted"
  | "preparing"
  | "ready"
  | "delivered"
  | "issue-reported";
export type BusState =
  | "requested"
  | "window-confirmed"
  | "driver-assigned"
  | "en-route"
  | "arriving"
  | "boarded"
  | "completed"
  | "delayed"
  | "missed";
export type ServiceState = "requested" | "accepted" | "on-the-way" | "completed";
export type ScreenRequestState =
  "idle" | "requested" | "approved" | "scheduled" | "active" | "unavailable";
export type AvailabilityState = "available" | "held" | "limited" | "unavailable";
export type SelectedZone = "bistro" | "sports-bar" | "public-bar" | "outdoor" | "function";
export type TableType = "standard" | "high" | "joined" | "low" | "outdoor";
export type TableFilter =
  | "family"
  | "screen-view"
  | "quiet"
  | "step-free"
  | "outdoor"
  | "amenities"
  | "standard-height"
  | "high-table"
  | "large-group"
  | "live-entertainment";
export type LayoutPresetId =
  | "weekday-lunch"
  | "thursday-draw"
  | "friday-dinner"
  | "cowboys-game"
  | "ufc-night"
  | "trivia-night"
  | "large-birthday"
  | "function-layout";
export type DrinkOrderState =
  | "draft"
  | "submitted"
  | "staff-review"
  | "accepted"
  | "modified"
  | "declined"
  | "preparing"
  | "delivered";
export type ParticipantAcceptance =
  "pending" | "accepted" | "declined" | "staff-order" | "age-check" | "delivered";
export type PhoneAudioState = "unavailable" | "available" | "active" | "paused";
export type BottleShopCollectionState =
  "not-started" | "reserved" | "preparing" | "ready" | "collected";
export type MarketingInteraction = "shown" | "saved" | "booked" | "dismissed" | "category-disabled";
export type MarketingLevel = "group" | "venue" | "customer";
export type PhoneCallState =
  | "incoming"
  | "disclosed"
  | "identifying"
  | "gathering"
  | "confirming"
  | "completed"
  | "human-transfer";
export type ZoneKind =
  | "Bistro"
  | "Sports Bar"
  | "Public Bar"
  | "Gaming Room"
  | "Outdoor Area"
  | "Function Room"
  | "TAB / Keno Area"
  | "Bottle Shop"
  | "Courtesy-Bus Pickup"
  | "Amenities";

export interface VenueZone extends SyntheticEntity {
  name: string;
  kind: ZoneKind;
  description: string;
  customerVisible: boolean;
  slug?: SelectedZone;
  atmosphere?: string;
  familySuitability?: string;
  ageGuidance?: string;
  serviceModel?: ZoneServiceModel;
  noiseLevel?: "quiet" | "moderate" | "lively";
  screenSummary?: string;
  eventSummary?: string;
  accessibilitySummary?: string;
  environment?: "indoor" | "outdoor" | "covered-outdoor";
  weatherExposure?: string;
  demand?: "easy" | "popular" | "nearly-full";
  suitableTableCount?: number;
  foodAvailable?: boolean;
  drinksService?: "table" | "bar" | "bar-and-table";
  features?: string[];
}

export interface ZoneServiceModel {
  food: "table-service" | "counter-pickup" | "not-available";
  drinks: "table-service" | "bar-service" | "bar-and-table";
  primaryTeam: ServiceTeamId;
}

export interface VenueScreen extends SyntheticEntity {
  zoneId: string;
  name: string;
  screenClass: "locked" | "scheduled" | "requestable";
  currentContent: string;
  requestableOptions: string[];
  audioAvailable: boolean;
  nextContent?: string;
  screenSize?: "feature-wall" | "large" | "standard" | "compact";
  captionsAvailable?: boolean;
  nearbyRequests?: number;
  requestStatus?: ScreenRequestState;
}

export interface Venue extends SyntheticEntity {
  id: VenueId;
  name: string;
  shortName: string;
  positioning: string;
  description: string;
  tone: string;
  accent: string;
  services: {
    courtesyBus: boolean;
    accessibleBus: boolean;
    bottleShopPickup: boolean;
    phoneAudio: boolean;
  };
  event: {
    title: string;
    time: string;
    detail: string;
  };
  zones: VenueZone[];
  screens: VenueScreen[];
  menuItemIds: string[];
  layoutId: string;
}

export interface AccessibilityPreferences {
  largerText: boolean;
  higherContrast: boolean;
  reducedMotion: boolean;
  quieterSeating: boolean;
  stepFreeRoute: boolean;
  lowTable: boolean;
  wheelchairSpace: boolean;
  accessibleBus: boolean;
}

export interface CommunicationPreferences {
  booking: boolean;
  food: boolean;
  events: boolean;
  transport: boolean;
  generalMarketing: boolean;
}

export interface MemoryItem extends SyntheticEntity {
  label: string;
  value: string;
  source: "You told us" | "You confirmed" | "Booking history";
  status: "active" | "paused" | "removed";
  category: "visit" | "food" | "entertainment" | "accessibility" | "transport";
}

export interface Persona extends SyntheticEntity {
  id: PersonaId;
  fullName: string;
  firstName: string;
  initials: string;
  usualVenueId: VenueId;
  preferredZone: string;
  preferredTableId: string;
  preferredTableDisplay: string;
  usualDay: string;
  arrivalTime: string;
  partySize: number;
  favouriteFood: string;
  favouriteTeam: string;
  transportSummary: string;
  points: number;
  drawEntries: number;
  memberId: string;
  tier: string;
  accessibility: AccessibilityPreferences;
  communications: CommunicationPreferences;
  memories: MemoryItem[];
}

export interface VenueTable extends SyntheticEntity {
  displayNumber: string;
  zoneId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  minimumCapacity: number;
  maximumCapacity: number;
  joinableTableIds: string[];
  accessibility: boolean;
  familySuitable: boolean;
  highChairSuitable: boolean;
  noiseLevel: "quiet" | "moderate" | "lively";
  nearbyScreenIds: string[];
  customerDescription: string;
  availabilityState: AvailabilityState;
  tableType?: TableType;
  nearAmenities?: boolean;
  nearEntertainment?: boolean;
  outdoor?: boolean;
  matchTags?: TableFilter[];
}

export interface VenueLayout extends SyntheticEntity {
  venueId: VenueId;
  label: string;
  preset: "Weeknight Dinner" | "Thursday Member Draw" | "UFC Night" | "Trivia Night";
  customerNotes: string[];
  tables: VenueTable[];
}

export interface LayoutPreset extends SyntheticEntity {
  id: LayoutPresetId;
  label: string;
  description: string;
  recommendedVenueIds: VenueId[];
  emphasis: string;
  joinedTableIds: string[];
  hiddenTableIds: string[];
  positionShift: Record<string, { x: number; y: number; rotation?: number }>;
}

export interface EntertainmentEvent extends SyntheticEntity {
  venueId: VenueId;
  zoneId: string;
  title: string;
  time: string;
  category: "sport" | "live-music" | "trivia" | "member-event";
  familySuitable: boolean;
}

export interface ScreenSchedule extends SyntheticEntity {
  venueId: VenueId;
  screenId: string;
  zoneId: string;
  currentContent: string;
  nextContent: string;
  startsIn: string;
  viewQualityByTable: Record<string, "direct" | "good" | "glimpse" | "none">;
  requestOptions: string[];
}

export interface ScreenRequest extends SyntheticEntity {
  screenId: string;
  tableId: string;
  content: string;
  state: ScreenRequestState;
  nearbyRequestCount: number;
}

export type MenuCategory =
  | "Favourites"
  | "Daily Specials"
  | "Bistro Classics"
  | "Kids"
  | "Sides"
  | "Zero-Alcohol Drinks"
  | "Sports Bar"
  | "Collection";

export interface MenuItem extends SyntheticEntity {
  venueId: VenueId;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  tags: string[];
  availability: "available" | "low-stock" | "sold-out" | "dinner-only";
  special?: {
    label: "Member special" | "Event special" | "Tonight only";
    expires: string;
  };
  savedPreference?: string;
  requiresStaffReview?: boolean;
  preparationMinutes?: number;
}

export type DrinkCategory =
  | "Beer on tap"
  | "Packaged beer"
  | "Cider"
  | "Wine"
  | "Cocktails"
  | "Spirits"
  | "Premix"
  | "Soft drinks"
  | "Zero-alcohol"
  | "Water";

export interface DrinkSize {
  label: string;
  price: number;
}

export interface DrinkItem extends SyntheticEntity {
  venueId: VenueId;
  name: string;
  description: string;
  category: DrinkCategory;
  format: "tap" | "packaged" | "glass" | "mixed";
  sizes: DrinkSize[];
  stock: "available" | "low-stock" | "sold-out";
  tags: string[];
  zeroAlcohol: boolean;
  requiresStaffReview: boolean;
  deliveryMinutes: number;
}

export interface DrinkOrder {
  itemId: string | null;
  size: string | null;
  participantId: string | null;
  tableId: string;
  state: DrinkOrderState;
}

export interface GroupRoundParticipant extends SyntheticEntity {
  name: string;
  adult: boolean;
  itemId: string | null;
  acceptance: ParticipantAcceptance;
}

export interface GroupRoundAddOn extends SyntheticEntity {
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface GroupRound extends SyntheticEntity {
  tableId: string;
  participants: GroupRoundParticipant[];
  addOns: GroupRoundAddOn[];
  split: "mine" | "even" | "items" | "staff" | null;
}

export type ServiceTeamId =
  "bistro-team" | "bar-team" | "floor-team" | "duty-manager" | "immediate-human";

export interface ServiceTeam extends SyntheticEntity {
  id: ServiceTeamId;
  label: string;
  responseLabel: string;
}

export interface ServiceRequest extends SyntheticEntity {
  kind: string;
  teamId: ServiceTeamId;
  state: ServiceState;
  note: string;
  urgent: boolean;
}

export interface MarketingCampaign extends SyntheticEntity {
  venueId: VenueId;
  level: MarketingLevel;
  title: string;
  body: string;
  basis: string[];
  excludedInputs: string[];
}

export interface BottleShopItem extends SyntheticEntity {
  venueId: VenueId;
  name: string;
  description: string;
  memberPrice: number;
  stock: "available" | "low-stock" | "sold-out";
  ageConfirmation: boolean;
}

export interface BottleShopCollection {
  itemId: string | null;
  pickupWindow: string;
  token: string | null;
  state: BottleShopCollectionState;
}

export interface PhoneCallScenario extends SyntheticEntity {
  venueId: VenueId;
  title: string;
  turns: PhoneTranscriptTurn[];
  outcome: PhoneScenarioOutcome;
}

export interface PhoneTranscriptTurn {
  speaker: "assistant" | "customer";
  text: string;
}

export interface PhoneScenarioBooking {
  venueId: VenueId;
  zoneId: string;
  tableId: string;
  partySize: number;
  arrivalTime: string;
  layoutPresetId: LayoutPresetId;
}

export interface PhoneScenarioRide {
  booked: boolean;
  inboundPassengers?: number;
  inboundWindow?: string;
}

export interface PhoneScenarioOutcome {
  booking: PhoneScenarioBooking | null;
  ride: PhoneScenarioRide;
  humanTransfer: boolean;
}

export interface PresentationStep extends SyntheticEntity {
  order: number;
  title: string;
  note: string;
  route: string;
  scenario?: "flagship" | "sports-night" | "accessibility";
  openService?: boolean;
  openPhone?: boolean;
  phoneScenarioId?: string;
  activatePhoneAudio?: string;
  preloadScreen?: {
    screenId: string;
    content: string;
    state: ScreenRequestState;
  };
  preloadDrink?: DrinkOrder;
  setStage?: VisitStage;
  setZone?: string;
  setTable?: string;
  setLayoutPreset?: LayoutPresetId;
}

export interface GroupMember extends SyntheticEntity {
  name: string;
  state: "Choosing" | "Ordered" | "Paid" | "Ordering with staff";
  amount: number;
}
