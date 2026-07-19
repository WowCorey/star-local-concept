# Accessibility

The prototype targets a strong WCAG 2.2 AA baseline.

## Implemented

- semantic headings, main, footer and labelled navigation landmarks;
- a keyboard-visible skip link;
- minimum 44 px primary touch targets;
- visible focus rings;
- labelled controls and accessible switch semantics;
- `aria-live` status for ride and toast changes;
- Escape handling for the assistant and presenter sheets;
- table selection through both the map and a text list;
- state labels in addition to colour;
- sufficient contrast across the burgundy, teal, gold and neutral palette;
- reduced-motion support from both system preference and customer setting;
- larger-text and higher-contrast customer settings;
- step-free, low-table, wheelchair-space and accessible-bus preferences without medical-detail collection.

## Keyboard checklist

1. Tab exposes **Skip to content** first.
2. All six primary destinations, Ask Star and Demo Controls are reachable.
3. Booking controls, floor-plan list, order modifiers, ride windows and memory actions work with keyboard input.
4. Escape closes sheets.
5. Focus remains visible on light and burgundy surfaces.

## Known prototype limitation

The custom sheets close with Escape and labelled controls but do not implement a full production focus trap or focus-return manager. A production design system should provide a thoroughly audited dialog primitive.
