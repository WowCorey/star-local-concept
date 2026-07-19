import { useRef } from "react";
import { ArrowRight, Bot, CheckCircle2, PhoneCall, UserRound, X } from "lucide-react";
import { Badge, Button } from "../../components/ui";
import { demoRepository } from "../../services/demoRepository";
import { useDemoStore } from "../../state/demoStore";
import { useDialogFocus } from "../../hooks/useDialogFocus";
import type { PhoneCallState } from "../../types/domain";

const states: PhoneCallState[] = [
  "incoming",
  "disclosed",
  "identifying",
  "gathering",
  "confirming",
];

export function PhoneReceptionist() {
  const state = useDemoStore();
  const dialogRef = useRef<HTMLElement>(null);
  const scenarios = demoRepository.getPhoneScenarios();
  const scenario = scenarios.find((item) => item.id === state.phoneScenarioId) ?? scenarios[0]!;
  const booking = scenario.outcome.booking;
  const bookingVenue = booking ? demoRepository.getVenue(booking.venueId) : null;
  const bookingZone = bookingVenue?.zones.find((zone) => zone.id === booking?.zoneId);
  const bookingTable = booking
    ? demoRepository.getLayout(booking.venueId).tables.find((table) => table.id === booking.tableId)
    : null;

  useDialogFocus({
    dialogRef,
    onRequestClose: () => state.setPhoneOpen(false),
    restoreFocusSelector: "[data-dialog-trigger='phone'], [data-dialog-trigger='demo']",
  });

  const advance = () => {
    const nextCount = Math.min(scenario.turns.length, state.phoneTranscriptTurnCount + 1);
    if (scenario.outcome.humanTransfer && nextCount >= scenario.turns.length) {
      state.completePhoneScenario(scenario);
      return;
    }
    if (state.phoneTranscriptTurnCount >= scenario.turns.length) {
      state.completePhoneScenario(scenario);
      return;
    }
    state.setPhoneTranscriptTurnCount(nextCount);
    state.setPhoneCallState(states[Math.min(states.length - 1, nextCount - 1)]!);
  };

  return (
    <div
      className="overlay phone-overlay"
      role="presentation"
      onMouseDown={(event) => event.currentTarget === event.target && state.setPhoneOpen(false)}
    >
      <section
        ref={dialogRef}
        className="sheet phone-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="phone-title"
        tabIndex={-1}
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
            {scenario.turns.slice(0, state.phoneTranscriptTurnCount).map((turn, index) => (
              <div
                key={`${turn.speaker}-${index}`}
                className={turn.speaker === "assistant" ? "assistant-line" : "caller-line"}
              >
                <span>
                  {turn.speaker === "assistant" ? <Bot size={16} /> : <UserRound size={16} />}
                </span>
                <p>
                  <strong>
                    {turn.speaker === "assistant" ? "Automated assistant" : "Customer"}
                  </strong>
                  {turn.text}
                </p>
              </div>
            ))}
          </div>
          {state.phoneCallState === "confirming" && booking ? (
            <div className="booking-summary">
              <h3>Structured visit plan</h3>
              <dl>
                <div>
                  <dt>Venue</dt>
                  <dd>{bookingVenue?.name}</dd>
                </div>
                <div>
                  <dt>Table</dt>
                  <dd>
                    {bookingZone?.name} Table {bookingTable?.displayNumber}
                  </dd>
                </div>
                <div>
                  <dt>Party</dt>
                  <dd>{booking.partySize} people</dd>
                </div>
                <div>
                  <dt>Arrival</dt>
                  <dd>{booking.arrivalTime}</dd>
                </div>
                {scenario.outcome.ride.booked ? (
                  <div>
                    <dt>Inbound bus</dt>
                    <dd>
                      {scenario.outcome.ride.inboundPassengers} passengers ·{" "}
                      {scenario.outcome.ride.inboundWindow}
                    </dd>
                  </div>
                ) : (
                  <div>
                    <dt>Courtesy bus</dt>
                    <dd>Not booked</dd>
                  </div>
                )}
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
