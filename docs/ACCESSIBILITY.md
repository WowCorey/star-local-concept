# Accessibility

The prototype targets a strong WCAG 2.2 AA baseline.

## Implemented

- semantic headings, main/footer landmarks and labelled primary and section navigation;
- a skip link that is the first keyboard focus target on desktop and mobile;
- visible focus indication and minimum 44 px primary touch targets;
- labelled dialog surfaces with Escape dismissal;
- keyboard-operable zone cards, filters, table maps and equivalent table lists;
- complete table labels describing number, capacity, zone, type, atmosphere, step-free access, screen sightline and match state;
- screen rules and request status expressed in text and icons, never colour alone;
- drink and service progress rendered with explicit labels and live status regions;
- a readable phone transcript independent of the decorative local waveform;
- customer-controlled larger text, higher contrast and reduced motion;
- presentation mode with labelled Previous, Next and Exit actions plus Escape support;
- QR destination repeated as visible link text;
- viewport checks across every v0.2 route and a bounded desktop phone frame that keeps sticky navigation clear of actions.

## Keyboard audit

1. Tab first reveals **Skip to content**.
2. All primary destinations, subnavigation, Ask Star, Table Service and Demo Controls are reachable.
3. Zone radio cards, table buttons, order modifiers, round acceptance, phone playback and state controls operate by keyboard.
4. Escape closes every global sheet and guided presentation mode.
5. Focus remains visible on burgundy, teal, gold and neutral surfaces.

## Preference boundary

The prototype stores functional preferences such as step-free access, a low table, larger text, contrast and reduced motion. It does not infer a diagnosis, require medical detail or use accessibility settings for marketing.

## Known limitation

Sheets use labelled dialog semantics and Escape dismissal but do not yet use a production-grade focus trap and focus-return manager. A production implementation should adopt an audited dialog primitive and complete manual screen-reader testing with NVDA, JAWS, VoiceOver and TalkBack.
