import { useState } from "react";
import {
  Accessibility,
  CheckCircle2,
  Clock3,
  Map,
  ShieldCheck,
  Tv2,
  UsersRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Badge, Button, Card, PageIntro, SectionHeading, Stepper, Toggle } from "../components/ui";
import { VisitNav } from "../components/VisitNav";
import { demoRepository } from "../services/demoRepository";
import { useDemoStore } from "../state/demoStore";
import type { VenueId } from "../types/domain";

export function VisitPage() {
  const [saving, setSaving] = useState(false);
  const state = useDemoStore();
  const persona = demoRepository.getPersona(state.personaId);
  const venue = demoRepository.getVenue(state.venueId);
  const venues = demoRepository.getVenues();
  const layout = demoRepository.getLayout(state.venueId);
  const zone =
    venue.zones.find((item) => item.id === state.selectedZoneId) ??
    venue.zones.find((item) => item.customerVisible)!;
  const selectedTable = layout.tables.find((table) => table.id === state.selectedTableId);

  const saveBooking = async () => {
    setSaving(true);
    await demoRepository.holdTable(state.selectedTableId);
    await demoRepository.confirmBooking();
    state.confirmVisit();
    setSaving(false);
  };

  return (
    <div className="page-stack">
      <VisitNav />
      <PageIntro eyebrow="Visit planner" title="Shape the whole night">
        Choose the venue atmosphere first, then a table, transport and entertainment that genuinely
        fit that zone.
      </PageIntro>

      <Card className="venue-story-card">
        <div
          className="venue-banner"
          style={{ "--venue-accent": venue.accent } as React.CSSProperties}
        >
          <div>
            <Badge tone="gold">{venue.tone}</Badge>
            <h2>{venue.name}</h2>
            <p>{venue.positioning}</p>
          </div>
          <span aria-hidden="true">
            {venue.shortName
              .split(" ")
              .map((word) => word[0])
              .join("")
              .slice(0, 2)}
          </span>
        </div>
        <label className="field">
          <span>Change venue</span>
          <select
            aria-label="Active venue"
            value={state.venueId}
            onChange={(event) => state.setVenue(event.target.value as VenueId)}
          >
            {venues.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <p className="venue-description">{venue.description}</p>
        <div className="tonight-local">
          <div>
            <p className="eyebrow">Tonight here</p>
            <h3>{venue.event.title}</h3>
            <p>{venue.event.detail}</p>
          </div>
          <Badge tone="teal">{venue.event.time}</Badge>
        </div>
      </Card>

      <Card className="selected-zone-card">
        <SectionHeading
          title="Your venue zone"
          action={<Link to="/visit/zones">Compare zones</Link>}
        />
        <div className={`zone-mini-visual zone-${zone.slug}`}>
          <span>{zone.name}</span>
          <i />
          <i />
          <i />
        </div>
        <h2>{zone.atmosphere}</h2>
        <p>{zone.description}</p>
        <div className="venue-tags">
          <Badge tone="gold">{zone.noiseLevel} noise</Badge>
          <Badge>{zone.serviceModel?.food.replaceAll("-", " ")}</Badge>
          <Badge tone="teal">{zone.suitableTableCount} suitable tables</Badge>
        </div>
        <ul className="zone-feature-list">
          {zone.features?.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
        <Button full onClick={() => state.selectZone(zone.id)}>
          {state.selectedZoneId === zone.id ? `${zone.name} selected` : `Choose ${zone.name}`}
        </Button>
      </Card>

      <Card>
        <SectionHeading
          title="Booking review"
          action={
            <Badge tone={state.bookingState === "checked-in" ? "success" : "warning"}>
              {state.bookingState.replaceAll("-", " ")}
            </Badge>
          }
        />
        <div className="hold-banner">
          <Clock3 size={20} />
          <span>
            <strong>
              {selectedTable
                ? `Table ${selectedTable.displayNumber}`
                : persona.preferredTableDisplay}{" "}
              is held
            </strong>
            <small>{zone.name} · until 12:00 pm Thursday</small>
          </span>
        </div>
        <div className="field-grid two-columns">
          <label className="field">
            <span>Arrival time</span>
            <select
              value={state.arrivalTime}
              onChange={(event) => state.setArrivalTime(event.target.value)}
            >
              <option>6:15 pm</option>
              <option>6:45 pm</option>
              <option>7:00 pm</option>
              <option>7:30 pm</option>
            </select>
          </label>
          <Stepper
            label="Party size"
            value={state.partySize}
            min={1}
            max={12}
            onChange={state.setPartySize}
          />
        </div>
        <div className="toggle-list">
          <Toggle
            checked={state.quieterSeating}
            onChange={() => state.toggleBookingPreference("quieterSeating")}
            label="Quieter seating"
            description="Highlights genuinely quieter tables"
          />
          <Toggle
            checked={state.highChair}
            onChange={() => state.toggleBookingPreference("highChair")}
            label="High chair"
            description="Requires a suitable table and team confirmation"
          />
          <Toggle
            checked={state.screenVisibility}
            onChange={() => state.toggleBookingPreference("screenVisibility")}
            label="Screen visibility"
            description="Only real sightlines from the selected table"
          />
        </div>
        <div className="inline-actions booking-actions">
          <Button onClick={saveBooking} disabled={saving}>
            {saving ? "Confirming…" : "Confirm visit"}
          </Button>
          <Link className="button button-secondary" to="/visit/floor-plan">
            <Map size={17} />
            Choose table
          </Link>
        </div>
      </Card>

      <Card>
        <SectionHeading
          title="Your table"
          action={<Link to="/visit/floor-plan">View floor plan</Link>}
        />
        {selectedTable ? (
          <div className="table-summary">
            <span className="table-number">{selectedTable.displayNumber}</span>
            <div>
              <h3>
                Table {selectedTable.displayNumber} · {zone.name}
              </h3>
              <p>{selectedTable.customerDescription}</p>
              <div className="venue-tags">
                {selectedTable.accessibility ? <Badge tone="teal">Step-free</Badge> : null}
                {selectedTable.familySuitable ? <Badge>Family suitable</Badge> : null}
                <Badge>{selectedTable.tableType} table</Badge>
                <Badge>{selectedTable.noiseLevel} atmosphere</Badge>
              </div>
            </div>
          </div>
        ) : (
          <p>Choose a table inside {zone.name}.</p>
        )}
      </Card>

      <Card className="watch-teaser">
        <div className="screen-card">
          <span>
            <Tv2 size={22} />
          </span>
          <div>
            <p className="eyebrow">Watch Tonight</p>
            <h3>{zone.screenSummary}</h3>
            <p>{zone.eventSummary}</p>
          </div>
        </div>
        {state.venueId === "harbour" && state.screenRequestState === "idle" ? (
          <Button
            variant="secondary"
            full
            onClick={() => state.requestScreen("screen-7", "Cowboys vs Broncos")}
          >
            Request the Cowboys game
          </Button>
        ) : state.screenRequestState === "requested" ? (
          <div className="info-strip" aria-live="polite">
            <Clock3 size={20} />
            <span>
              <strong>Request sent</strong> · venue staff controls approval and scheduling.
            </span>
          </div>
        ) : state.screenRequestState === "approved" ? (
          <div className="success-panel">
            <CheckCircle2 size={20} />
            <span>
              <strong>Request approved</strong>
              <small>Screen 7 is scheduled for the Cowboys game.</small>
            </span>
          </div>
        ) : null}
        <Link className="button button-secondary button-full" to="/visit/watch">
          Open screen control centre
        </Link>
      </Card>

      <Card>
        <SectionHeading title="Arrival and access" />
        <div className="info-strip">
          <Accessibility size={21} />
          <span>{zone.accessibilitySummary}. Venue staff would confirm the real route.</span>
        </div>
        <div className="access-grid">
          <span>
            <ShieldCheck size={18} />
            Human confirmation
          </span>
          <span>
            <UsersRound size={18} />
            Party needs retained
          </span>
        </div>
        {state.bookingState !== "checked-in" ? (
          <Button variant="teal" full onClick={state.checkIn}>
            Check in at{" "}
            {selectedTable ? `Table ${selectedTable.displayNumber}` : persona.preferredTableDisplay}
          </Button>
        ) : (
          <div className="success-panel">
            <CheckCircle2 size={22} />
            <span>
              <strong>Checked in</strong>
              <small>Tonight mode and Table Service are active.</small>
            </span>
          </div>
        )}
      </Card>
    </div>
  );
}
