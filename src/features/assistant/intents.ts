export type AssistantIntent =
  | "book-usual"
  | "modify-meal"
  | "bus-status"
  | "screen-request"
  | "show-memory"
  | "service-help"
  | "specials"
  | "change-bus"
  | "accessible-entrance"
  | "human"
  | "gaming-boundary"
  | "unknown";

const catalogue: Array<{ id: AssistantIntent; patterns: RegExp[] }> = [
  { id: "book-usual", patterns: [/book.*usual/i, /usual table/i, /same.*thursday/i] },
  { id: "modify-meal", patterns: [/parmi.*barbecue/i, /barbecue.*parmi/i, /change.*meal/i] },
  { id: "bus-status", patterns: [/where.*bus/i, /bus.*arriv/i, /eta/i] },
  { id: "screen-request", patterns: [/cowboys.*(game|screen)/i, /put.*game/i, /watch.*cowboys/i] },
  { id: "show-memory", patterns: [/remember.*me/i, /saved preference/i, /what.*know/i] },
  { id: "service-help", patterns: [/missing.*meal/i, /missing.*item/i, /order problem/i] },
  { id: "specials", patterns: [/special/i, /tonight.*menu/i] },
  { id: "change-bus", patterns: [/change.*(return|bus)/i, /different.*bus/i] },
  {
    id: "accessible-entrance",
    patterns: [/accessible.*entrance/i, /step.?free/i, /wheelchair.*entrance/i],
  },
  { id: "human", patterns: [/staff member/i, /need.*person/i, /human/i, /speak.*staff/i] },
  { id: "gaming-boundary", patterns: [/gaming/i, /machine/i, /pokie/i] },
];

export function matchIntent(input: string): AssistantIntent {
  return (
    catalogue.find((intent) => intent.patterns.some((pattern) => pattern.test(input)))?.id ??
    "unknown"
  );
}
