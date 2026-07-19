import { useState } from "react";
import {
  AlertTriangle,
  Beer,
  CheckCircle2,
  Clock3,
  Droplets,
  ShieldCheck,
  Wine,
} from "lucide-react";
import { Badge, Button, Card, SectionHeading } from "../../components/ui";
import { demoRepository } from "../../services/demoRepository";
import { useDemoStore } from "../../state/demoStore";
import type { DrinkItem } from "../../types/domain";

export function DrinksOrder() {
  const state = useDemoStore();
  const [category, setCategory] = useState("All");
  const [active, setActive] = useState<DrinkItem | null>(null);
  const drinks = demoRepository.getDrinks(state.venueId);
  const categories = ["All", ...new Set(drinks.map((item) => item.category))];
  const filtered =
    category === "All" ? drinks : drinks.filter((item) => item.category === category);
  const selected = drinks.find((item) => item.id === state.drinkOrder.itemId);
  const persona = demoRepository.getPersona(state.personaId);

  return (
    <div className="order-section-stack">
      <div className="rsa-boundary">
        <ShieldCheck size={22} />
        <div>
          <strong>Supply remains a human decision</strong>
          <p>The app never estimates BAC, labels intoxication or overrides venue staff.</p>
        </div>
      </div>
      <SectionHeading
        title="Drinks"
        action={<Badge tone="teal">Bar estimate {state.barWaitTime} min</Badge>}
      />
      <div className="category-tabs" role="group" aria-label="Drink categories">
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
      <div className="drink-grid">
        {filtered.map((item) => (
          <Card key={item.id} className={`drink-card stock-${item.stock}`} as="article">
            <button
              type="button"
              onClick={() => setActive(item)}
              disabled={item.stock === "sold-out"}
              aria-label={`Review ${item.name}`}
            >
              <span
                className={`drink-art category-${item.category.toLowerCase().replaceAll(" ", "-")}`}
              >
                {item.zeroAlcohol ? (
                  <Droplets size={24} />
                ) : item.category === "Wine" ? (
                  <Wine size={24} />
                ) : (
                  <Beer size={24} />
                )}
              </span>
              <span>
                <span className="drink-title">
                  <strong>{item.name}</strong>
                  <b>from ${item.sizes[0]?.price.toFixed(2)}</b>
                </span>
                <small>{item.description}</small>
                <span className="venue-tags">
                  <Badge tone={item.stock === "low-stock" ? "warning" : "success"}>
                    {item.stock.replaceAll("-", " ")}
                  </Badge>
                  {item.tags.map((tag) => (
                    <Badge key={tag}>{tag}</Badge>
                  ))}
                </span>
              </span>
            </button>
          </Card>
        ))}
      </div>

      {active ? (
        <Card className="drink-builder">
          <Badge tone={active.zeroAlcohol ? "teal" : "warning"}>
            {active.zeroAlcohol ? "Zero-alcohol option" : "Staff confirmation required"}
          </Badge>
          <h2>{active.name}</h2>
          <p>{active.description}</p>
          <div className="size-grid">
            {active.sizes.map((size) => (
              <button
                type="button"
                key={size.label}
                className={
                  state.drinkOrder.itemId === active.id && state.drinkOrder.size === size.label
                    ? "active"
                    : ""
                }
                onClick={() => state.chooseDrink(active.id, size.label)}
              >
                <strong>{size.label}</strong>
                <span>${size.price.toFixed(2)}</span>
              </button>
            ))}
          </div>
          <dl className="delivery-summary">
            <div>
              <dt>Deliver to</dt>
              <dd>
                Table{" "}
                {
                  demoRepository
                    .getLayout(state.venueId)
                    .tables.find((table) => table.id === state.selectedTableId)?.displayNumber
                }
              </dd>
            </div>
            <div>
              <dt>For</dt>
              <dd>{persona.fullName}</dd>
            </div>
            <div>
              <dt>Estimate</dt>
              <dd>{active.deliveryMinutes} minutes</dd>
            </div>
          </dl>
          <Button
            full
            disabled={state.drinkOrder.itemId !== active.id}
            onClick={() => {
              setActive(null);
              state.setNotice("Drink ready for final review");
            }}
          >
            Add to my order
          </Button>
        </Card>
      ) : null}

      {selected ? (
        <Card className="drink-review" aria-live="polite">
          <div className="order-summary-heading">
            <span>
              <Beer size={21} />
            </span>
            <div>
              <Badge
                tone={
                  state.drinkOrder.state === "declined"
                    ? "warning"
                    : ["accepted", "preparing", "delivered"].includes(state.drinkOrder.state)
                      ? "success"
                      : "gold"
                }
              >
                {state.drinkOrder.state.replaceAll("-", " ")}
              </Badge>
              <h2>
                {selected.name} · {state.drinkOrder.size}
              </h2>
            </div>
          </div>
          {state.drinkOrder.state === "draft" ? (
            <Button full onClick={state.submitDrinkForReview}>
              Submit for review
            </Button>
          ) : null}
          {state.drinkOrder.state === "submitted" ? (
            <div className="info-strip">
              <Clock3 size={20} />
              <span>Your drink request has been submitted to the Bar Team.</span>
            </div>
          ) : null}
          {state.drinkOrder.state === "staff-review" ? (
            <div className="warning-strip">
              <Clock3 size={20} />
              <span>
                <strong>Staff confirmation required.</strong> A team member will confirm supply at
                your table.
              </span>
            </div>
          ) : null}
          {state.drinkOrder.state === "accepted" ? (
            <div className="success-panel">
              <CheckCircle2 size={21} />
              <span>
                <strong>Accepted</strong>
                <small>The Bar Team can now prepare this item.</small>
              </span>
            </div>
          ) : null}
          {state.drinkOrder.state === "declined" ? (
            <>
              <div className="safety-strip">
                <AlertTriangle size={20} />
                <span>
                  <strong>This item cannot be supplied through the app.</strong> A team member can
                  discuss alternatives with you.
                </span>
              </div>
              <div className="alternative-grid">
                <button
                  type="button"
                  onClick={() => {
                    const alternative =
                      drinks.find((item) => item.category === "Water") ??
                      drinks.find((item) => item.zeroAlcohol);
                    if (alternative)
                      state.chooseDrink(alternative.id, alternative.sizes[0]?.label ?? "");
                  }}
                >
                  Water
                </button>
                <button
                  type="button"
                  onClick={() =>
                    state.chooseDrink(
                      drinks.find((item) => item.zeroAlcohol)?.id ?? "",
                      drinks.find((item) => item.zeroAlcohol)?.sizes[0]?.label ?? "",
                    )
                  }
                >
                  Zero-alcohol option
                </button>
                <button type="button" onClick={() => state.requestService("Speak to staff")}>
                  Speak to staff
                </button>
                <button type="button" onClick={() => state.requestService("Safe trip assistance")}>
                  Safe transport
                </button>
              </div>
            </>
          ) : null}
          {["draft", "submitted", "staff-review"].includes(state.drinkOrder.state) ? (
            <Button variant="ghost" full onClick={state.cancelDrinkRequest}>
              Cancel drink request
            </Button>
          ) : null}
        </Card>
      ) : null}
    </div>
  );
}
