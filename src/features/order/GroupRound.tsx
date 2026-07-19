import { CheckCircle2, Droplets, UserCheck, UsersRound, Utensils } from "lucide-react";
import { Badge, Button, Card, SectionHeading } from "../../components/ui";
import { demoRepository } from "../../services/demoRepository";
import { useDemoStore } from "../../state/demoStore";

export function GroupRoundOrder() {
  const state = useDemoStore();
  const drinks = demoRepository.getDrinks(state.venueId);
  const available = drinks.filter((item) => item.stock !== "sold-out");
  const currentParticipantId = `round-${state.personaId}`;

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
              {participant.id === currentParticipantId ? (
                <div className="acceptance-actions" aria-label="Respond to your assigned item">
                  <button
                    type="button"
                    aria-pressed={participant.acceptance === "accepted"}
                    onClick={() => state.respondToOwnRoundItem("accepted")}
                  >
                    <UserCheck size={14} />
                    Accept my item
                  </button>
                  <button
                    type="button"
                    aria-pressed={participant.acceptance === "declined"}
                    onClick={() => state.respondToOwnRoundItem("declined")}
                  >
                    Decline my item
                  </button>
                </div>
              ) : (
                <p className="participant-authority-note">
                  {participant.name} controls their response. Venue progress is
                  presenter-controlled.
                </p>
              )}
            </Card>
          );
        })}
      </div>
      {state.groupRound.addOns.length ? (
        <Card className="round-addons" aria-live="polite">
          <SectionHeading title="Round add-ons" />
          {state.groupRound.addOns.map((addOn) => (
            <div className="receipt-line" key={addOn.id}>
              <span>
                {addOn.quantity} × {addOn.name}
              </span>
              <strong>${(addOn.quantity * addOn.unitPrice).toFixed(2)}</strong>
            </div>
          ))}
        </Card>
      ) : null}
      <Card>
        <SectionHeading title="Round actions" />
        <div className="round-actions">
          <Button variant="teal" onClick={state.addWaterForEveryone}>
            <Droplets size={17} />
            Add water for everyone
          </Button>
          <Button variant="secondary" onClick={() => state.requestService("Speak to staff")}>
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
