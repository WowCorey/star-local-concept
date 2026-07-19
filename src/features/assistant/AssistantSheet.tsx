import { useEffect, useState } from "react";
import { ArrowRight, Bot, Send, ShieldCheck, UserRound, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui";
import { demoRepository } from "../../services/demoRepository";
import { useDemoStore } from "../../state/demoStore";
import { matchIntent, type AssistantIntent } from "./intents";

const prompts = [
  "Book our usual table for Thursday.",
  "Make my parmi with barbecue sauce.",
  "When is the bus arriving?",
  "Put the Cowboys game on near us.",
  "Show me what Star remembers about me.",
  "We are missing one meal.",
  "I need a staff member.",
  "What are tonight's specials?",
  "Can I change the return bus?",
  "Where is the accessible entrance?",
];

interface Result {
  title: string;
  body: string;
  action?: string;
  intent: AssistantIntent;
}

export function AssistantSheet() {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const personaId = useDemoStore((state) => state.personaId);
  const venueId = useDemoStore((state) => state.venueId);
  const rideState = useDemoStore((state) => state.rideState);
  const close = useDemoStore((state) => state.setAssistantOpen);
  const confirmVisit = useDemoStore((state) => state.confirmVisit);
  const setScreenRequestState = useDemoStore((state) => state.setScreenRequestState);
  const requestService = useDemoStore((state) => state.requestService);
  const persona = demoRepository.getPersona(personaId);
  const venue = demoRepository.getVenue(venueId);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [close]);

  const buildResult = (text: string): Result => {
    const intent = matchIntent(text);
    switch (intent) {
      case "book-usual":
        return {
          intent,
          title: "Review your usual visit",
          body: `${venue.name} · ${persona.preferredTableDisplay} · ${persona.partySize} people · ${persona.arrivalTime}. This is a structured demo confirmation; no live booking will be made.`,
          action: "Confirm demo visit",
        };
      case "modify-meal":
        return {
          intent,
          title: "I found your saved meal choice",
          body: `${persona.favouriteFood}. Open the menu to review every modifier before adding it to the simulated order.`,
          action: "Review meal",
        };
      case "bus-status":
        return {
          intent,
          title: "Your private ride status",
          body:
            rideState === "en-route" || rideState === "arriving"
              ? "The demo bus is approaching. Approximate ETA: 8 minutes. Other passengers, stops and the full route are never shown."
              : "Your return window is 10:00 pm - 10:30 pm. An ETA appears only once the simulated bus is en route.",
          action: "Open Ride",
        };
      case "screen-request":
        return {
          intent,
          title:
            venueId === "harbour"
              ? "Family viewing is available"
              : "Checking this venue's screen rules",
          body:
            venueId === "harbour"
              ? "Screen 7 in the nearby family viewing area can show the Cowboys game. Racing screens in the Sports Bar will remain unchanged."
              : `${venue.name} uses different screen schedules. I can open Visit so you can review available screens.`,
          action: venueId === "harbour" ? "Confirm Screen 7 request" : "Review screens",
        };
      case "show-memory":
        return {
          intent,
          title: "You control what is remembered",
          body: "Open your memory dashboard to edit, pause or remove saved preferences and view the protected information firewall.",
          action: "Open memory",
        };
      case "service-help":
        return {
          intent,
          title: "Create a missing-meal request?",
          body: "This will add a simulated service request and keep a visible path to a team member.",
          action: "Request help",
        };
      case "specials":
        return {
          intent,
          title: `Tonight at ${venue.shortName}`,
          body: "Venue-local specials can be available, low stock, sold out or limited to this demo service. Staff must confirm allergies.",
          action: "View specials",
        };
      case "change-bus":
        return {
          intent,
          title: "Review your return window",
          body: "Open Ride to change passenger count or the synthetic return window. No driver or route will be contacted.",
          action: "Change return ride",
        };
      case "accessible-entrance":
        return {
          intent,
          title: "Step-free arrival",
          body: `${venue.name} shows a synthetic step-free path from the main arrival point to your selected table. A venue team member would confirm the real route.`,
          action: "View visit access",
        };
      case "human":
        return {
          intent,
          title: "Human help comes first",
          body: "I can create a simulated 'Speak to staff' request now. A production service would always keep phone, web and in-person alternatives.",
          action: "Ask for a staff member",
        };
      case "gaming-boundary":
        return {
          intent,
          title: "Not included in this concept",
          body: "This concept demo does not include gaming-machine controls, gaming recommendations or gaming activity data.",
        };
      default:
        return {
          intent,
          title: "I can only handle scripted demo requests",
          body: "Try one of the suggestions below, or ask for a staff member. This prototype does not connect to a live AI model.",
        };
    }
  };

  const submit = (text: string) => {
    setInput(text);
    setResult(buildResult(text));
  };

  const runAction = () => {
    if (!result) return;
    switch (result.intent) {
      case "book-usual":
        confirmVisit();
        close(false);
        navigate("/visit");
        break;
      case "modify-meal":
      case "specials":
        close(false);
        navigate("/order");
        break;
      case "bus-status":
      case "change-bus":
        close(false);
        navigate("/ride");
        break;
      case "screen-request":
        if (venueId === "harbour") setScreenRequestState("approved");
        close(false);
        navigate("/visit");
        break;
      case "show-memory":
        close(false);
        navigate("/me#memory");
        break;
      case "service-help":
        requestService("Missing item");
        close(false);
        navigate("/me#service");
        break;
      case "accessible-entrance":
        close(false);
        navigate("/visit");
        break;
      case "human":
        requestService("Speak to staff");
        close(false);
        navigate("/me#service");
        break;
      default:
        break;
    }
  };

  return (
    <div
      className="overlay"
      role="presentation"
      onMouseDown={(event) => event.currentTarget === event.target && close(false)}
    >
      <section className="sheet" role="dialog" aria-modal="true" aria-labelledby="assistant-title">
        <header className="sheet-header">
          <div>
            <p className="eyebrow">Scripted demo assistant</p>
            <h2 id="assistant-title">Ask Star</h2>
          </div>
          <button
            className="icon-button"
            type="button"
            onClick={() => close(false)}
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
                {persona.firstName} at {venue.shortName}
              </strong>
              <small>Uses only the current synthetic demo context</small>
            </span>
          </div>
          <div className="info-strip">
            <ShieldCheck size={20} aria-hidden="true" />
            <span>
              No live AI is connected. Requests become a structured result before any simulated
              state changes.
            </span>
          </div>

          {result ? (
            <div className="assistant-result" aria-live="polite">
              <h3>{result.title}</h3>
              <p>{result.body}</p>
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
              Ask a supported demo question
            </label>
            <input
              id="assistant-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Try a supported request"
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
