import { Accessibility, ArrowRight, CloudSun, Utensils, UsersRound, Volume2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge, Button, Card, PageIntro } from "../components/ui";
import { VisitNav } from "../components/VisitNav";
import { demoRepository } from "../services/demoRepository";
import { useDemoStore } from "../state/demoStore";

export function ZoneSelectionPage() {
  const navigate = useNavigate();
  const state = useDemoStore();
  const venue = demoRepository.getVenue(state.venueId);
  const visibleZones = venue.zones.filter((zone) => zone.customerVisible && zone.slug);

  return (
    <div className="page-stack">
      <VisitNav />
      <PageIntro
        eyebrow={`${venue.shortName} · Choose the atmosphere`}
        title="What kind of night do you want?"
      >
        Pick a venue zone before choosing a table. Service, screens, products and tonight's plan
        change with it.
      </PageIntro>

      <div className="zone-card-grid" role="radiogroup" aria-label="Available venue zones">
        {visibleZones.map((zone) => {
          const selected = state.selectedZoneId === zone.id;
          return (
            <Card
              key={zone.id}
              className={`zone-card zone-${zone.slug} ${selected ? "selected" : ""}`}
              as="article"
            >
              <button
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => state.selectZone(zone.id)}
              >
                <div className="zone-visual" aria-hidden="true">
                  <span>{zone.name.slice(0, 1)}</span>
                  <i />
                  <i />
                  <i />
                </div>
                <div className="zone-card-heading">
                  <div>
                    <p className="eyebrow">{zone.atmosphere}</p>
                    <h2>{zone.name}</h2>
                  </div>
                  <Badge
                    tone={
                      zone.demand === "nearly-full"
                        ? "warning"
                        : zone.demand === "easy"
                          ? "success"
                          : "gold"
                    }
                  >
                    {zone.demand?.replaceAll("-", " ")}
                  </Badge>
                </div>
                <p>{zone.description}</p>
                <div className="zone-facts">
                  <span>
                    <UsersRound size={16} />
                    {zone.familySuitability}
                  </span>
                  <span>
                    <Volume2 size={16} />
                    {zone.noiseLevel} noise
                  </span>
                  <span>
                    <Utensils size={16} />
                    {zone.serviceModel?.food.replaceAll("-", " ")}
                  </span>
                  <span>
                    <Accessibility size={16} />
                    {zone.accessibilitySummary}
                  </span>
                  <span>
                    <CloudSun size={16} />
                    {zone.weatherExposure}
                  </span>
                </div>
                <div className="zone-event-line">
                  <strong>{zone.eventSummary}</strong>
                  <small>{zone.screenSummary}</small>
                </div>
                <div className="zone-card-footer">
                  <span>{zone.suitableTableCount} suitable tables</span>
                  <span>
                    {zone.drinksService === "bar"
                      ? "Order drinks at bar"
                      : "Drinks available at table"}
                  </span>
                </div>
              </button>
              {selected ? (
                <Button full onClick={() => navigate("/visit/floor-plan")}>
                  Choose a {zone.name} table <ArrowRight size={17} />
                </Button>
              ) : null}
            </Card>
          );
        })}
      </div>
      <p className="microcopy safety-inline">
        Age guidance and service remain subject to venue staff confirmation.
      </p>
    </div>
  );
}
