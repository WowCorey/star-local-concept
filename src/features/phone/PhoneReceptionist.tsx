import { useEffect } from "react";
import { ArrowRight, Bot, CheckCircle2, PhoneCall, UserRound, X } from "lucide-react";
import { Badge, Button } from "../../components/ui";
import { demoRepository } from "../../services/demoRepository";
import { useDemoStore } from "../../state/demoStore";
import type { PhoneCallState } from "../../types/domain";

const states: PhoneCallState[] = [
  "incoming",
  "disclosed",
  "identifying",
  "gathering",
  "confirming",
  "completed",
];

export function PhoneReceptionist() {
  const state = useDemoStore();
  const scenarios = demoRepository.getPhoneScenarios();
  const scenario = scenarios.find((item) => item.id === state.phoneScenarioId) ?? scenarios[0]!;
  const stateIndex = states.indexOf(state.phoneCallState);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && state.setPhoneOpen(false);
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [state]);

  const advance = () => {
    if (scenario.requiresHumanTransfer && stateIndex >= 2) {
      state.setPhoneCallState("human-transfer");
      return;
    }
    if (stateIndex >= states.length - 2) state.completePhoneScenario(scenario.createsRide);
    else state.setPhoneCallState(states[Math.max(0, stateIndex + 1)]!);
  };

  const visibleLines = Math.max(1, stateIndex + 1);
  return (
    <div
      className="overlay phone-overlay"
      role="presentation"
      onMouseDown={(event) => event.currentTarget === event.target && state.setPhoneOpen(false)}
    >
      <section
        className="sheet phone-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="phone-title"
      >
        <header className="sheet-header">
          <div>
            <p className="eyebrow">Presentation-only call</p>
            <h2 id="phone-title">AI telephone receptionist</h2>
          </div>
          <button
            className="icon-button"
            type="button"
            onClick={() => state.setPhoneOpen(false)}
            aria-label="Close phone simulation"
          >
            <X size={21} />
          </button>
        </header>
        <div className="sheet-stack">
          <label className="field">
            <span>Call scenario</span>
            <select
              value={scenario.id}
              onChange={(event) => state.setPhoneScenario(event.target.value)}
            >
              {scenarios.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </select>
          </label>
          <div className="incoming-call">
            <span className="phone-pulse">
              <PhoneCall size={24} />
            </span>
            <div>
              <Badge tone="teal">{state.phoneCallState.replaceAll("-", " ")}</Badge>
              <h3>{scenario.title}</h3>
              <p>No real phone connection</p>
            </div>
          </div>
          <div
            className="call-transcript"
            aria-live="polite"
            aria-label="Accessible phone call transcript"
          >
            {scenario.assistantLines.slice(0, visibleLines).map((line) => (
              <div key={line} className="assistant-line">
                <span>
                  <Bot size={16} />
                </span>
                <p>
                  <strong>Automated assistant</strong>
                  {line}
                </p>
              </div>
            ))}
            {stateIndex >= 1 ? (
              <div className="caller-line">
                <span>
                  <UserRound size={16} />
                </span>
                <p>
                  <strong>Customer</strong>
                  {scenario.customerLine}
                </p>
              </div>
            ) : null}
          </div>
          {state.phoneCallState === "confirming" ? (
            <div className="booking-summary">
              <h3>Structured visit plan</h3>
              <dl>
                <div>
                  <dt>Table</dt>
                  <dd>
                    {scenario.venueId === "northside" ? "Sports Bar Table 12" : "Bistro Table 23"}
                  </dd>
                </div>
                <div>
                  <dt>Party</dt>
                  <dd>{scenario.venueId === "northside" ? "4 people" : "6 people"}</dd>
                </div>
                <div>
                  <dt>Arrival</dt>
                  <dd>{scenario.venueId === "northside" ? "7:30 pm" : "6:45 pm"}</dd>
                </div>
                {scenario.createsRide ? (
                  <div>
                    <dt>Inbound bus</dt>
                    <dd>2 passengers · 6:15–6:45 pm</dd>
                  </div>
                ) : null}
              </dl>
            </div>
          ) : null}
          {state.phoneCallState === "human-transfer" ? (
            <div className="safety-strip">
              <UserRound size={20} />
              <span>
                <strong>Transferring to a person.</strong> The assistant will not invent an allergy
                answer.
              </span>
            </div>
          ) : null}
          {state.phoneCallState === "completed" ? (
            <div className="success-panel">
              <CheckCircle2 size={22} />
              <span>
                <strong>Visit plan created</strong>
                <small>The booking and ride now appear in the same local app state.</small>
              </span>
            </div>
          ) : null}
          {!["completed", "human-transfer"].includes(state.phoneCallState) ? (
            <Button full onClick={advance}>
              Continue call <ArrowRight size={17} />
            </Button>
          ) : null}
          <Button
            variant="secondary"
            full
            onClick={() => state.setPhoneCallState("human-transfer")}
          >
            <UserRound size={17} />
            Transfer to a person
          </Button>
        </div>
      </section>
    </div>
  );
}
