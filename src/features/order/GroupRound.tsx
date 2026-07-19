import { CheckCircle2, Droplets, UserCheck, UsersRound, Utensils } from "lucide-react";
import { Badge, Button, Card, SectionHeading } from "../../components/ui";
import { demoRepository } from "../../services/demoRepository";
import { useDemoStore } from "../../state/demoStore";
import type { ParticipantAcceptance } from "../../types/domain";

export function GroupRoundOrder() {
  const state = useDemoStore();
  const drinks = demoRepository.getDrinks(state.venueId);
  const available = drinks.filter((item) => item.stock !== "sold-out");
  const statusOptions: Array<[ParticipantAcceptance, string]> = [
    ["accepted", "Accept"],
    ["declined", "Decline"],
    ["staff-order", "Staff order"],
    ["age-check", "Age check"],
    ["delivered", "Delivered"],
  ];

  return (
    <div className="order-section-stack">
      <Card className="round-hero">
        <span>
          <UsersRound size={28} />
        </span>
        <div>
          <p className="eyebrow">Identified participants</p>
          <h2>Order a round</h2>
          <p>
            Every age-restricted item is assigned to an adult who can accept it. Nothing is
            anonymously assigned to “the table”.
          </p>
        </div>
      </Card>
      <div className="participant-list">
        {state.groupRound.participants.map((participant) => {
          const item = drinks.find((drink) => drink.id === participant.itemId);
          return (
            <Card key={participant.id} className="participant-card" as="article">
              <div className="participant-heading">
                <span className="mini-avatar">{participant.name[0]}</span>
                <div>
                  <h3>{participant.name}</h3>
                  <Badge
                    tone={
                      participant.acceptance === "accepted" ||
                      participant.acceptance === "delivered"
                        ? "success"
                        : participant.acceptance === "declined" ||
                            participant.acceptance === "age-check"
                          ? "warning"
                          : "neutral"
                    }
                  >
                    {participant.acceptance.replaceAll("-", " ")}
                  </Badge>
                </div>
              </div>
              <label className="field">
                <span>Item for {participant.name}</span>
                <select
                  value={participant.itemId ?? ""}
                  onChange={(event) =>
                    state.assignRoundItem(participant.id, event.target.value || null)
                  }
                >
                  <option value="">Choose an item</option>
                  {available.map((drink) => (
                    <option key={drink.id} value={drink.id}>
                      {drink.name}
                      {drink.zeroAlcohol ? " · zero alcohol" : " · staff review"}
                    </option>
                  ))}
                </select>
              </label>
              {item ? (
                <p className="participant-item">
                  <strong>{item.name}</strong>
                  <small>
                    {item.requiresStaffReview
                      ? "Staff confirmation required"
                      : "No alcohol supply review"}
                  </small>
                </p>
              ) : null}
              <div className="acceptance-actions">
                {statusOptions.map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={participant.acceptance === id}
                    onClick={() => state.setParticipantAcceptance(participant.id, id)}
                  >
                    {id === "accepted" ? <UserCheck size={14} /> : null}
                    {label}
                  </button>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
      <Card>
        <SectionHeading title="Round actions" />
        <div className="round-actions">
          <Button variant="teal" onClick={state.addWaterForEveryone}>
            <Droplets size={17} />
            Add water for everyone
          </Button>
          <Button variant="secondary" onClick={() => state.setServiceOpen(true)}>
            Ask staff
          </Button>
          <Button
            variant="secondary"
            onClick={() => state.setNotice("Food menu opened for the group")}
          >
            <Utensils size={17} />
            Add food
          </Button>
        </div>
        <div className="info-strip">
          <CheckCircle2 size={19} />
          <span>
            {
              state.groupRound.participants.filter(
                (participant) => participant.acceptance === "accepted",
              ).length
            }{" "}
            accepted ·{" "}
            {
              state.groupRound.participants.filter(
                (participant) => participant.acceptance === "pending",
              ).length
            }{" "}
            pending ·{" "}
            {
              state.groupRound.participants.filter(
                (participant) => participant.acceptance === "age-check",
              ).length
            }{" "}
            needs age confirmation
          </span>
        </div>
      </Card>
    </div>
  );
}
