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
  | "sports-table"
  | "outside-table"
  | "group-round"
  | "move-ufc"
  | "fast-food"
  | "ride-ten"
  | "access-party"
  | "nearby-watch"
  | "listen-screen"
  | "marketing-why"
  | "unknown";

const catalogue: Array<{ id: AssistantIntent; patterns: RegExp[] }> = [
  {
    id: "sports-table",
    patterns: [/sports bar.*(six|6).*(cowboys|game)/i, /six.*sports bar.*cowboys/i],
  },
  { id: "outside-table", patterns: [/book.*outside/i, /outside.*suitable table/i] },
  { id: "group-round", patterns: [/order.*round.*(four|4)/i, /round.*adults/i] },
  { id: "move-ufc", patterns: [/move.*closer.*ufc/i, /better.*ufc.*view/i] },
  { id: "fast-food", patterns: [/order.*under.*20/i, /ready.*under.*20/i] },
  { id: "ride-ten", patterns: [/get.*home.*(ten|10)/i, /ride.*around.*(ten|10)/i] },
  { id: "access-party", patterns: [/wheelchair.*high chair/i, /high chair.*wheelchair/i] },
  { id: "nearby-watch", patterns: [/what.*on.*near.*table/i, /what(?:'s| is).*on.*near us/i] },
  { id: "listen-screen", patterns: [/listen.*screen\s*7/i] },
  { id: "marketing-why", patterns: [/why.*(offer|seeing this)/i] },
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
