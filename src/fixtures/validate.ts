import type {
  BottleShopItem,
  DrinkItem,
  EntertainmentEvent,
  LayoutPreset,
  MarketingCampaign,
  MenuItem,
  Persona,
  PhoneCallScenario,
  PresentationStep,
  ScreenSchedule,
  SyntheticEntity,
  Venue,
  VenueLayout,
} from "../types/domain";

export function validateFixtures(input: {
  personas: Persona[];
  venues: Venue[];
  layouts: VenueLayout[];
  menuItems: MenuItem[];
}): string[] {
  const errors: string[] = [];
  const venueIds = new Set(input.venues.map((venue) => venue.id));
  const menuIds = new Set(input.menuItems.map((item) => item.id));
  const layoutIds = new Set(input.layouts.map((layout) => layout.id));

  for (const entity of [...input.personas, ...input.venues, ...input.layouts, ...input.menuItems]) {
    if (!entity.synthetic) errors.push(`${entity.id} is not marked synthetic`);
  }
  for (const persona of input.personas) {
    if (!venueIds.has(persona.usualVenueId))
      errors.push(`${persona.id} has an unknown usual venue`);
  }
  for (const venue of input.venues) {
    if (!layoutIds.has(venue.layoutId)) errors.push(`${venue.id} has an unknown layout`);
    for (const itemId of venue.menuItemIds) {
      if (!menuIds.has(itemId)) errors.push(`${venue.id} references unknown menu item ${itemId}`);
    }
  }
  return errors;
}

export function validateV02Fixtures(input: {
  venues: Venue[];
  drinks: DrinkItem[];
  presets: LayoutPreset[];
  schedules: ScreenSchedule[];
  events: EntertainmentEvent[];
  campaigns: MarketingCampaign[];
  collectionItems: BottleShopItem[];
  phoneScenarios: PhoneCallScenario[];
  presentationSteps: PresentationStep[];
}): string[] {
  const errors: string[] = [];
  const entities: SyntheticEntity[] = [
    ...input.drinks,
    ...input.presets,
    ...input.schedules,
    ...input.events,
    ...input.campaigns,
    ...input.collectionItems,
    ...input.phoneScenarios,
    ...input.presentationSteps,
  ];
  const venueIds = new Set(input.venues.map((venue) => venue.id));
  const zoneIds = new Set(input.venues.flatMap((venue) => venue.zones.map((zone) => zone.id)));
  const screenIds = new Set(
    input.venues.flatMap((venue) => venue.screens.map((screen) => screen.id)),
  );
  for (const entity of entities)
    if (!entity.synthetic) errors.push(`${entity.id} is not marked synthetic`);
  for (const drink of input.drinks)
    if (!venueIds.has(drink.venueId)) errors.push(`${drink.id} has an unknown venue`);
  for (const schedule of input.schedules) {
    if (!screenIds.has(schedule.screenId)) errors.push(`${schedule.id} has an unknown screen`);
    if (!zoneIds.has(schedule.zoneId)) errors.push(`${schedule.id} has an unknown zone`);
  }
  for (const event of input.events)
    if (!zoneIds.has(event.zoneId)) errors.push(`${event.id} has an unknown zone`);
  if (
    new Set(input.presentationSteps.map((step) => step.order)).size !==
    input.presentationSteps.length
  )
    errors.push("presentation step order is not unique");
  return errors;
}
