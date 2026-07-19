import { useState } from "react";
import {
  Accessibility,
  CheckCircle2,
  Clock3,
  Info,
  Map,
  ShieldCheck,
  Tv2,
  UsersRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Badge, Button, Card, PageIntro, SectionHeading, Stepper, Toggle } from "../components/ui";
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
  const selectedTable = layout.tables.find((table) => table.id === state.selectedTableId);
  const selectedScreen = venue.screens.find((screen) =>
    selectedTable?.nearbyScreenIds.includes(screen.id),
  );

  const saveBooking = async () => {
    setSaving(true);
    await demoRepository.holdTable(state.selectedTableId);
    await demoRepository.confirmBooking();
    state.confirmVisit();
    setSaving(false);
  };

  const bookingTone =
    state.bookingState === "checked-in"
      ? "success"
      : state.bookingState === "held" || state.bookingState === "changed"
        ? "warning"
        : "teal";

  return (
    <div className="page-stack">
      <PageIntro eyebrow="Visit planner" title="Shape the night around you">
        Review the venue, arrival, seating and screen visibility. Every action stays inside this
        synthetic prototype.
      </PageIntro>

      <Card>
        <div
          className="venue-banner"
          style={{ "--venue-accent": venue.accent } as React.CSSProperties}
        >
          <div>
            <Badge tone={bookingTone}>{state.bookingState.replaceAll("-", " ")}</Badge>
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
        <div className="venue-tags">
          <Badge tone="neutral">{venue.tone}</Badge>
          {venue.services.courtesyBus ? (
            <Badge tone="teal">Courtesy bus</Badge>
          ) : (
            <Badge>Self-arrival focus</Badge>
          )}
          {venue.services.bottleShopPickup ? <Badge>Collection represented</Badge> : null}
        </div>
      </Card>

      <Card>
        <SectionHeading title="Booking review" />
        <div className="hold-banner">
          <Clock3 size={20} />
          <span>
            <strong>
              {selectedTable
                ? `Table ${selectedTable.displayNumber}`
                : persona.preferredTableDisplay}{" "}
              is held
            </strong>
            <small>Until 12:00 pm Thursday (fabricated demo deadline)</small>
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
          <label className="field">
            <span>Preferred zone</span>
            <select
              value={state.preferredZone}
              onChange={(event) => state.setPreferredZone(event.target.value)}
            >
              {venue.zones
                .filter((zone) => zone.customerVisible)
                .map((zone) => (
                  <option key={zone.id}>{zone.name}</option>
                ))}
            </select>
          </label>
        </div>
        <Stepper
          label="Party size"
          value={state.partySize}
          min={1}
          max={12}
          onChange={state.setPartySize}
        />
        <div className="toggle-list">
          <Toggle
            checked={state.quieterSeating}
            onChange={() => state.toggleBookingPreference("quieterSeating")}
            label="Quieter seating"
            description="A preference, subject to synthetic availability"
          />
          <Toggle
            checked={state.highChair}
            onChange={() => state.toggleBookingPreference("highChair")}
            label="High chair"
            description="Ask the team to confirm at arrival"
          />
          <Toggle
            checked={state.screenVisibility}
            onChange={() => state.toggleBookingPreference("screenVisibility")}
            label="Screen visibility"
            description="Only suitable screens for the selected zone"
          />
        </div>
        <div className="inline-actions booking-actions">
          <Button onClick={saveBooking} disabled={saving}>
            {saving
              ? "Saving demo..."
              : state.bookingState === "confirmed"
                ? "Confirm changes"
                : "Confirm visit"}
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
                Table {selectedTable.displayNumber} · {state.preferredZone}
              </h3>
              <p>{selectedTable.customerDescription}</p>
              <div className="venue-tags">
                {selectedTable.accessibility ? <Badge tone="teal">Step-free</Badge> : null}
                {selectedTable.familySuitable ? <Badge>Family suitable</Badge> : null}
                <Badge>
                  {selectedTable.minimumCapacity}-{selectedTable.maximumCapacity} people
                </Badge>
                <Badge>{selectedTable.noiseLevel} noise</Badge>
              </div>
            </div>
          </div>
        ) : (
          <p>Select a table from the customer-safe floor plan.</p>
        )}
      </Card>

      <Card>
        <SectionHeading title="Television request" />
        <div className="screen-card">
          <span>
            <Tv2 size={22} />
          </span>
          <div>
            <h3>{selectedScreen?.name ?? venue.screens[0]?.name ?? "Venue screen"}</h3>
            <p>
              {state.venueId === "harbour"
                ? "Nearby family viewing can show the Cowboys game. Racing screens in the Sports Bar remain unchanged."
                : `${venue.event.title} follows this venue's local screen schedule.`}
            </p>
          </div>
        </div>
        {state.screenRequestState === "approved" ? (
          <div className="info-strip">
            <CheckCircle2 size={20} />
            <span>
              <strong>Request approved in the demo.</strong> Screen 7 is scheduled for the Cowboys
              game.
            </span>
          </div>
        ) : (
          <Button
            variant="secondary"
            full
            onClick={() =>
              state.setScreenRequestState(state.venueId === "harbour" ? "approved" : "scheduled")
            }
          >
            {state.venueId === "harbour" ? "Request the Cowboys game" : "Review scheduled screens"}
          </Button>
        )}
        <p className="microcopy">
          Screen requests never override locked or regulated zone content.
        </p>
      </Card>

      <Card>
        <SectionHeading title="Arrival and access" />
        <div className="info-strip">
          <Accessibility size={21} />
          <span>
            A synthetic step-free route links the main arrival point, amenities and your selected
            table. Venue staff would confirm the real route.
          </span>
        </div>
        <div className="access-grid">
          <span>
            <ShieldCheck size={18} />
            Wheelchair space
          </span>
          <span>
            <UsersRound size={18} />
            High-chair check
          </span>
          <span>
            <Info size={18} />
            Human help available
          </span>
        </div>
        {state.bookingState !== "checked-in" ? (
          <Button variant="teal" full onClick={state.checkIn}>
            Simulate{" "}
            {selectedTable ? `Table ${selectedTable.displayNumber}` : persona.preferredTableDisplay}{" "}
            check-in
          </Button>
        ) : (
          <div className="success-panel">
            <CheckCircle2 size={22} />
            <span>
              <strong>Checked in</strong>
              <small>Tonight mode is active. No QR, camera or location was used.</small>
            </span>
          </div>
        )}
      </Card>
    </div>
  );
}
