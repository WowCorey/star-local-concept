import { layouts } from "../fixtures/layouts";
import { layoutPresets } from "../fixtures/layoutPresets";
import { menuItems } from "../fixtures/menus";
import { drinkItems } from "../fixtures/drinks";
import { entertainmentEvents, screenSchedules } from "../fixtures/entertainment";
import {
  bottleShopItems,
  marketingCampaigns,
  phoneCallScenarios,
  serviceTeams,
} from "../fixtures/operations";
import { personas } from "../fixtures/personas";
import { presentationSteps } from "../fixtures/presentation";
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
  getLayoutPresets: () => layoutPresets,
  getZoneTables: (venueId: VenueId, zoneId: string) =>
    (layouts.find((layout) => layout.venueId === venueId) ?? layouts[0]!).tables.filter(
      (table) => table.zoneId === zoneId,
    ),
  getMenu: (venueId: VenueId) => menuItems.filter((item) => item.venueId === venueId),
  getDrinks: (venueId: VenueId) => drinkItems.filter((item) => item.venueId === venueId),
  getScreenSchedules: (venueId: VenueId) =>
    screenSchedules.filter((schedule) => schedule.venueId === venueId),
  getEntertainment: (venueId: VenueId) =>
    entertainmentEvents.filter((event) => event.venueId === venueId),
  getServiceTeams: () => serviceTeams,
  getCampaigns: (venueId: VenueId) =>
    marketingCampaigns.filter((campaign) => campaign.venueId === venueId),
  getBottleShop: (venueId: VenueId) => bottleShopItems.filter((item) => item.venueId === venueId),
  getPhoneScenarios: () => phoneCallScenarios,
  getPresentationSteps: () => presentationSteps,
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
