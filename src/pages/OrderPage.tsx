import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Clock3,
  CreditCard,
  ShieldCheck,
  UsersRound,
  Utensils,
} from "lucide-react";
import { Badge, Button, Card, DemoDataLabel, PageIntro, SectionHeading } from "../components/ui";
import { table23Group } from "../fixtures/group";
import { demoRepository } from "../services/demoRepository";
import { useDemoStore } from "../state/demoStore";
import type { MenuItem } from "../types/domain";

const paymentOptions = [
  { id: "mine" as const, label: "Pay my items" },
  { id: "even" as const, label: "Split evenly" },
  { id: "items" as const, label: "Choose items" },
  { id: "staff" as const, label: "Ask staff" },
];

export function OrderPage() {
  const [category, setCategory] = useState("All");
  const [activeItem, setActiveItem] = useState<MenuItem | null>(null);
  const [allergyLevel, setAllergyLevel] = useState<
    "preference" | "dietary" | "intolerance" | "allergy"
  >("preference");
  const state = useDemoStore();
  const venue = demoRepository.getVenue(state.venueId);
  const menu = demoRepository.getMenu(state.venueId);
  const categories = ["All", ...new Set(menu.map((item) => item.category))];
  const filtered = category === "All" ? menu : menu.filter((item) => item.category === category);
  const chosenItem = menu.find((item) => item.id === state.orderItemId);
  const soldOut = (item: MenuItem) =>
    item.availability === "sold-out" || state.soldOutItemIds.includes(item.id);
  const specials = menu.filter((item) => item.special);

  const chooseModifier = (modifier: "usual" | "standard" | "custom") => {
    if (!activeItem) return;
    state.chooseOrder(activeItem.id, modifier);
    setActiveItem(null);
  };

  return (
    <div className="page-stack">
      <PageIntro eyebrow={`${venue.shortName} · Demo menu`} title="Dinner, on your terms">
        Browse venue-local fixtures, review every change and keep staff confirmation visible for
        allergies and controlled drink states.
      </PageIntro>

      {state.kitchenWaitTime > 25 ? (
        <div className="warning-strip">
          <Clock3 size={20} />
          <span>
            <strong>Kitchen update:</strong> Current synthetic wait is about {state.kitchenWaitTime}{" "}
            minutes. You can still ask a team member.
          </span>
        </div>
      ) : null}

      <section aria-labelledby="specials-heading">
        <SectionHeading title="Tonight's specials" />
        <div className="specials-strip" id="specials-heading">
          {specials.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveItem(item)}
              disabled={soldOut(item)}
            >
              <Badge
                tone={
                  soldOut(item) ? "neutral" : item.availability === "low-stock" ? "warning" : "gold"
                }
              >
                {soldOut(item) ? "Sold out" : item.special?.label}
              </Badge>
              <strong>{item.name}</strong>
              <span>${item.price.toFixed(2)} · Demo price</span>
              <small>{item.special?.expires}</small>
            </button>
          ))}
        </div>
      </section>

      <div className="category-tabs" role="group" aria-label="Menu categories">
        {categories.map((item) => (
          <button
            type="button"
            key={item}
            className={category === item ? "active" : ""}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <section className="menu-list" aria-label="Menu items">
        {filtered.map((item) => (
          <Card
            key={item.id}
            className={`menu-card ${soldOut(item) ? "menu-card-sold-out" : ""}`}
            as="article"
          >
            <button
              type="button"
              onClick={() => setActiveItem(item)}
              disabled={soldOut(item)}
              aria-label={`Review ${item.name}`}
            >
              <span className="menu-icon">
                <Utensils size={20} />
              </span>
              <span className="menu-copy">
                <span className="menu-title-row">
                  <strong>{item.name}</strong>
                  <b>${item.price.toFixed(2)}</b>
                </span>
                <small>{item.description}</small>
                <span className="venue-tags">
                  {item.tags.map((tag) => (
                    <Badge key={tag} tone={tag.includes("usual") ? "gold" : "neutral"}>
                      {tag}
                    </Badge>
                  ))}
                </span>
              </span>
              <ChevronRight size={18} />
            </button>
          </Card>
        ))}
      </section>

      {activeItem ? (
        <Card className="modifier-card">
          <Badge tone="gold">Review before adding</Badge>
          <h2>{activeItem.name}</h2>
          <p>{activeItem.description}</p>
          {activeItem.savedPreference ? (
            <div className="saved-choice">
              <SparkleMark />
              <span>
                <strong>You usually choose</strong>
                <small>{activeItem.savedPreference}</small>
              </span>
            </div>
          ) : null}
          <div className="modifier-options">
            {activeItem.savedPreference ? (
              <button type="button" onClick={() => chooseModifier("usual")}>
                <strong>Use my usual</strong>
                <small>{activeItem.savedPreference}</small>
              </button>
            ) : null}
            <button type="button" onClick={() => chooseModifier("standard")}>
              <strong>Standard recipe</strong>
              <small>No saved changes applied</small>
            </button>
            <button type="button" onClick={() => chooseModifier("custom")}>
              <strong>Change order</strong>
              <small>Record custom demo modifiers</small>
            </button>
          </div>
          <label className="field">
            <span>Food information type</span>
            <select
              value={allergyLevel}
              onChange={(event) => setAllergyLevel(event.target.value as typeof allergyLevel)}
            >
              <option value="preference">Preference</option>
              <option value="dietary">Dietary choice</option>
              <option value="intolerance">Intolerance</option>
              <option value="allergy">Allergy</option>
            </select>
          </label>
          {allergyLevel === "allergy" ? (
            <div className="safety-strip">
              <AlertTriangle size={20} />
              <span>
                <strong>This item requires confirmation from venue staff.</strong> The prototype
                cannot guarantee any item is allergen-free.
              </span>
            </div>
          ) : null}
          <Button variant="ghost" full onClick={() => setActiveItem(null)}>
            Close item
          </Button>
        </Card>
      ) : null}

      {chosenItem ? (
        <Card className="order-summary-card">
          <div className="order-summary-heading">
            <span>
              <CheckCircle2 size={21} />
            </span>
            <div>
              <Badge tone={state.orderState === "submitted" ? "success" : "warning"}>
                {state.orderState.replaceAll("-", " ")}
              </Badge>
              <h2>Your demo order</h2>
            </div>
          </div>
          <div className="receipt-line">
            <span>
              {chosenItem.name}
              <small>
                {state.orderModifier === "usual"
                  ? "Barbecue base · chips and salad · no dressing"
                  : state.orderModifier === "standard"
                    ? "Standard tomato base · chips and salad"
                    : "Custom changes · staff to review"}
              </small>
            </span>
            <strong>${chosenItem.price.toFixed(2)}</strong>
          </div>
          <div className="receipt-total">
            <span>Total</span>
            <strong>${chosenItem.price.toFixed(2)}</strong>
          </div>
          <DemoDataLabel />
          {state.orderState !== "submitted" ? (
            <Button full onClick={() => state.setOrderState("submitted")}>
              Confirm order
            </Button>
          ) : (
            <div className="success-panel">
              <CheckCircle2 size={22} />
              <span>
                <strong>Simulated order confirmed</strong>
                <small>No payment, POS or kitchen system was contacted.</small>
              </span>
            </div>
          )}
        </Card>
      ) : null}

      <Card>
        <SectionHeading title="Table 23 Group" action={<Badge tone="teal">Join code 4821</Badge>} />
        <p className="microcopy">Fabricated participants and local-only payment states.</p>
        <div className="group-list">
          {table23Group.map((member) => (
            <div key={member.id}>
              <span className="mini-avatar">{member.name.slice(0, 1)}</span>
              <span>
                <strong>{member.name}</strong>
                <small>
                  {member.amount ? `$${member.amount.toFixed(2)} demo amount` : "No items yet"}
                </small>
              </span>
              <Badge
                tone={
                  member.state === "Paid"
                    ? "success"
                    : member.state === "Choosing"
                      ? "warning"
                      : "neutral"
                }
              >
                {member.state}
              </Badge>
            </div>
          ))}
        </div>
        <div className="divider" />
        <h3>How would you split it?</h3>
        <div className="payment-grid">
          {paymentOptions.map((option) => (
            <button
              type="button"
              key={option.id}
              className={state.groupPayment === option.id ? "active" : ""}
              onClick={() => state.setGroupPayment(option.id)}
            >
              <CreditCard size={18} />
              {option.label}
            </button>
          ))}
        </div>
        {state.groupPayment ? (
          <p className="microcopy">
            <CheckCircle2 size={14} /> Saved for this demonstration. No one was charged.
          </p>
        ) : null}
      </Card>

      <Card>
        <SectionHeading title="Controlled drink prototype" />
        <div className="warning-strip">
          <ShieldCheck size={21} />
          <span>
            <strong>Staff confirmation required.</strong> A team member will confirm this simulated
            order at your table. The app does not assess intoxication or approve service.
          </span>
        </div>
        <Button
          variant="secondary"
          full
          onClick={() => state.requestService("Speak to staff about an order")}
        >
          <UsersRound size={18} />
          Ask a team member
        </Button>
      </Card>
    </div>
  );
}

function SparkleMark() {
  return (
    <span className="sparkle-mark" aria-hidden="true">
      ✦
    </span>
  );
}
