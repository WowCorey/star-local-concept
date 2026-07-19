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
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Badge, Button, Card, DemoDataLabel, SectionHeading, StatusDot } from "../components/ui";
import { demoRepository } from "../services/demoRepository";
import { useDemoStore } from "../state/demoStore";

export function HomePage() {
  const navigate = useNavigate();
  const [confirming, setConfirming] = useState(false);
  const personaId = useDemoStore((state) => state.personaId);
  const venueId = useDemoStore((state) => state.venueId);
  const stage = useDemoStore((state) => state.stage);
  const bookingState = useDemoStore((state) => state.bookingState);
  const orderState = useDemoStore((state) => state.orderState);
  const rideState = useDemoStore((state) => state.rideState);
  const screenRequestState = useDemoStore((state) => state.screenRequestState);
  const selectedTableId = useDemoStore((state) => state.selectedTableId);
  const partySize = useDemoStore((state) => state.partySize);
  const arrivalTime = useDemoStore((state) => state.arrivalTime);
  const drawEntries = useDemoStore((state) => state.drawEntries);
  const activePromotion = useDemoStore((state) => state.activePromotion);
  const confirmVisit = useDemoStore((state) => state.confirmVisit);
  const cancelVisit = useDemoStore((state) => state.cancelVisit);
  const persona = demoRepository.getPersona(personaId);
  const venue = demoRepository.getVenue(venueId);
  const layout = demoRepository.getLayout(venueId);
  const selectedTable = layout.tables.find((table) => table.id === selectedTableId);
  const inVenue = stage === "in-venue" || bookingState === "checked-in";

  const handleConfirm = async () => {
    setConfirming(true);
    await demoRepository.confirmBooking();
    confirmVisit();
    setConfirming(false);
  };

  const bookingConfirmed = ["confirmed", "changed", "checked-in", "completed"].includes(
    bookingState,
  );

  return (
    <div className="page-stack">
      <header className="home-greeting">
        <div>
          <p className="eyebrow">{inVenue ? "Tonight mode" : "Your next visit"}</p>
          <h1>Good evening, {persona.firstName}</h1>
        </div>
        <span className="avatar" aria-label={`${persona.fullName}, synthetic demo member`}>
          {persona.initials}
        </span>
      </header>

      <Card className="hero-card">
        <Badge tone="gold">
          {bookingConfirmed ? (
            <>
              <CalendarCheck size={13} /> {inVenue ? "Checked in" : "Visit confirmed"}
            </>
          ) : (
            "Held for you"
          )}
        </Badge>
        <h2>
          {inVenue
            ? `You're settled at ${selectedTable ? `Table ${selectedTable.displayNumber}` : persona.preferredTableDisplay}`
            : "Your usual Thursday night?"}
        </h2>
        <p>{venue.name}</p>
        <div className="hero-details">
          <span>
            <MapPin size={16} />
            {selectedTable
              ? `Table ${selectedTable.displayNumber} · ${persona.preferredZone}`
              : persona.preferredTableDisplay}
          </span>
          <span>
            <Clock3 size={16} />
            {partySize} people · {arrivalTime}
          </span>
          <span>
            <Sparkles size={16} />
            {venue.event.title} · {venue.event.time}
          </span>
        </div>
        <div className="hero-actions">
          {!bookingConfirmed ? (
            <Button onClick={handleConfirm} disabled={confirming}>
              {confirming ? "Confirming demo..." : "Confirm visit"}
            </Button>
          ) : (
            <Button onClick={() => navigate("/visit")}>
              {inVenue ? "View tonight's plan" : "Review visit"}
              <ArrowRight size={16} />
            </Button>
          )}
          <Button variant="secondary" onClick={() => navigate("/visit")}>
            Change details
          </Button>
          {!bookingConfirmed ? (
            <Button variant="ghost" onClick={cancelVisit}>
              Not this week
            </Button>
          ) : null}
        </div>
      </Card>

      <section aria-labelledby="tonight-heading">
        <SectionHeading
          title={inVenue ? "Tonight" : "Your Thursday plan"}
          action={<Link to="/visit">Edit</Link>}
        />
        <Card>
          <ol className="timeline">
            <li>
              <time>6:15-6:45</time>
              <StatusDot tone={rideState === "delayed" ? "amber" : "teal"} />
              <span>
                <strong>Courtesy-bus pickup</strong>
                <small>
                  {rideState === "delayed"
                    ? "Updated window - open Ride for details"
                    : "2 passengers · estimated window only"}
                </small>
              </span>
            </li>
            <li>
              <time>6:45 pm</time>
              <StatusDot tone={inVenue ? "green" : "burgundy"} />
              <span>
                <strong>{inVenue ? "Checked in" : "Arrive"}</strong>
                <small>
                  {selectedTable
                    ? `Table ${selectedTable.displayNumber}`
                    : persona.preferredTableDisplay}{" "}
                  · {persona.preferredZone}
                </small>
              </span>
            </li>
            <li>
              <time>7:00 pm</time>
              <StatusDot tone={orderState === "draft" ? "muted" : "green"} />
              <span>
                <strong>Dinner order</strong>
                <small>
                  {orderState === "draft"
                    ? "Your usual meal is ready to review"
                    : `Demo order · ${orderState.replaceAll("-", " ")}`}
                </small>
              </span>
            </li>
            <li>
              <time>{venueId === "harbour" ? "7:30 pm" : venue.event.time}</time>
              <StatusDot tone={screenRequestState === "approved" ? "green" : "burgundy"} />
              <span>
                <strong>{venueId === "harbour" ? "Cowboys game" : venue.event.title}</strong>
                <small>
                  {venueId === "harbour" ? "Screen 7 · family viewing area" : venue.event.detail}
                </small>
              </span>
            </li>
            <li>
              <time>{venue.event.time}</time>
              <StatusDot tone="amber" />
              <span>
                <strong>{venue.event.title}</strong>
                <small>{venue.event.detail}</small>
              </span>
            </li>
            {venue.services.courtesyBus ? (
              <li>
                <time>10:00-10:30</time>
                <StatusDot tone="teal" />
                <span>
                  <strong>Return courtesy bus</strong>
                  <small>Private status appears only when approaching</small>
                </span>
              </li>
            ) : null}
          </ol>
        </Card>
      </section>

      <section aria-label="Member summary" className="stat-grid">
        <div className="stat-card">
          <span>Member points</span>
          <strong>{persona.points.toLocaleString()}</strong>
          <DemoDataLabel />
        </div>
        <div className="stat-card">
          <span>Draw entries</span>
          <strong>{drawEntries}</strong>
          <DemoDataLabel />
        </div>
      </section>

      <Card className="offer-card">
        <div className="offer-icon">
          <Gift size={21} />
        </div>
        <Badge tone="gold">Relevant food offer</Badge>
        <h2>{activePromotion}</h2>
        <p>Use it on a qualifying fictional meal during this demonstration visit.</p>
        <p className="explain-line">
          <strong>Why this?</strong> {persona.firstName} enabled food offers and saved a venue-local
          food preference. Gaming, RSA and security data are excluded.
        </p>
      </Card>

      <section className="quick-grid" aria-label="Quick actions">
        <Link className="quick-action" to="/ride">
          <span>
            <BusFront size={20} />
          </span>
          <strong>Ride status</strong>
          <small>{venue.services.courtesyBus ? "Private timing" : "Not usual here"}</small>
        </Link>
        <Link className="quick-action" to="/visit">
          <span>
            <Tv size={20} />
          </span>
          <strong>Screen request</strong>
          <small>Zone-aware</small>
        </Link>
      </section>
    </div>
  );
}
