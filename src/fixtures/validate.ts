import type { MenuItem, Persona, Venue, VenueLayout } from "../types/domain";

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
