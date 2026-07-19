import { Check, Clock3, CreditCard, Utensils } from "lucide-react";
import { Badge, Button, Card, SectionHeading, StatusDot } from "../../components/ui";
import { demoRepository } from "../../services/demoRepository";
import { useDemoStore } from "../../state/demoStore";

export function OrderStatus() {
  const state = useDemoStore();
  const menu = demoRepository.getMenu(state.venueId);
  const drinks = demoRepository.getDrinks(state.venueId);
  const food = menu.find((item) => item.id === state.orderItemId);
  const drink = drinks.find((item) => item.id === state.drinkOrder.itemId);
  const drinkPrice = drink?.sizes.find((size) => size.label === state.drinkOrder.size)?.price ?? 0;
  const subtotal = (food?.price ?? 0) + drinkPrice;
  const saving = subtotal ? 5 : 0;
  const total = Math.max(0, subtotal - saving);
  const steps = [
    ["Order received", state.orderState !== "draft"],
    [
      "Kitchen preparing",
      ["submitted", "preparing", "ready", "delivered"].includes(state.orderState),
    ],
    ["Bar review", state.drinkOrder.state !== "draft"],
    [
      "Staff confirmation",
      !drink?.requiresStaffReview ||
        ["accepted", "preparing", "delivered"].includes(state.drinkOrder.state),
    ],
    ["Food ready", ["ready", "delivered"].includes(state.orderState)],
    ["Drinks delivered", state.drinkOrder.state === "delivered"],
    ["Order complete", state.orderState === "delivered" && state.drinkOrder.state === "delivered"],
  ] as const;
  return (
    <div className="order-section-stack">
      <Card className="combined-order">
        <SectionHeading
          title="My order"
          action={
            <Badge tone="teal">
              Table{" "}
              {
                demoRepository
                  .getLayout(state.venueId)
                  .tables.find((table) => table.id === state.selectedTableId)?.displayNumber
              }
            </Badge>
          }
        />
        {food ? (
          <div className="receipt-line">
            <span>
              {food.name}
              <small>
                {state.orderModifier === "usual" ? food.savedPreference : state.orderModifier}
              </small>
            </span>
            <strong>${food.price.toFixed(2)}</strong>
          </div>
        ) : (
          <p>No food added yet.</p>
        )}
        {drink ? (
          <div className="receipt-line">
            <span>
              {drink.name}
              <small>
                {state.drinkOrder.size} · for {demoRepository.getPersona(state.personaId).firstName}{" "}
                · {state.drinkOrder.state.replaceAll("-", " ")}
              </small>
            </span>
            <strong>${drinkPrice.toFixed(2)}</strong>
          </div>
        ) : (
          <p>No drink added yet.</p>
        )}
        <dl className="order-totals">
          <div>
            <dt>Subtotal</dt>
            <dd>${subtotal.toFixed(2)}</dd>
          </div>
          <div>
            <dt>Member voucher</dt>
            <dd>−${saving.toFixed(2)}</dd>
          </div>
          <div>
            <dt>Member saving</dt>
            <dd>${saving.toFixed(2)}</dd>
          </div>
          <div className="total">
            <dt>Total</dt>
            <dd>${total.toFixed(2)}</dd>
          </div>
        </dl>
      </Card>
      <Card>
        <SectionHeading title="Order progress" />
        <ol className="order-progress" aria-live="polite">
          {steps.map(([label, complete], index) => (
            <li key={label} className={complete ? "complete" : ""}>
              <StatusDot
                tone={
                  complete
                    ? "green"
                    : index === steps.findIndex(([, done]) => !done)
                      ? "amber"
                      : "muted"
                }
              />
              <span>{label}</span>
              {complete ? (
                <Check size={16} />
              ) : index === steps.findIndex(([, done]) => !done) ? (
                <Clock3 size={16} />
              ) : null}
            </li>
          ))}
        </ol>
      </Card>
      <Card>
        <SectionHeading title="Split choice" />
        <div className="payment-grid">
          {[
            ["mine", "Pay my items"],
            ["even", "Split evenly"],
            ["items", "Choose items"],
            ["staff", "Ask staff"],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={state.groupPayment === id ? "active" : ""}
              onClick={() => state.setGroupPayment(id as "mine" | "even" | "items" | "staff")}
            >
              <CreditCard size={18} />
              {label}
            </button>
          ))}
        </div>
        <p className="microcopy">Prototype interaction only. No payment or charge occurs.</p>
      </Card>
      <Button variant="secondary" full onClick={() => state.setServiceOpen(true)}>
        <Utensils size={17} />
        Report an order issue
      </Button>
    </div>
  );
}
