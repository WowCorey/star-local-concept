import type {
  BottleShopItem,
  MarketingCampaign,
  PhoneCallScenario,
  ServiceTeam,
} from "../types/domain";

export const serviceTeams: ServiceTeam[] = [
  {
    id: "bistro-team",
    synthetic: true,
    label: "Bistro Team",
    responseLabel: "Usually accepted shortly",
  },
  { id: "bar-team", synthetic: true, label: "Bar Team", responseLabel: "Bar review in progress" },
  {
    id: "floor-team",
    synthetic: true,
    label: "Floor Team",
    responseLabel: "Floor support is on the way",
  },
  {
    id: "duty-manager",
    synthetic: true,
    label: "Duty Manager",
    responseLabel: "A person will respond",
  },
  {
    id: "immediate-human",
    synthetic: true,
    label: "Immediate human route",
    responseLabel: "Please also alert nearby staff now",
  },
];

export const marketingCampaigns: MarketingCampaign[] = [
  {
    id: "campaign-group",
    synthetic: true,
    venueId: "harbour",
    level: "group",
    title: "Parmi Thursday at participating venues",
    body: "Save a Thursday dinner reminder.",
    basis: ["Customer-enabled food offers"],
    excludedInputs: [
      "Gaming data",
      "RSA records",
      "Security incidents",
      "Accessibility information",
    ],
  },
  {
    id: "campaign-harbour",
    synthetic: true,
    venueId: "harbour",
    level: "venue",
    title: "Harbour's Thursday parmi night",
    body: "Pair dinner with the family bistro and Screen 7 schedule.",
    basis: ["Favourite venue", "Usual visit timing"],
    excludedInputs: ["Gaming data", "RSA records", "Staff safety records"],
  },
  {
    id: "campaign-alex",
    synthetic: true,
    venueId: "harbour",
    level: "customer",
    title: "Alex, your barbecue-base parmi and Bistro table are available Thursday",
    body: "Review the table and meal before adding either to your plan.",
    basis: [
      "Saved food preference",
      "Preferred venue",
      "Thursday visit timing",
      "Enabled food category",
    ],
    excludedInputs: [
      "Gaming data",
      "RSA records",
      "Exclusions",
      "Security incidents",
      "Accessibility information",
    ],
  },
  {
    id: "campaign-north",
    synthetic: true,
    venueId: "northside",
    level: "venue",
    title: "UFC tables and wings at Northside",
    body: "Sports Bar sightlines and food availability are ready to review.",
    basis: ["Saved sport interest", "Favourite venue"],
    excludedInputs: ["Gaming data", "RSA records", "Security incidents"],
  },
  {
    id: "campaign-hinterland",
    synthetic: true,
    venueId: "hinterland",
    level: "venue",
    title: "Trivia, steak night and a ride home",
    body: "A quieter community plan with customer-controlled reminders.",
    basis: ["Saved event reminder", "Favourite venue"],
    excludedInputs: ["Accessibility information", "Gaming data", "RSA records"],
  },
];

export const bottleShopItems: BottleShopItem[] = [
  {
    id: "shop-pale-six",
    synthetic: true,
    venueId: "hinterland",
    name: "Hinterland Pale Six",
    description: "Six fictional packaged pale ales for customer-initiated collection.",
    memberPrice: 24,
    stock: "available",
    ageConfirmation: true,
  },
  {
    id: "shop-shiraz",
    synthetic: true,
    venueId: "hinterland",
    name: "Community Shiraz",
    description: "One fictional 750 ml bottle for collection.",
    memberPrice: 18,
    stock: "low-stock",
    ageConfirmation: true,
  },
  {
    id: "shop-zero-pack",
    synthetic: true,
    venueId: "northside",
    name: "Zero-Alcohol Match Pack",
    description: "Four packaged zero-alcohol lagers.",
    memberPrice: 16,
    stock: "available",
    ageConfirmation: false,
  },
];

export const phoneCallScenarios: PhoneCallScenario[] = [
  {
    id: "call-usual",
    synthetic: true,
    venueId: "harbour",
    title: "Usual table and family bus",
    turns: [
      {
        speaker: "assistant",
        text: "Thanks for calling Harbour Family Hotel. I'm the automated venue assistant. How can I help?",
      },
      {
        speaker: "customer",
        text: "Book our normal table for six tomorrow and arrange the bus for Mum and Dad.",
      },
      {
        speaker: "assistant",
        text: "I found your usual Bistro Table 23 for six at 6:45 pm.",
      },
      {
        speaker: "customer",
        text: "Yes, and the inbound bus is for two passengers.",
      },
      {
        speaker: "assistant",
        text: "The structured plan includes a 6:15 pm to 6:45 pm inbound window. Please confirm before I add it.",
      },
    ],
    outcome: {
      booking: {
        venueId: "harbour",
        zoneId: "harbour-bistro",
        tableId: "table-23",
        partySize: 6,
        arrivalTime: "6:45 pm",
        layoutPresetId: "thursday-draw",
      },
      ride: {
        booked: true,
        inboundPassengers: 2,
        inboundWindow: "6:15 pm - 6:45 pm",
      },
      humanTransfer: false,
    },
  },
  {
    id: "call-ufc",
    synthetic: true,
    venueId: "northside",
    title: "UFC Sports Bar booking",
    turns: [
      { speaker: "assistant", text: "You're speaking with an automated venue assistant." },
      {
        speaker: "customer",
        text: "Are you showing the UFC tonight and can I book a Sports Bar table?",
      },
      {
        speaker: "assistant",
        text: "The synthetic schedule shows the UFC main card on Arena Screen 1.",
      },
      { speaker: "customer", text: "Book a table for four at 7:30 pm." },
      {
        speaker: "assistant",
        text: "Sports Bar Table 12 is ready to confirm. This venue has no courtesy-bus booking in the plan.",
      },
    ],
    outcome: {
      booking: {
        venueId: "northside",
        zoneId: "north-sports",
        tableId: "north-12",
        partySize: 4,
        arrivalTime: "7:30 pm",
        layoutPresetId: "ufc-night",
      },
      ride: { booked: false },
      humanTransfer: false,
    },
  },
  {
    id: "call-allergy",
    synthetic: true,
    venueId: "harbour",
    title: "Serious allergy question",
    turns: [
      { speaker: "assistant", text: "You're speaking with an automated venue assistant." },
      { speaker: "customer", text: "I have a serious allergy question." },
      {
        speaker: "assistant",
        text: "I won't guess about allergy safety or change your current visit plan.",
      },
      {
        speaker: "assistant",
        text: "I'm transferring this demo to a person so venue staff can discuss ingredients and preparation.",
      },
    ],
    outcome: {
      booking: null,
      ride: { booked: false },
      humanTransfer: true,
    },
  },
];
