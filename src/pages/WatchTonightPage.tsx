import {
  Bell,
  Captions,
  Headphones,
  LockKeyhole,
  MapPin,
  Pause,
  Play,
  Radio,
  Vote,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Badge, Button, Card, PageIntro, SectionHeading } from "../components/ui";
import { VisitNav } from "../components/VisitNav";
import { getNearbyScreenSchedules } from "../features/v02/model";
import { demoRepository } from "../services/demoRepository";
import { useDemoStore } from "../state/demoStore";

export function WatchTonightPage() {
  const navigate = useNavigate();
  const state = useDemoStore();
  const venue = demoRepository.getVenue(state.venueId);
  const zone = venue.zones.find((item) => item.id === state.selectedZoneId);
  const layout = demoRepository.getLayout(state.venueId);
  const table = layout.tables.find((item) => item.id === state.selectedTableId);
  const schedules = demoRepository.getScreenSchedules(state.venueId);
  const nearby = getNearbyScreenSchedules(state.venueId, state.selectedTableId);
  const visibleSchedules = schedules.filter(
    (schedule) =>
      schedule.zoneId === state.selectedZoneId || nearby.some((item) => item.id === schedule.id),
  );
  const activeScreen = venue.screens.find((screen) => screen.id === state.phoneAudioScreenId);

  return (
    <div className="page-stack">
      <VisitNav />
      <PageIntro eyebrow={`${venue.shortName} · ${zone?.name ?? "Tonight"}`} title="Watch Tonight">
        Live schedules, screen rules and requests are filtered to your zone and Table{" "}
        {table?.displayNumber ?? "—"} sightlines.
      </PageIntro>

      <Card className="watch-hero">
        <div className="watch-live-mark">
          <Radio size={22} />
          <span>LIVE</span>
        </div>
        <div>
          <p className="eyebrow">Tonight at this venue</p>
          <h2>{venue.event.title}</h2>
          <p>{venue.event.detail}</p>
        </div>
        <Badge tone="gold">{venue.event.time}</Badge>
      </Card>

      <section>
        <SectionHeading
          title="Near your table"
          action={<Link to="/visit/floor-plan">Change table</Link>}
        />
        {visibleSchedules.length ? (
          <div className="screen-list">
            {visibleSchedules.map((schedule) => {
              const screen = venue.screens.find((item) => item.id === schedule.screenId)!;
              const quality = schedule.viewQualityByTable[state.selectedTableId] ?? "zone only";
              const requested = state.screenRequestScreenId === screen.id;
              return (
                <Card
                  key={schedule.id}
                  className={`screen-control-card screen-${screen.screenClass}`}
                  as="article"
                >
                  <div className="screen-preview" aria-hidden="true">
                    <span>{screen.name}</span>
                    <i />
                  </div>
                  <div className="screen-control-heading">
                    <div>
                      <Badge
                        tone={
                          screen.screenClass === "locked"
                            ? "warning"
                            : screen.screenClass === "scheduled"
                              ? "gold"
                              : "teal"
                        }
                      >
                        {screen.screenClass === "locked" ? <LockKeyhole size={12} /> : null}
                        {screen.screenClass}
                      </Badge>
                      <h3>{screen.name}</h3>
                    </div>
                    <span className="view-quality">
                      <MapPin size={14} />
                      {quality} view
                    </span>
                  </div>
                  <dl className="screen-schedule">
                    <div>
                      <dt>Live now</dt>
                      <dd>{schedule.currentContent}</dd>
                    </div>
                    <div>
                      <dt>Next</dt>
                      <dd>{schedule.nextContent}</dd>
                    </div>
                    <div>
                      <dt>Timing</dt>
                      <dd>{schedule.startsIn}</dd>
                    </div>
                  </dl>
                  <div className="screen-meta">
                    {screen.captionsAvailable ? (
                      <span>
                        <Captions size={15} />
                        Captions
                      </span>
                    ) : null}
                    <span>
                      <Vote size={15} />
                      {screen.nearbyRequests ?? 0} nearby requests
                    </span>
                  </div>
                  {screen.screenClass === "locked" ? (
                    <p className="locked-note">
                      Operational or contracted content cannot be changed.
                    </p>
                  ) : screen.screenClass === "scheduled" ? (
                    <div className="info-strip">
                      <LockKeyhole size={18} />
                      <span>Scheduled content can be followed, but not overridden.</span>
                    </div>
                  ) : (
                    <Button
                      variant={requested ? "teal" : "secondary"}
                      full
                      onClick={() =>
                        state.requestScreen(
                          screen.id,
                          schedule.requestOptions[0] ?? schedule.nextContent,
                        )
                      }
                    >
                      {requested
                        ? "Request joined"
                        : `Request ${schedule.requestOptions[0] ?? "this screen"}`}
                    </Button>
                  )}
                  <div className="screen-actions">
                    {screen.audioAvailable && screen.screenClass !== "locked" ? (
                      <button
                        type="button"
                        onClick={() => state.setPhoneAudioState("active", screen.id)}
                      >
                        <Headphones size={16} />
                        Listen on phone
                      </button>
                    ) : null}
                    <button type="button" onClick={() => state.setWatchReminder(true)}>
                      <Bell size={16} />
                      Notify me
                    </button>
                    <button type="button" onClick={() => navigate("/visit/floor-plan")}>
                      <MapPin size={16} />
                      Better table
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <p>
              No suitable screen is visible from this table. Choose a screen-view table rather than
              showing an impossible recommendation.
            </p>
            <Button variant="secondary" onClick={() => navigate("/visit/floor-plan")}>
              Find a better sightline
            </Button>
          </Card>
        )}
      </section>

      <Card className="phone-audio-card">
        <SectionHeading
          title="Phone audio"
          action={
            <Badge tone={state.phoneAudioState === "active" ? "success" : "neutral"}>
              {state.phoneAudioState}
            </Badge>
          }
        />
        {activeScreen && state.phoneAudioState !== "unavailable" ? (
          <>
            <div className="audio-now">
              <span>
                <Headphones size={22} />
              </span>
              <div>
                <strong>Listening to {activeScreen.name}</strong>
                <small>{activeScreen.nextContent ?? activeScreen.currentContent}</small>
              </div>
            </div>
            <div
              className={`audio-wave ${state.phoneAudioState === "active" ? "playing" : ""}`}
              aria-hidden="true"
            >
              {Array.from({ length: 20 }, (_, index) => (
                <i key={index} />
              ))}
            </div>
            <div className="audio-controls">
              <Button
                aria-label={
                  state.phoneAudioState === "active" ? "Pause phone audio" : "Play phone audio"
                }
                onClick={() =>
                  state.setPhoneAudioState(
                    state.phoneAudioState === "active" ? "paused" : "active",
                    activeScreen.id,
                  )
                }
              >
                {state.phoneAudioState === "active" ? <Pause size={18} /> : <Play size={18} />}
                {state.phoneAudioState === "active" ? "Pause" : "Play"}
              </Button>
              <label>
                <span>Volume {state.phoneAudioVolume}%</span>
                <input
                  aria-label="Phone audio volume"
                  type="range"
                  min="0"
                  max="100"
                  value={state.phoneAudioVolume}
                  onChange={(event) => state.setPhoneAudioVolume(Number(event.target.value))}
                />
              </label>
            </div>
            <p className="microcopy">
              Venue-only, low-latency simulation. No copyrighted broadcast audio plays.
            </p>
          </>
        ) : (
          <div className="empty-state compact">
            <Headphones size={26} />
            <h3>Choose an available screen</h3>
            <p>Audio is unavailable outside the venue and for locked content.</p>
          </div>
        )}
      </Card>
    </div>
  );
}
