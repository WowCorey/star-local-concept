import {
  AlertTriangle,
  BusFront,
  Check,
  Clock3,
  MapPin,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import {
  Badge,
  Button,
  Card,
  PageIntro,
  SectionHeading,
  Stepper,
  StatusDot,
} from "../components/ui";
import { demoRepository } from "../services/demoRepository";
import { useDemoStore } from "../state/demoStore";
import type { BusState } from "../types/domain";

const stages: Array<{ state: BusState; label: string }> = [
  { state: "requested", label: "Booking received" },
  { state: "window-confirmed", label: "Window confirmed" },
  { state: "driver-assigned", label: "Driver assigned" },
  { state: "en-route", label: "En route to you" },
  { state: "arriving", label: "Arriving soon" },
  { state: "boarded", label: "Boarded" },
  { state: "completed", label: "Completed" },
];

export function RidePage() {
  const state = useDemoStore();
  const persona = demoRepository.getPersona(state.personaId);
  const venue = demoRepository.getVenue(state.venueId);
  const activeIndex = stages.findIndex((stage) => stage.state === state.rideState);
  const approaching = ["en-route", "arriving", "boarded", "completed"].includes(state.rideState);

  const advance = () => {
    const next = stages[Math.min((activeIndex < 0 ? 0 : activeIndex) + 1, stages.length - 1)];
    if (next) state.setRideState(next.state);
  };

  return (
    <div className="page-stack">
      <PageIntro
        eyebrow={`${venue.shortName} · Private ride`}
        title="A lift there. A clear way home."
      >
        {venue.services.courtesyBus
          ? "Choose broad time windows and see only the status needed for your own trip."
          : "Courtesy bus is not normally offered for this synthetic venue. Safe-arrival alternatives remain visible."}
      </PageIntro>

      {!venue.services.courtesyBus ? (
        <Card>
          <div className="empty-state">
            <BusFront size={30} />
            <h2>No venue bus tonight</h2>
            <p>
              Northside Sports Hotel uses a self-arrival focus in this demo. A future production
              service would show public transport, taxi and staff-assisted options.
            </p>
            <Button
              variant="secondary"
              onClick={() => state.requestService("Safe trip assistance")}
            >
              Ask staff about safe travel
            </Button>
          </div>
        </Card>
      ) : (
        <>
          <Card>
            <SectionHeading
              title="Book your windows"
              action={state.rideBooked ? <Badge tone="success">Booked in demo</Badge> : null}
            />
            <div className="ride-leg">
              <span className="ride-icon">
                <MapPin size={20} />
              </span>
              <div>
                <h3>Inbound</h3>
                <p>Generic pickup point saved privately</p>
                <label className="field">
                  <span>Pickup window</span>
                  <select
                    value={state.inboundWindow}
                    onChange={(event) => state.setRideWindow("inbound", event.target.value)}
                  >
                    <option>6:15 pm - 6:45 pm</option>
                    <option>6:30 pm - 7:00 pm</option>
                  </select>
                </label>
                <Stepper
                  label="Inbound passengers"
                  value={state.inboundPassengers}
                  max={8}
                  onChange={(value) => state.setRidePassengers("inbound", value)}
                />
              </div>
            </div>
            <div className="divider" />
            <div className="ride-leg">
              <span className="ride-icon ride-icon-return">
                <BusFront size={20} />
              </span>
              <div>
                <h3>Return</h3>
                <p>From the venue courtesy-bus pickup zone</p>
                <label className="field">
                  <span>Return window</span>
                  <select
                    value={state.returnWindow}
                    onChange={(event) => state.setRideWindow("return", event.target.value)}
                  >
                    <option>10:00 pm - 10:30 pm</option>
                    <option>10:30 pm - 11:00 pm</option>
                  </select>
                </label>
                <Stepper
                  label="Return passengers"
                  value={state.returnPassengers}
                  max={8}
                  onChange={(value) => state.setRidePassengers("return", value)}
                />
              </div>
            </div>
            <div className="info-strip">
              <UserCheck size={20} />
              <span>
                {persona.transportSummary}. Accessibility requirements are confirmed by a person in
                a real service.
              </span>
            </div>
            <Button variant="teal" full onClick={state.confirmRide}>
              Confirm ride windows
            </Button>
          </Card>

          <Card>
            <SectionHeading
              title="Your ride status"
              action={
                <Badge tone={state.rideState === "delayed" ? "warning" : "teal"}>
                  {state.rideState.replaceAll("-", " ")}
                </Badge>
              }
            />
            <div className={`eta-panel ${approaching ? "eta-live" : ""}`}>
              <span>
                <Clock3 size={22} />
              </span>
              <div>
                <small>{approaching ? "Approximate ETA" : "Estimated window"}</small>
                <strong>{approaching ? "About 8 minutes" : state.returnWindow}</strong>
              </div>
            </div>
            {state.rideState === "delayed" ? (
              <div className="warning-strip">
                <AlertTriangle size={20} />
                <span>
                  <strong>Your demo bus is delayed.</strong> Updated window: 10:20 pm - 10:50 pm.
                  Ask staff if this no longer works.
                </span>
              </div>
            ) : null}
            <ol className="ride-timeline" aria-live="polite">
              {stages.map((stage, index) => {
                const complete = activeIndex >= index && activeIndex >= 0;
                const current = stage.state === state.rideState;
                return (
                  <li key={stage.state} className={complete ? "complete" : ""}>
                    <StatusDot tone={complete ? "teal" : "muted"} />
                    <span>
                      <strong>{stage.label}</strong>
                      {current ? <small>Current synthetic status</small> : null}
                    </span>
                    {complete && !current ? <Check size={16} /> : null}
                  </li>
                );
              })}
            </ol>
            <Button
              variant="secondary"
              full
              onClick={advance}
              disabled={state.rideState === "completed"}
            >
              Advance demo status
            </Button>
          </Card>

          <Card>
            <div className="privacy-heading">
              <ShieldCheck size={22} />
              <div>
                <h2>Private by design</h2>
                <p>Only the information needed for your trip is shown.</p>
              </div>
            </div>
            <ul className="privacy-list">
              <li>No other passenger</li>
              <li>No other address or stop</li>
              <li>No full route</li>
              <li>No precise continuous vehicle movement</li>
            </ul>
            <p className="microcopy">
              This is a staged client-side tracker. No vehicle, GPS or driver service is connected.
            </p>
          </Card>
        </>
      )}
    </div>
  );
}
