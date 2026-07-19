import { useEffect, useState } from "react";
import { ArrowRight, Bot, MapPin, Send, ShieldCheck, UserRound, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui";
import { demoRepository } from "../../services/demoRepository";
import { useDemoStore } from "../../state/demoStore";
import { matchIntent, type AssistantIntent } from "./intents";

const prompts = [
  "When is the bus arriving?",
  "Find somewhere in the Sports Bar where six of us can watch the Cowboys game.",
  "Book us outside if there is a suitable table.",
  "Order a round for four adults.",
  "What can I order in under 20 minutes?",
  "Someone's meal is missing.",
  "What is on near our table?",
  "Can I listen to Screen 7?",
  "Get us home around ten.",
  "We need one wheelchair space and a high chair.",
  "Why did I receive this offer?",
];

interface Result {
  title: string;
  body: string;
  action?: string;
  intent: AssistantIntent;
  choices?: Array<{ title: string; detail: string }>;
}

export function AssistantSheet() {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const state = useDemoStore();
  const persona = demoRepository.getPersona(state.personaId);
  const venue = demoRepository.getVenue(state.venueId);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) =>
      event.key === "Escape" && state.setAssistantOpen(false);
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [state]);

  const buildResult = (text: string): Result => {
    const intent = matchIntent(text);
    switch (intent) {
      case "sports-table":
        return {
          intent,
          title: "Two Sports Bar tables fit",
          body: "Both options seat six and have a real Cowboys sightline. Confirm one before the visit changes.",
          action: "Choose Table S12",
          choices: [
            {
              title: "Table S12",
              detail: "4–6 · direct main-wall view · high atmosphere · high table",
            },
            { title: "Table S14", detail: "4–8 · strong Cowboys view · joined group table" },
          ],
        };
      case "outside-table":
        return {
          intent,
          title: "Outdoor seating is available",
          body: `${venue.shortName} has a covered outdoor option. Weather exposure and the lack of a guaranteed screen sightline are shown before you confirm.`,
          action: "Choose an outdoor table",
          choices: [
            {
              title: "Covered outdoor",
              detail: "Step-free · family suitable · weather may affect capacity",
            },
          ],
        };
      case "group-round":
        return {
          intent,
          title: "Build a round for four identified adults",
          body: "Each participant chooses or accepts their own item. Staff keeps authority over supply.",
          action: "Open round builder",
          choices: state.groupRound.participants.map((participant) => ({
            title: participant.name,
            detail: participant.acceptance.replaceAll("-", " "),
          })),
        };
      case "move-ufc":
        return {
          intent,
          title: "Better UFC sightlines",
          body: "Northside Tables 8 and 12 face Arena Screen 1. The main card is scheduled and cannot be overridden.",
          action: "Move to Table 12",
          choices: [
            { title: "Table 12", detail: "Direct view · standard height · step-free" },
            { title: "Table 8", detail: "Direct view · high table · lively" },
          ],
        };
      case "fast-food": {
        const fast = demoRepository
          .getMenu(state.venueId)
          .filter((item) => (item.preparationMinutes ?? 99) < 20)
          .slice(0, 3);
        return {
          intent,
          title: "Options under 20 minutes",
          body: "These are deterministic kitchen estimates, not guarantees.",
          action: "Review food",
          choices: fast.map((item) => ({
            title: item.name,
            detail: `${item.preparationMinutes} min · $${item.price.toFixed(2)}`,
          })),
        };
      }
      case "ride-ten":
        return {
          intent,
          title: "Return around ten",
          body: venue.services.courtesyBus
            ? "I can prefill the 10:00–10:30 pm return window. Review passenger count before confirming."
            : "This venue has no courtesy bus. I can open safe-travel help with a human route.",
          action: venue.services.courtesyBus ? "Prefill return ride" : "Open safe-travel help",
        };
      case "access-party":
        return {
          intent,
          title: "Booking needs ready to add",
          body: "One wheelchair space, a step-free route and one high chair will be added as visit preferences. Venue staff still confirms suitability.",
          action: "Add access preferences",
        };
      case "nearby-watch":
        return {
          intent,
          title: "Screens near your table",
          body: `Watch Tonight will show only verified sightlines from Table ${demoRepository.getLayout(state.venueId).tables.find((table) => table.id === state.selectedTableId)?.displayNumber}.`,
          action: "Open Watch Tonight",
        };
      case "listen-screen":
        return {
          intent,
          title: "Screen 7 phone audio",
          body:
            state.venueId === "harbour"
              ? "Venue-only audio is available for Screen 7. No broadcast audio plays in the prototype."
              : "Screen 7 is not part of this venue. I can show locally available screens instead.",
          action: "Open phone audio",
        };
      case "marketing-why":
        return {
          intent,
          title: "Why this offer appeared",
          body: "It uses enabled food offers, your preferred venue, usual visit timing and saved food or sport interests. It never uses gaming, RSA, security, exclusion or staff-safety data.",
          action: "Review marketing controls",
        };
      case "book-usual":
        return {
          intent,
          title: "Review your usual visit",
          body: `${venue.name} · ${persona.preferredTableDisplay} · ${persona.partySize} people · ${persona.arrivalTime}.`,
          action: "Confirm visit",
        };
      case "modify-meal":
        return {
          intent,
          title: "Saved meal choice found",
          body: `${persona.favouriteFood}. Review every modifier before adding it.`,
          action: "Review meal",
        };
      case "bus-status":
        return {
          intent,
          title: "Your private ride status",
          body: ["en-route", "arriving"].includes(state.rideState)
            ? "The bus is approaching. Approximate ETA: 8 minutes. Other passengers and stops remain hidden."
            : `Your return window is ${state.returnWindow}.`,
          action: "Open Ride",
        };
      case "screen-request":
        return {
          intent,
          title: "Suitable screen rules found",
          body:
            state.venueId === "harbour"
              ? "Screen 7 can accept a Cowboys request. Locked racing content remains unchanged."
              : "Open the venue-local schedule to see what can be requested.",
          action: "Review screens",
        };
      case "show-memory":
        return {
          intent,
          title: "You control what is remembered",
          body: "Edit, pause or remove saved preferences and inspect the protected-data firewall.",
          action: "Open memory",
        };
      case "service-help":
        return {
          intent,
          title: "Create a missing-meal request?",
          body: "This routes to the Bistro Team and keeps a visible path to a person.",
          action: "Confirm service request",
        };
      case "specials":
        return {
          intent,
          title: `Tonight at ${venue.shortName}`,
          body: "Food availability and preparation estimates are local to this venue.",
          action: "View specials",
        };
      case "change-bus":
        return {
          intent,
          title: "Review your return window",
          body: "Change the window or passenger count before confirming.",
          action: "Change return ride",
        };
      case "accessible-entrance":
        return {
          intent,
          title: "Step-free arrival",
          body: `${venue.name} shows a customer-safe step-free path to your selected zone. Staff would confirm the real route.`,
          action: "View visit access",
        };
      case "human":
        return {
          intent,
          title: "Human help comes first",
          body: "Create a Speak to staff request now.",
          action: "Ask for a person",
        };
      case "gaming-boundary":
        return {
          intent,
          title: "Not included",
          body: "This prototype contains no gaming controls, activity data or personalised gambling offers.",
        };
      default:
        return {
          intent,
          title: "Try a supported coordination request",
          body: "Ask about zones, tables, food, a round, screens, transport, service or what is remembered. This assistant is local and scripted.",
        };
    }
  };

  const submit = (text: string) => {
    setInput(text);
    setResult(buildResult(text));
  };
  const closeAndGo = (route: string) => {
    state.setAssistantOpen(false);
    navigate(route);
  };
  const runAction = () => {
    if (!result) return;
    switch (result.intent) {
      case "sports-table":
        state.selectZone("harbour-sports");
        state.selectTable("harbour-s12");
        closeAndGo("/visit/floor-plan");
        break;
      case "outside-table": {
        const zone = venue.zones.find((item) => item.slug === "outdoor");
        if (zone) state.selectZone(zone.id);
        closeAndGo("/visit/floor-plan");
        break;
      }
      case "group-round":
        closeAndGo("/order/group");
        break;
      case "move-ufc":
        state.setVenue("northside");
        state.selectTable("north-12");
        closeAndGo("/visit/floor-plan");
        break;
      case "fast-food":
      case "modify-meal":
      case "specials":
        closeAndGo("/order/food");
        break;
      case "ride-ten":
        if (venue.services.courtesyBus) state.setRideWindow("return", "10:00 pm - 10:30 pm");
        else state.requestService("Safe trip assistance");
        closeAndGo("/ride");
        break;
      case "access-party":
        useDemoStore.setState({ highChair: true });
        if (!state.accessibility[state.personaId].wheelchairSpace)
          state.toggleAccessibility("wheelchairSpace");
        closeAndGo("/visit");
        break;
      case "nearby-watch":
        closeAndGo("/visit/watch");
        break;
      case "listen-screen":
        if (state.venueId === "harbour") state.setPhoneAudioState("active", "screen-7");
        closeAndGo("/visit/watch");
        break;
      case "marketing-why":
        closeAndGo("/");
        break;
      case "book-usual":
        state.confirmVisit();
        closeAndGo("/visit");
        break;
      case "bus-status":
      case "change-bus":
        closeAndGo("/ride");
        break;
      case "screen-request":
        closeAndGo("/visit/watch");
        break;
      case "show-memory":
        closeAndGo("/me/memory");
        break;
      case "service-help":
        state.requestService("Missing meal");
        state.setAssistantOpen(false);
        break;
      case "accessible-entrance":
        closeAndGo("/visit");
        break;
      case "human":
        state.requestService("Speak to staff");
        state.setAssistantOpen(false);
        break;
    }
  };

  return (
    <div
      className="overlay"
      role="presentation"
      onMouseDown={(event) => event.currentTarget === event.target && state.setAssistantOpen(false)}
    >
      <section className="sheet" role="dialog" aria-modal="true" aria-labelledby="assistant-title">
        <header className="sheet-header">
          <div>
            <p className="eyebrow">Local coordination assistant</p>
            <h2 id="assistant-title">Ask Star</h2>
          </div>
          <button
            className="icon-button"
            type="button"
            onClick={() => state.setAssistantOpen(false)}
            aria-label="Close Ask Star"
          >
            <X size={21} />
          </button>
        </header>
        <div className="sheet-stack">
          <div className="assistant-context">
            <span>
              <Bot size={21} />
            </span>
            <span>
              <strong>
                {persona.firstName} · {venue.shortName} ·{" "}
                {venue.zones.find((zone) => zone.id === state.selectedZoneId)?.name}
              </strong>
              <small>Uses current visit context and scripted local workflows</small>
            </span>
          </div>
          <div className="info-strip">
            <ShieldCheck size={20} />
            <span>No live AI. Every state change requires a visible confirmation.</span>
          </div>
          {result ? (
            <div className="assistant-result assistant-workflow" aria-live="polite">
              <h3>{result.title}</h3>
              <p>{result.body}</p>
              {result.choices ? (
                <div className="assistant-choice-list">
                  {result.choices.map((choice) => (
                    <div key={`${choice.title}-${choice.detail}`}>
                      <span>
                        <MapPin size={15} />
                      </span>
                      <p>
                        <strong>{choice.title}</strong>
                        <small>{choice.detail}</small>
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}
              {result.action ? (
                <Button variant="teal" full onClick={runAction}>
                  {result.action}
                  <ArrowRight size={17} />
                </Button>
              ) : null}
            </div>
          ) : null}
          <form
            className="assistant-input"
            onSubmit={(event) => {
              event.preventDefault();
              if (input.trim()) submit(input);
            }}
          >
            <label className="sr-only" htmlFor="assistant-input">
              Ask a supported question
            </label>
            <input
              id="assistant-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="What kind of night do you want?"
            />
            <Button aria-label="Send scripted request" type="submit">
              <Send size={18} />
            </Button>
          </form>
          <div>
            <p className="eyebrow" style={{ marginBottom: 8 }}>
              Useful right now
            </p>
            <div className="suggestion-grid">
              {prompts.map((prompt) => (
                <button
                  className="suggestion-chip"
                  type="button"
                  key={prompt}
                  onClick={() => submit(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
          <Button variant="secondary" full onClick={() => submit("I need a staff member.")}>
            <UserRound size={18} />I need a person
          </Button>
        </div>
      </section>
    </div>
  );
}
