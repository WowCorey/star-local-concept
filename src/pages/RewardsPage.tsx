import { Gift, Info, ShieldCheck, Sparkles, Ticket, Trophy } from "lucide-react";
import { Badge, Button, Card, DemoDataLabel, PageIntro, SectionHeading } from "../components/ui";
import { demoRepository } from "../services/demoRepository";
import { useDemoStore } from "../state/demoStore";

export function RewardsPage() {
  const personaId = useDemoStore((state) => state.personaId);
  const venueId = useDemoStore((state) => state.venueId);
  const drawEntries = useDemoStore((state) => state.drawEntries);
  const setNotice = useDemoStore((state) => state.setNotice);
  const persona = demoRepository.getPersona(personaId);
  const venue = demoRepository.getVenue(venueId);

  return (
    <div className="page-stack">
      <PageIntro eyebrow="Membership · Demo data" title="A little more from your local">
        Points and benefits support the visit, while customer control and clear terms stay close at
        hand.
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
            <small>Synthetic member</small>
            <strong>{persona.fullName}</strong>
            <span>{persona.memberId}</span>
          </div>
          <div className="demo-code" aria-label="Decorative demo code, not a scannable credential">
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

      <section className="rewards-balance" aria-label="Synthetic rewards balance">
        <Card>
          <span className="reward-icon">
            <Trophy size={20} />
          </span>
          <small>Points</small>
          <strong>{persona.points.toLocaleString()}</strong>
          <DemoDataLabel />
        </Card>
        <Card>
          <span className="reward-icon">
            <Ticket size={20} />
          </span>
          <small>Draw entries</small>
          <strong>{drawEntries}</strong>
          <DemoDataLabel />
        </Card>
      </section>

      <Card className="draw-card">
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
        <div className="draw-details">
          <span>
            <strong>{venue.event.time}</strong>
            <small>Draw time</small>
          </span>
          <span>
            <strong>{drawEntries}</strong>
            <small>Your demo entries</small>
          </span>
        </div>
        <p className="microcopy">
          <Info size={14} /> Entries in this concept are fabricated and are not linked to gambling
          expenditure.
        </p>
      </Card>

      <section>
        <SectionHeading title="Vouchers and benefits" />
        <div className="voucher-list">
          <Card>
            <Badge tone="gold">Demo voucher</Badge>
            <h3>$5 bistro welcome</h3>
            <p>Use on a qualifying fictional main meal before the end of this demo service.</p>
            <Button
              variant="secondary"
              onClick={() => setNotice("Demo voucher saved - no live balance changed")}
            >
              Save to visit
            </Button>
          </Card>
          <Card>
            <Badge tone="teal">Member benefit</Badge>
            <h3>Courtesy-bus priority request</h3>
            <p>Requests an accessible time window; capacity always needs human confirmation.</p>
            <Button
              variant="secondary"
              onClick={() => setNotice("Benefit opened in the synthetic journey")}
            >
              View details
            </Button>
          </Card>
        </div>
      </section>

      <Card>
        <div className="privacy-heading">
          <ShieldCheck size={22} />
          <div>
            <h2>Clear boundaries</h2>
            <p>Rewards personalise hospitality only from information you permit.</p>
          </div>
        </div>
        <ul className="privacy-list">
          <li>No gaming activity</li>
          <li>No personalised gambling offer</li>
          <li>No real loyalty balance</li>
          <li>No payment capability</li>
        </ul>
        <div className="inline-actions">
          <Button variant="ghost" onClick={() => setNotice("Demo membership terms opened")}>
            Membership terms
          </Button>
          <Button variant="ghost" onClick={() => setNotice("Demo draw terms opened")}>
            Draw terms
          </Button>
        </div>
      </Card>
    </div>
  );
}
