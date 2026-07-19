import { Accessibility, ArrowLeft, Check, Eye, Users } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Badge, Button, Card, PageIntro, SectionHeading } from "../components/ui";
import { demoRepository } from "../services/demoRepository";
import { useDemoStore } from "../state/demoStore";

export function FloorPlanPage() {
  const navigate = useNavigate();
  const venueId = useDemoStore((state) => state.venueId);
  const selectedTableId = useDemoStore((state) => state.selectedTableId);
  const selectTable = useDemoStore((state) => state.selectTable);
  const venue = demoRepository.getVenue(venueId);
  const layout = demoRepository.getLayout(venueId);
  const selected = layout.tables.find((table) => table.id === selectedTableId) ?? layout.tables[0]!;

  return (
    <div className="page-stack">
      <Link className="back-link" to="/visit">
        <ArrowLeft size={17} />
        Back to visit
      </Link>
      <PageIntro eyebrow={layout.preset} title="Choose your table">
        A simplified customer map shows only safe, useful attributes. It contains no live bookings,
        staff notes or real venue geometry.
      </PageIntro>

      <Card className="map-card">
        <div className="map-heading">
          <div>
            <strong>{venue.name}</strong>
            <small>{layout.label}</small>
          </div>
          <Badge tone="teal">Synthetic layout</Badge>
        </div>
        <div className="floor-map" aria-label={`${venue.name} simplified table map`}>
          <div className="map-zone map-zone-main">
            <span>{venue.zones.find((zone) => zone.customerVisible)?.name ?? "Dining"}</span>
          </div>
          <div className="map-zone map-zone-side">
            <span>{venue.zones.filter((zone) => zone.customerVisible)[1]?.name ?? "Viewing"}</span>
          </div>
          <div className="step-free-path" aria-hidden="true" />
          {layout.tables.map((table) => (
            <button
              key={table.id}
              className={`map-table ${selectedTableId === table.id ? "selected" : ""} availability-${table.availabilityState}`}
              type="button"
              style={{
                left: `${table.x}%`,
                top: `${table.y}%`,
                width: `${table.width}%`,
                height: `${table.height}%`,
                transform: `rotate(${table.rotation}deg)`,
              }}
              onClick={() => selectTable(table.id)}
              aria-pressed={selectedTableId === table.id}
              aria-label={`Table ${table.displayNumber}, ${table.minimumCapacity} to ${table.maximumCapacity} people, ${table.availabilityState}`}
            >
              {table.displayNumber}
            </button>
          ))}
          <span className="screen-marker">Screen</span>
        </div>
        <div className="map-legend">
          <span>
            <i className="legend-held" />
            Held for you
          </span>
          <span>
            <i className="legend-available" />
            Available
          </span>
          <span>
            <i className="legend-path" />
            Step-free path
          </span>
        </div>
      </Card>

      <Card>
        <div className="table-summary">
          <span className="table-number">{selected.displayNumber}</span>
          <div>
            <Badge tone={selected.availabilityState === "held" ? "gold" : "success"}>
              {selected.availabilityState === "held" ? "Held for you" : "Available in demo"}
            </Badge>
            <h2>Table {selected.displayNumber}</h2>
            <p>{selected.customerDescription}</p>
          </div>
        </div>
        <div className="attribute-grid">
          <span>
            <Users size={17} />
            {selected.minimumCapacity}-{selected.maximumCapacity} people
          </span>
          <span>
            <Accessibility size={17} />
            {selected.accessibility ? "Step-free" : "Standard access"}
          </span>
          <span>
            <Eye size={17} />
            {selected.nearbyScreenIds.length ? "Screen visible" : "No nearby screen"}
          </span>
          <span>
            <Check size={17} />
            {selected.familySuitable ? "Family suitable" : `${selected.noiseLevel} atmosphere`}
          </span>
        </div>
        <Button full onClick={() => navigate("/visit")}>
          Use Table {selected.displayNumber}
        </Button>
      </Card>

      <section aria-labelledby="table-list-heading">
        <SectionHeading title="Table list" />
        <div className="table-list" id="table-list-heading">
          {layout.tables.map((table) => (
            <button
              key={table.id}
              type="button"
              className={table.id === selectedTableId ? "active" : ""}
              onClick={() => selectTable(table.id)}
            >
              <span>
                <strong>Table {table.displayNumber}</strong>
                <small>{table.customerDescription}</small>
              </span>
              <Badge tone={table.availabilityState === "held" ? "gold" : "success"}>
                {table.availabilityState}
              </Badge>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
