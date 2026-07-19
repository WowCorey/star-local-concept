import { useEffect } from "react";
import { Accessibility, Flag, RotateCcw, Trophy, X } from "lucide-react";
import { Button, Toggle } from "../../components/ui";
import { demoRepository } from "../../services/demoRepository";
import { useDemoStore, type DemoScenario } from "../../state/demoStore";
import type {
  BookingState,
  BusState,
  OrderState,
  PersonaId,
  ServiceState,
  VisitStage,
} from "../../types/domain";

const scenarioButtons: Array<{ id: DemoScenario; label: string; icon: typeof Flag }> = [
  { id: "flagship", label: "Flagship journey", icon: Flag },
  { id: "sports-night", label: "Sports night", icon: Trophy },
  { id: "accessibility", label: "Accessibility", icon: Accessibility },
];

export function DemoControls() {
  const state = useDemoStore();
  const personas = demoRepository.getPersonas();
  const venues = demoRepository.getVenues();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") state.setDemoOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [state]);

  return (
    <div
      className="overlay"
      role="presentation"
      onMouseDown={(event) => event.currentTarget === event.target && state.setDemoOpen(false)}
    >
      <section className="sheet" role="dialog" aria-modal="true" aria-labelledby="demo-title">
        <header className="sheet-header">
          <div>
            <p className="eyebrow">Presenter only</p>
            <h2 id="demo-title">Demo Controls</h2>
          </div>
          <button
            className="icon-button"
            type="button"
            onClick={() => state.setDemoOpen(false)}
            aria-label="Close Demo Controls"
          >
            <X size={21} />
          </button>
        </header>
        <div className="sheet-stack">
          <div className="control-group">
            <h3>Journey presets</h3>
            <div className="preset-grid">
              {scenarioButtons.map(({ id, label, icon: Icon }) => (
                <button type="button" key={id} onClick={() => state.loadScenario(id)}>
                  <Icon size={20} />
                  <br />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="control-group field-grid">
            <h3>Context</h3>
            <label className="field">
              <span>Active persona</span>
              <select
                value={state.personaId}
                onChange={(event) => state.setPersona(event.target.value as PersonaId)}
              >
                {personas.map((persona) => (
                  <option key={persona.id} value={persona.id}>
                    {persona.fullName}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Active venue</span>
              <select
                value={state.venueId}
                onChange={(event) => state.setVenue(event.target.value as typeof state.venueId)}
              >
                {venues.map((venue) => (
                  <option key={venue.id} value={venue.id}>
                    {venue.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Simulated day</span>
              <select
                value={state.simulatedDay}
                onChange={(event) => state.setSimulatedDay(event.target.value)}
              >
                <option>Wednesday</option>
                <option>Thursday</option>
                <option>Saturday</option>
                <option>Tuesday</option>
                <option>Sunday</option>
              </select>
            </label>
            <label className="field">
              <span>Simulated time</span>
              <input
                value={state.simulatedTime}
                onChange={(event) => state.setSimulatedTime(event.target.value)}
              />
            </label>
            <label className="field">
              <span>Visit stage</span>
              <select
                value={state.stage}
                onChange={(event) => state.setStage(event.target.value as VisitStage)}
              >
                <option value="before-visit">Before visit</option>
                <option value="approaching">Approaching venue</option>
                <option value="in-venue">In venue</option>
                <option value="after-visit">After visit</option>
              </select>
            </label>
          </div>

          <div className="control-group field-grid">
            <h3>Visit and service states</h3>
            <label className="field">
              <span>Booking</span>
              <select
                value={state.bookingState}
                onChange={(event) => state.setBookingState(event.target.value as BookingState)}
              >
                {[
                  "suggested",
                  "held",
                  "confirmed",
                  "changed",
                  "cancelled",
                  "checked-in",
                  "completed",
                ].map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Ride</span>
              <select
                value={state.rideState}
                onChange={(event) => state.setRideState(event.target.value as BusState)}
              >
                {[
                  "requested",
                  "window-confirmed",
                  "driver-assigned",
                  "en-route",
                  "arriving",
                  "boarded",
                  "completed",
                  "delayed",
                  "missed",
                ].map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Order</span>
              <select
                value={state.orderState}
                onChange={(event) => state.setOrderState(event.target.value as OrderState)}
              >
                {[
                  "draft",
                  "awaiting-confirmation",
                  "submitted",
                  "preparing",
                  "ready",
                  "delivered",
                  "issue-reported",
                ].map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Service request</span>
              <select
                value={state.serviceRequestState ?? "none"}
                onChange={(event) =>
                  state.setServiceRequestState(
                    event.target.value === "none" ? null : (event.target.value as ServiceState),
                  )
                }
              >
                <option value="none">none</option>
                {["requested", "accepted", "on-the-way", "completed"].map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Kitchen wait time</span>
              <select
                value={state.kitchenWaitTime}
                onChange={(event) => state.setKitchenWaitTime(Number(event.target.value))}
              >
                <option value={18}>18 minutes</option>
                <option value={35}>35 minute delay</option>
                <option value={0}>Service unavailable</option>
              </select>
            </label>
            <label className="field">
              <span>Member-draw entries</span>
              <input
                type="number"
                min={0}
                value={state.drawEntries}
                onChange={(event) =>
                  useDemoStore.setState({ drawEntries: Number(event.target.value) })
                }
              />
            </label>
            <label className="field">
              <span>Active promotion</span>
              <input
                value={state.activePromotion}
                onChange={(event) => state.setActivePromotion(event.target.value)}
              />
            </label>
          </div>

          <div className="control-group toggle-list">
            <h3>Review and availability</h3>
            <Toggle
              checked={state.staffReview}
              onChange={() => state.setStaffReview(!state.staffReview)}
              label="Staff review state"
              description="Shows human confirmation for safety-sensitive actions"
            />
            <Toggle
              checked={state.phoneAudioAvailable}
              onChange={() => state.setPhoneAudio(!state.phoneAudioAvailable)}
              label="Phone audio available"
              description="Simulated only; no audio stream"
            />
            <Toggle
              checked={state.soldOutItemIds.includes("harbour-chowder")}
              onChange={() => state.toggleSoldOut("harbour-chowder")}
              label="Chowder sold out"
              description="Demonstrates a venue-local alternative"
            />
          </div>

          <Button variant="danger" full onClick={() => state.resetDemo()}>
            <RotateCcw size={18} />
            Reset demo
          </Button>
        </div>
      </section>
    </div>
  );
}
