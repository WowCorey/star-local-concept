import { useState } from "react";
import {
  ArrowRight,
  BusFront,
  CalendarCheck,
  Clock3,
  Gift,
  MapPin,
  Sparkles,
  Tv,
  Utensils,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Badge, Button, Card, SectionHeading, StatusDot } from "../components/ui";
import { applyLayoutPreset, getHomeNextAction } from "../features/v02/model";
import { demoRepository } from "../services/demoRepository";
import { useDemoStore } from "../state/demoStore";

const stageCopy = {
  "before-visit": {
    eyebrow: "Your next visit",
    title: "Your usual Thursday night?",
    detail: "Your table, dinner, sport and ride are ready to shape.",
  },
  approaching: {
    eyebrow: "Approaching venue",
    title: "Everything is holding for arrival",
    detail: "Your ride is approaching and the kitchen estimate is current.",
  },
  "in-venue": {
    eyebrow: "Tonight mode",
    title: "Your table is the operating centre",
    detail: "Orders, screens, service and the ride home stay together.",
  },
  "after-visit": {
    eyebrow: "Visit complete",
    title: "Keep what worked",
    detail: "Review the receipt, points, ride and memories from the night.",
  },
};

export function HomePage() {
  const navigate = useNavigate();
  const [confirming, setConfirming] = useState(false);
  const state = useDemoStore();
  const persona = demoRepository.getPersona(state.personaId);
  const venue = demoRepository.getVenue(state.venueId);
  const layout = demoRepository.getLayout(state.venueId);
  const table = layout.tables.find((item) => item.id === state.selectedTableId);
  const zone = venue.zones.find((item) => item.id === state.selectedZoneId);
  const campaign =
    demoRepository
      .getCampaigns(state.venueId)
      .find((item) => item.level === state.marketingLevel) ??
    demoRepository.getCampaigns(state.venueId)[0];
  const copy = stageCopy[state.stage];
  const bookingConfirmed = ["confirmed", "changed", "checked-in", "completed"].includes(
    state.bookingState,
  );
  const next = getHomeNextAction({
    bookingState: state.bookingState,
    selectedZoneId: state.selectedZoneId,
    selectedTableValid: Boolean(
      table &&
      table.zoneId === state.selectedZoneId &&
      applyLayoutPreset(table, state.layoutPresetId),
    ),
    courtesyBus: venue.services.courtesyBus,
    stage: state.stage,
    rideBooked: state.rideBooked,
    orderState: state.orderState,
    groupParticipantStates: state.groupRound.participants.map(
      (participant) => participant.acceptance,
    ),
    screenRequestState: state.screenRequestState,
    returnPassengers: state.returnPassengers,
    serviceRequestState: state.serviceRequestState,
  });

  const confirm = async () => {
    setConfirming(true);
    await demoRepository.confirmBooking();
    state.confirmVisit();
    setConfirming(false);
  };
  const runNext = () =>
    next.route === "service" ? state.setServiceOpen(true) : navigate(next.route);

  return (
    <div className="page-stack home-v02">
      <header className="home-greeting">
        <div>
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1>Good evening, {persona.firstName}</h1>
        </div>
        <span className="avatar" aria-label={`${persona.fullName}, demo member`}>
          {persona.initials}
        </span>
      </header>

      <Card className={`hero-card journey-hero stage-${state.stage}`}>
        <Badge tone="gold">
          {bookingConfirmed ? (
            <>
              <CalendarCheck size={13} />
              {state.bookingState === "checked-in" ? "Checked in" : "Visit confirmed"}
            </>
          ) : (
            "Held for you"
          )}
        </Badge>
        <h2>{copy.title}</h2>
        <p>{copy.detail}</p>
        <div className="hero-details">
          <span>
            <MapPin size={16} />
            {venue.shortName} · {zone?.name}
          </span>
          <span>
            <Clock3 size={16} />
            {table ? `Table ${table.displayNumber}` : "Choose a table"} · {state.partySize} people
          </span>
          <span>
            <Sparkles size={16} />
            {venue.event.title} · {venue.event.time}
          </span>
        </div>
        <div className="next-best-action">
          <span>Next best action</span>
          <strong>{next.label}</strong>
          <Button onClick={runNext}>
            {next.label}
            <ArrowRight size={16} />
          </Button>
        </div>
        {!bookingConfirmed ? (
          <div className="hero-actions">
            <Button onClick={confirm} disabled={confirming}>
              {confirming ? "Confirming…" : "Confirm visit"}
            </Button>
            <Button variant="secondary" onClick={() => navigate("/visit/zones")}>
              Choose venue zone
            </Button>
          </div>
        ) : null}
      </Card>

      <Card className={`tonight-venue-card venue-${state.venueId}`}>
        <div className="tonight-venue-art" aria-hidden="true">
          <span>{venue.shortName.slice(0, 1)}</span>
          <i />
          <i />
          <i />
        </div>
        <div>
          <p className="eyebrow">Tonight at {venue.shortName}</p>
          <h2>{venue.event.title}</h2>
          <p>{venue.event.detail}</p>
          <div className="venue-tags">
            <Badge tone="gold">{zone?.atmosphere}</Badge>
            {venue.services.courtesyBus ? (
              <Badge tone="teal">Courtesy bus</Badge>
            ) : (
              <Badge>Safe-travel help</Badge>
            )}
            {venue.services.bottleShopPickup ? <Badge>Collection</Badge> : null}
          </div>
        </div>
      </Card>

      <section aria-labelledby="tonight-heading">
        <SectionHeading
          title={state.stage === "after-visit" ? "Visit summary" : "Tonight"}
          action={<Link to="/visit">Edit plan</Link>}
        />
        <Card>
          <ol className="timeline timeline-v02">
            {venue.services.courtesyBus ? (
              <li>
                <time>6:15–6:45</time>
                <StatusDot tone={state.rideState === "delayed" ? "amber" : "teal"} />
                <span>
                  <strong>
                    {state.stage === "approaching" ? "Bus approaching" : "Courtesy-bus pickup"}
                  </strong>
                  <small>{state.inboundPassengers} passengers · your own private status</small>
                </span>
              </li>
            ) : null}
            <li>
              <time>{state.arrivalTime}</time>
              <StatusDot tone={state.stage === "in-venue" ? "green" : "burgundy"} />
              <span>
                <strong>
                  {state.stage === "in-venue"
                    ? `At Table ${table?.displayNumber}`
                    : `Arrive in ${zone?.name}`}
                </strong>
                <small>
                  {zone?.atmosphere} · {zone?.serviceModel?.drinks.replaceAll("-", " ")}
                </small>
              </span>
            </li>
            <li>
              <time>7:00 pm</time>
              <StatusDot tone={state.orderState === "draft" ? "muted" : "green"} />
              <span>
                <strong>
                  {state.orderState === "draft" ? "Food and group round" : "Order in progress"}
                </strong>
                <small>
                  Kitchen {state.kitchenWaitTime} min · Bar {state.barWaitTime} min
                </small>
              </span>
            </li>
            <li>
              <time>{venue.event.time}</time>
              <StatusDot
                tone={
                  state.screenRequestState === "approved" ||
                  state.screenRequestState === "requested"
                    ? "green"
                    : "amber"
                }
              />
              <span>
                <strong>{venue.event.title}</strong>
                <small>{state.screenRequestContent ?? zone?.screenSummary}</small>
              </span>
            </li>
            {state.serviceRequest ? (
              <li>
                <time>Now</time>
                <StatusDot tone={state.serviceRequest.state === "completed" ? "green" : "teal"} />
                <span>
                  <strong>{state.serviceRequest.kind}</strong>
                  <small>{state.serviceRequest.state.replaceAll("-", " ")}</small>
                </span>
              </li>
            ) : null}
            {state.stage === "after-visit" ? (
              <li>
                <time>Complete</time>
                <StatusDot tone="green" />
                <span>
                  <strong>Receipt and points ready</strong>
                  <small>Review what to remember next time</small>
                </span>
              </li>
            ) : null}
          </ol>
        </Card>
      </section>

      {campaign &&
      state.marketingInteraction !== "dismissed" &&
      state.marketingInteraction !== "category-disabled" ? (
        <Card className="offer-card marketing-card">
          <div className="offer-icon">
            <Gift size={21} />
          </div>
          <Badge tone="gold">{campaign.level} offer</Badge>
          <h2>{campaign.title}</h2>
          <p>{campaign.body}</p>
          <details>
            <summary>Why am I seeing this?</summary>
            <p>{campaign.basis.join(" · ")}</p>
            <small>Never uses: {campaign.excludedInputs.join(", ")}.</small>
          </details>
          <div className="marketing-actions">
            <button type="button" onClick={() => state.setMarketingInteraction("saved")}>
              Save offer
            </button>
            <button type="button" onClick={() => state.setMarketingInteraction("booked")}>
              Book using offer
            </button>
            <button type="button" onClick={() => state.setMarketingInteraction("dismissed")}>
              Not for me
            </button>
            <button
              type="button"
              onClick={() => state.setMarketingInteraction("category-disabled")}
            >
              Stop this type
            </button>
          </div>
        </Card>
      ) : (
        <Card className="offer-dismissed">
          <p>This offer is hidden. You can re-enable categories in Me.</p>
        </Card>
      )}

      <section className="quick-grid quick-grid-v02" aria-label="Quick actions">
        <Link className="quick-action" to="/visit/watch">
          <span>
            <Tv size={20} />
          </span>
          <strong>Watch Tonight</strong>
          <small>Near Table {table?.displayNumber}</small>
        </Link>
        <Link className="quick-action" to="/order/group">
          <span>
            <Utensils size={20} />
          </span>
          <strong>Group order</strong>
          <small>
            {
              state.groupRound.participants.filter(
                (participant) => participant.acceptance === "pending",
              ).length
            }{" "}
            awaiting
          </small>
        </Link>
        <Link className="quick-action" to="/ride">
          <span>
            <BusFront size={20} />
          </span>
          <strong>Ride home</strong>
          <small>{venue.services.courtesyBus ? state.returnWindow : "Ask staff"}</small>
        </Link>
        <button
          className="quick-action"
          type="button"
          data-dialog-trigger="service"
          onClick={() => state.setServiceOpen(true)}
        >
          <span>
            <Utensils size={20} />
          </span>
          <strong>Table Service</strong>
          <small>{state.serviceRequest?.state ?? "Available in venue"}</small>
        </button>
      </section>
    </div>
  );
}
