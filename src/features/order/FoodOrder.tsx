import { useState } from "react";
import { AlertTriangle, CheckCircle2, ChevronRight, Clock3, Utensils } from "lucide-react";
import { Badge, Button, Card, SectionHeading } from "../../components/ui";
import { demoRepository } from "../../services/demoRepository";
import { useDemoStore } from "../../state/demoStore";
import type { MenuItem } from "../../types/domain";

export function FoodOrder() {
  const [category, setCategory] = useState("All");
  const [activeItem, setActiveItem] = useState<MenuItem | null>(null);
  const [allergyLevel, setAllergyLevel] = useState<
    "preference" | "dietary" | "intolerance" | "allergy"
  >("preference");
  const state = useDemoStore();
  const menu = demoRepository.getMenu(state.venueId);
  const categories = ["All", ...new Set(menu.map((item) => item.category))];
  const filtered = category === "All" ? menu : menu.filter((item) => item.category === category);
  const chosen = menu.find((item) => item.id === state.orderItemId);
  const soldOut = (item: MenuItem) =>
    item.availability === "sold-out" || state.soldOutItemIds.includes(item.id);

  const choose = (modifier: "usual" | "standard" | "custom") => {
    if (!activeItem) return;
    state.chooseOrder(activeItem.id, modifier);
    setActiveItem(null);
  };

  return (
    <div className="order-section-stack">
      {state.kitchenWaitTime > 25 ? (
        <div className="warning-strip">
          <Clock3 size={20} />
          <span>
            <strong>Kitchen update:</strong> Current estimate is about {state.kitchenWaitTime}{" "}
            minutes.
          </span>
        </div>
      ) : null}
      <SectionHeading title="Food at this venue" />
      <div className="category-tabs" role="group" aria-label="Food categories">
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
      <section className="menu-list" aria-label="Food items">
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
                  {item.preparationMinutes ? <Badge>{item.preparationMinutes} min</Badge> : null}
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
              <span className="sparkle-mark" aria-hidden="true">
                ✦
              </span>
              <span>
                <strong>You usually choose</strong>
                <small>{activeItem.savedPreference}</small>
              </span>
            </div>
          ) : null}
          <div className="modifier-options">
            {activeItem.savedPreference ? (
              <button type="button" onClick={() => choose("usual")}>
                <strong>Use my usual</strong>
                <small>{activeItem.savedPreference}</small>
              </button>
            ) : null}
            <button type="button" onClick={() => choose("standard")}>
              <strong>Standard recipe</strong>
              <small>No saved changes applied</small>
            </button>
            <button type="button" onClick={() => choose("custom")}>
              <strong>Change order</strong>
              <small>Review custom modifiers</small>
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
                <strong>Venue staff must confirm this.</strong> The app cannot guarantee an item is
                allergen-free.
              </span>
            </div>
          ) : null}
          <Button variant="ghost" full onClick={() => setActiveItem(null)}>
            Close item
          </Button>
        </Card>
      ) : null}

      {chosen ? (
        <Card className="order-summary-card">
          <div className="order-summary-heading">
            <span>
              <CheckCircle2 size={21} />
            </span>
            <div>
              <Badge tone={state.orderState === "submitted" ? "success" : "warning"}>
                {state.orderState.replaceAll("-", " ")}
              </Badge>
              <h2>Your food order</h2>
            </div>
          </div>
          <div className="receipt-line">
            <span>
              {chosen.name}
              <small>
                {state.orderModifier === "usual"
                  ? chosen.savedPreference
                  : state.orderModifier === "standard"
                    ? "Standard recipe"
                    : "Custom changes · staff to review"}
              </small>
            </span>
            <strong>${chosen.price.toFixed(2)}</strong>
          </div>
          {state.orderState !== "submitted" ? (
            <Button full onClick={() => state.setOrderState("submitted")}>
              Confirm food order
            </Button>
          ) : (
            <div className="success-panel">
              <CheckCircle2 size={22} />
              <span>
                <strong>Order confirmed</strong>
                <small>Prototype interaction only.</small>
              </span>
            </div>
          )}
        </Card>
      ) : null}
    </div>
  );
}
