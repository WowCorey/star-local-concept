import { layouts } from "../fixtures/layouts";
import { menuItems } from "../fixtures/menus";
import { personas } from "../fixtures/personas";
import { venues } from "../fixtures/venues";
import type { PersonaId, VenueId } from "../types/domain";

const pause = (milliseconds = 180) =>
  new Promise((resolve) => window.setTimeout(resolve, milliseconds));

export const demoRepository = {
  getPersonas: () => personas,
  getVenues: () => venues,
  getPersona: (id: PersonaId) => personas.find((persona) => persona.id === id) ?? personas[0]!,
  getVenue: (id: VenueId) => venues.find((venue) => venue.id === id) ?? venues[0]!,
  getLayout: (venueId: VenueId) =>
    layouts.find((layout) => layout.venueId === venueId) ?? layouts[0]!,
  getMenu: (venueId: VenueId) => menuItems.filter((item) => item.venueId === venueId),
  async holdTable(tableId: string) {
    await pause();
    return { synthetic: true as const, tableId, heldUntil: "12:00 pm Thursday (demo time)" };
  },
  async confirmBooking() {
    await pause();
    return { synthetic: true as const, confirmation: "DEMO-BOOKING-4821" };
  },
  async confirmRide() {
    await pause();
    return { synthetic: true as const, confirmation: "DEMO-RIDE-211" };
  },
};
