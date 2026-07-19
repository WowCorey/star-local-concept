import { Accessibility, ArrowLeft, Check, Eye, Filter, MapPin, Users, Volume2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Badge, Button, Card, PageIntro, SectionHeading } from "../components/ui";
import { VisitNav } from "../components/VisitNav";
import { applyLayoutPreset, tableMatchReasons, tableMatchesFilter } from "../features/v02/model";
import { demoRepository } from "../services/demoRepository";
import { useDemoStore } from "../state/demoStore";
import type { TableFilter, VenueTable } from "../types/domain";

const filters: Array<[TableFilter, string]> = [
  ["family", "Family suitable"],
  ["screen-view", "Best screen view"],
  ["quiet", "Quieter tables"],
  ["step-free", "Step-free access"],
  ["outdoor", "Outdoor seating"],
  ["amenities", "Near amenities"],
  ["standard-height", "Standard-height"],
  ["high-table", "High table"],
  ["large-group", "Large group"],
  ["live-entertainment", "Close to live entertainment"],
];

const landmarks: Record<string, string[]> = {
  bistro: [
    "Entrance",
    "Bistro service",
    "Kitchen pass",
    "Amenities",
    "Screen 7",
    "Accessible route",
  ],
  "sports-bar": ["Sports entry", "Main wall", "Bar", "Screen 4", "Racing boundary", "Amenities"],
  "public-bar": ["Entry", "Main bar", "Standing rail", "Pickup", "Amenities"],
  outdoor: ["Covered edge", "Garden boundary", "Service point", "Bus pickup", "Amenities"],
  function: ["Function entry", "Stage", "Screen", "Service edge", "Accessible route"],
};

export function FloorPlanPage() {
  const navigate = useNavigate();
  const state = useDemoStore();
  const venue = demoRepository.getVenue(state.venueId);
  const layout = demoRepository.getLayout(state.venueId);
  const zone =
    venue.zones.find((item) => item.id === state.selectedZoneId) ??
    venue.zones.find((item) => item.customerVisible)!;
  const preset = demoRepository
    .getLayoutPresets()
    .find((item) => item.id === state.layoutPresetId)!;
  const zoneTables = layout.tables
    .filter((table) => table.zoneId === zone.id)
    .map((table) => applyLayoutPreset(table, state.layoutPresetId))
    .filter((table): table is VenueTable => Boolean(table));
  const joinedTables = zoneTables.filter((table) => preset.joinedTableIds.includes(table.id));
  const joinedCapacity = joinedTables.reduce((sum, table) => sum + table.maximumCapacity, 0);
  const joinedBoundary =
    joinedTables.length > 1
      ? {
          left: Math.max(1, Math.min(...joinedTables.map((table) => table.x)) - 3),
          top: Math.max(1, Math.min(...joinedTables.map((table) => table.y)) - 5),
          right: Math.min(99, Math.max(...joinedTables.map((table) => table.x + table.width)) + 3),
          bottom: Math.min(
            99,
            Math.max(...joinedTables.map((table) => table.y + table.height)) + 5,
          ),
        }
      : null;
  const selected = zoneTables.find((table) => table.id === state.selectedTableId) ?? zoneTables[0];
  const activeFilters = state.tableFilters;
  const isMatch = (table: VenueTable) =>
    !activeFilters.length || activeFilters.every((filter) => tableMatchesFilter(table, filter));
  const zoneLandmarks = landmarks[zone.slug ?? "bistro"] ?? landmarks.bistro!;

  return (
    <div className="page-stack">
      <VisitNav />
      <Link className="back-link" to="/visit/zones">
        <ArrowLeft size={17} />
        Back to zones
      </Link>
      <PageIntro eyebrow={`${preset.label} · ${zone.name}`} title={`Choose a ${zone.name} table`}>
        This original customer map shows atmosphere, access, table type and genuine screen
        sightlines—never live bookings or operational geometry.
      </PageIntro>

      <Card className="preset-story">
        <div>
          <p className="eyebrow">Current venue layout</p>
          <h2>{preset.label}</h2>
          <p>{preset.description}</p>
        </div>
        <Badge tone="gold">{preset.emphasis}</Badge>
        <small>
          Presenters can switch approved layout presets in Demo Controls. Customers cannot edit the
          floor.
        </small>
      </Card>

      <Card className="filter-card">
        <SectionHeading
          title="Find the right table"
          action={
            activeFilters.length ? (
              <button type="button" onClick={state.clearTableFilters}>
                Clear
              </button>
            ) : null
          }
        />
        <div className="table-filter-grid" role="group" aria-label="Table filters">
          {filters.map(([id, label]) => (
            <button
              key={id}
              type="button"
              aria-pressed={activeFilters.includes(id)}
              onClick={() => state.toggleTableFilter(id)}
            >
              <Filter size={14} />
              {label}
            </button>
          ))}
        </div>
        {activeFilters.length ? (
          <p className="filter-result" aria-live="polite">
            {zoneTables.filter(isMatch).length} of {zoneTables.length} tables match every selected
            filter.
          </p>
        ) : null}
      </Card>

      <Card className="map-card">
        <div className="map-heading">
          <div>
            <strong>{venue.name}</strong>
            <small>
              {zone.name} · {zone.atmosphere}
            </small>
          </div>
          <Badge tone="teal">Zone-aware layout</Badge>
        </div>
        <div
          className={`floor-map floor-map-v02 floor-map-${zone.slug}`}
          aria-label={`${venue.name} ${zone.name} simplified table map`}
        >
          <div className="zone-boundary">
            <span>{zone.name}</span>
          </div>
          <div className="accessible-route" aria-hidden="true" />
          {zoneLandmarks.map((landmark, index) => (
            <span key={landmark} className={`map-landmark landmark-${index + 1}`}>
              {landmark}
            </span>
          ))}
          {joinedBoundary ? (
            <div
              className="joined-table-boundary"
              style={{
                left: `${joinedBoundary.left}%`,
                top: `${joinedBoundary.top}%`,
                width: `${joinedBoundary.right - joinedBoundary.left}%`,
                height: `${joinedBoundary.bottom - joinedBoundary.top}%`,
              }}
              role="group"
              aria-label={`Joined group: Tables ${joinedTables.map((table) => table.displayNumber).join(" and ")}, combined capacity ${joinedCapacity} people. Tables remain individually selectable.`}
            >
              <span>Joined group · up to {joinedCapacity}</span>
              <i aria-hidden="true" />
            </div>
          ) : null}
          {zoneTables.map((table) => {
            const matching = isMatch(table);
            const reasons = tableMatchReasons(table, activeFilters);
            const joined = joinedTables.length > 1 && preset.joinedTableIds.includes(table.id);
            return (
              <button
                key={table.id}
                className={`map-table map-table-v02 table-${table.tableType} ${joined ? "joined-member" : ""} ${state.selectedTableId === table.id ? "selected" : ""} ${activeFilters.length && !matching ? "receded" : ""} ${matching && activeFilters.length ? "matching" : ""}`}
                type="button"
                style={{
                  left: `${table.x}%`,
                  top: `${table.y}%`,
                  width: `${table.width}%`,
                  height: `${table.height}%`,
                  transform: `rotate(${table.rotation}deg)`,
                }}
                onClick={() => state.selectTable(table.id)}
                aria-pressed={state.selectedTableId === table.id}
                aria-label={`Table ${table.displayNumber}, ${table.minimumCapacity} to ${table.maximumCapacity} people, ${zone.name}, ${table.tableType ?? "standard"} table, ${joined ? `member of a joined group with combined capacity ${joinedCapacity}, individually selectable, ` : ""}${table.noiseLevel} atmosphere, ${table.accessibility ? "step-free" : "standard access"}, ${table.nearbyScreenIds.length ? "screen visible" : "no screen sightline"}, ${matching ? `matches ${reasons.join(", ") || "current selection"}` : "does not match selected filters"}`}
              >
                {table.displayNumber}
              </button>
            );
          })}
          {zone.slug === "sports-bar" ? (
            <div className="regulated-boundary">Gaming-room boundary · no customer data</div>
          ) : null}
        </div>
        <div className="map-legend">
          <span>
            <i className="legend-held" />
            Selected
          </span>
          <span>
            <i className="legend-available" />
            Available
          </span>
          <span>
            <i className="legend-match" />
            Matches filters
          </span>
          <span>
            <i className="legend-path" />
            Step-free route
          </span>
        </div>
      </Card>

      {selected ? (
        <Card className="selected-table-panel">
          <div className="table-summary">
            <span className="table-number">{selected.displayNumber}</span>
            <div>
              <Badge tone={selected.availabilityState === "held" ? "gold" : "success"}>
                {selected.availabilityState === "held" ? "Held for you" : "Available"}
              </Badge>
              <h2>
                Table {selected.displayNumber} · {zone.name}
              </h2>
              <p>{selected.customerDescription}</p>
              {joinedTables.length > 1 && preset.joinedTableIds.includes(selected.id) ? (
                <Badge tone="teal">
                  Joined group · {joinedCapacity} combined capacity · individually selectable
                </Badge>
              ) : null}
            </div>
          </div>
          <div className="attribute-grid">
            <span>
              <Users size={17} />
              {selected.minimumCapacity}–{selected.maximumCapacity} people
            </span>
            <span>
              <Accessibility size={17} />
              {selected.accessibility ? "Step-free" : "Standard access"}
            </span>
            <span>
              <Eye size={17} />
              {selected.nearbyScreenIds.length
                ? `${selected.nearbyScreenIds.length} suitable screen sightline`
                : "No claimed sightline"}
            </span>
            <span>
              <Volume2 size={17} />
              {selected.noiseLevel} atmosphere
            </span>
            <span>
              <Check size={17} />
              {selected.tableType ?? "standard"} table
            </span>
            <span>
              <MapPin size={17} />
              {selected.nearAmenities ? "Near amenities" : "Within selected zone"}
            </span>
          </div>
          {activeFilters.length ? (
            <p className="match-explanation">
              <strong>Why it matches:</strong>{" "}
              {tableMatchReasons(selected, activeFilters).join(", ") ||
                "This table does not match every active filter."}
            </p>
          ) : null}
          <Button full onClick={() => navigate("/visit")}>
            Use Table {selected.displayNumber}
          </Button>
        </Card>
      ) : (
        <Card>
          <p>No table matches this zone and preset. Try another zone or ask a person for help.</p>
        </Card>
      )}

      <section aria-labelledby="table-list-heading">
        <SectionHeading title="Accessible table list" />
        <div className="table-list" id="table-list-heading">
          {zoneTables.map((table) => (
            <button
              key={table.id}
              type="button"
              className={`${table.id === state.selectedTableId ? "active" : ""} ${activeFilters.length && !isMatch(table) ? "receded" : ""}`}
              onClick={() => state.selectTable(table.id)}
            >
              <span>
                <strong>
                  Table {table.displayNumber} · {table.tableType}
                </strong>
                <small>{table.customerDescription}</small>
                {joinedTables.length > 1 && preset.joinedTableIds.includes(table.id) ? (
                  <small>Joined group · combined capacity {joinedCapacity}</small>
                ) : null}
              </span>
              <Badge tone={isMatch(table) ? "success" : "neutral"}>
                {isMatch(table) ? "match" : "other"}
              </Badge>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
