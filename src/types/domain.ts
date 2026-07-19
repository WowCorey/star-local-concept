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
}

export interface VenueScreen extends SyntheticEntity {
  zoneId: string;
  name: string;
  screenClass: "locked" | "scheduled" | "requestable";
  currentContent: string;
  requestableOptions: string[];
  audioAvailable: boolean;
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
}

export interface VenueLayout extends SyntheticEntity {
  venueId: VenueId;
  label: string;
  preset: "Weeknight Dinner" | "Thursday Member Draw" | "UFC Night" | "Trivia Night";
  customerNotes: string[];
  tables: VenueTable[];
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
}

export interface GroupMember extends SyntheticEntity {
  name: string;
  state: "Choosing" | "Ordered" | "Paid" | "Ordering with staff";
  amount: number;
}
