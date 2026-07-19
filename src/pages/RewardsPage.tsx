import {
  Bell,
  CheckCircle2,
  Gift,
  Info,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  Ticket,
  Trophy,
} from "lucide-react";
import { Badge, Button, Card, PageIntro, SectionHeading } from "../components/ui";
import { demoRepository } from "../services/demoRepository";
import { useDemoStore } from "../state/demoStore";

export function RewardsPage() {
  const state = useDemoStore();
  const persona = demoRepository.getPersona(state.personaId);
  const venue = demoRepository.getVenue(state.venueId);
  const nextTier = persona.tier.includes("Gold") ? 4000 : 2500;
  const progress = Math.min(100, Math.round((persona.points / nextTier) * 100));
  const inVenue = state.stage === "in-venue" || state.bookingState === "checked-in";
  return (
    <div className="page-stack">
      <PageIntro eyebrow="Membership · customer controlled" title="More value around the visit">
        Benefits, reminders and receipts support the night without using gaming expenditure or
        protected service data.
      </PageIntro>
      <Card className="member-card">
        <div className="member-card-top">
          <span className="member-brand">
            <Sparkles size={18} />
            Star Local
          </span>
          <Badge tone="gold">{persona.tier}</Badge>
        </div>
        <div className="member-card-body">
          <div>
            <small>Demo member</small>
            <strong>{persona.fullName}</strong>
            <span>{persona.memberId}</span>
          </div>
          <div className="demo-code" aria-label="Decorative pattern, not a scannable credential">
            {Array.from({ length: 36 }, (_, index) => (
              <i key={index} className={(index * 7 + 3) % 5 < 2 ? "dark" : ""} />
            ))}
          </div>
        </div>
        <div className="member-card-bottom">
          <span>DEMO ONLY · NOT A CREDENTIAL</span>
          <span>Valid nowhere</span>
        </div>
      </Card>
      <Card className="tier-card">
        <div className="tier-heading">
          <span>
            <Trophy size={21} />
          </span>
          <div>
            <p className="eyebrow">Tier progress</p>
            <h2>{persona.points.toLocaleString()} points</h2>
          </div>
          <strong>{progress}%</strong>
        </div>
        <div
          className="tier-progress"
          role="progressbar"
          aria-label="Tier progress"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <span style={{ width: `${progress}%` }} />
        </div>
        <p>
          {Math.max(0, nextTier - persona.points).toLocaleString()} points to the next fictional
          tier.
        </p>
      </Card>
      <section className="rewards-balance" aria-label="Rewards summary">
        <Card>
          <span className="reward-icon">
            <Ticket size={20} />
          </span>
          <small>Draw entries</small>
          <strong>{state.drawEntries}</strong>
          <span>{inVenue ? "In-venue presence active" : "Presence inactive"}</span>
        </Card>
        <Card>
          <span className="reward-icon">
            <Bell size={20} />
          </span>
          <small>Draw countdown</small>
          <strong>{state.drawCountdown} min</strong>
          <span>{venue.event.time}</span>
        </Card>
      </section>
      <Card className={`draw-card draw-result-${state.fictionalDrawResult}`}>
        <div className="draw-top">
          <span>
            <Gift size={23} />
          </span>
          <Badge tone="gold">Fictional member draw</Badge>
        </div>
        <h2>{venue.event.title}</h2>
        <p className="draw-value">
          $1,500 <small>fictional prize value</small>
        </p>
        {state.fictionalDrawResult === "selected" ? (
          <div className="points-burst" aria-live="polite">
            <Sparkles size={22} />
            <strong>Demo result: selected</strong>
            <small>A real draw would require verified terms and identity.</small>
          </div>
        ) : state.fictionalDrawResult === "not-selected" ? (
          <p className="draw-outcome">Demo result: not selected tonight.</p>
        ) : (
          <p className="draw-outcome">Draw result pending · presenter controlled</p>
        )}
        <p className="microcopy">
          <Info size={14} />
          Entries are fabricated and never linked to gaming expenditure.
        </p>
      </Card>
      <section>
        <SectionHeading title="Wallet and recent activity" />
        <div className="voucher-list">
          <Card>
            <Badge tone="gold">Voucher wallet</Badge>
            <h3>$5 bistro welcome</h3>
            <p>Saved for a qualifying main meal in this visit.</p>
            <Button
              variant="secondary"
              onClick={() => state.setNotice("Voucher saved to the visit")}
            >
              Save to visit
            </Button>
          </Card>
          <Card>
            <Badge tone="teal">Recent points</Badge>
            <h3>+120 visit points</h3>
            <p>Fictional hospitality activity · Thursday dinner</p>
            <small>20 July · Demo receipt</small>
          </Card>
          <Card>
            <span className="reward-icon">
              <ReceiptText size={19} />
            </span>
            <h3>Thursday visit receipt</h3>
            <p>Food, drink and voucher summary available after the visit.</p>
            <Button variant="secondary" onClick={() => state.setStage("after-visit")}>
              View post-visit mode
            </Button>
          </Card>
        </div>
      </section>
      <Card>
        <SectionHeading title={`Benefits at ${venue.shortName}`} />
        <ul className="benefit-list">
          <li>
            <CheckCircle2 size={16} />
            Favourite-venue reminders
          </li>
          <li>
            <CheckCircle2 size={16} />
            Saved {venue.event.title} reminder
          </li>
          <li>
            <CheckCircle2 size={16} />
            {venue.services.courtesyBus
              ? "Courtesy-bus request benefit"
              : "Safe-travel staff assistance"}
          </li>
          <li>
            <CheckCircle2 size={16} />
            Customer-controlled food offers
          </li>
        </ul>
      </Card>
      <Card>
        <div className="privacy-heading">
          <ShieldCheck size={22} />
          <div>
            <h2>Protected boundary</h2>
            <p>
              Benefits never use gaming activity, RSA decisions, exclusions, security incidents or
              staff safety reports.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
