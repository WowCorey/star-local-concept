import { CheckCircle2, PackageCheck, ShoppingBag, UserCheck } from "lucide-react";
import { Badge, Button, Card, SectionHeading } from "../../components/ui";
import { demoRepository } from "../../services/demoRepository";
import { useDemoStore } from "../../state/demoStore";

export function BottleShopCollection() {
  const state = useDemoStore();
  const venue = demoRepository.getVenue(state.venueId);
  const items = demoRepository.getBottleShop(state.venueId);
  const selected = items.find((item) => item.id === state.bottleShopCollection.itemId);

  if (!venue.services.bottleShopPickup) {
    return (
      <Card>
        <div className="empty-state">
          <ShoppingBag size={28} />
          <h2>Collection is not offered here</h2>
          <p>This venue keeps the visit focused on bistro dining and courtesy transport.</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="order-section-stack">
      <Card className="collection-hero">
        <span>
          <ShoppingBag size={28} />
        </span>
        <div>
          <p className="eyebrow">Customer-initiated collection</p>
          <h2>Bottle-shop pickup</h2>
          <p>
            Reserve a small synthetic range, choose a window and collect from the labelled counter.
          </p>
        </div>
      </Card>

      {selected ? (
        <Card className="collection-status">
          <SectionHeading
            title={selected.name}
            action={
              <Badge tone="teal">{state.bottleShopCollection.state.replaceAll("-", " ")}</Badge>
            }
          />
          <label className="field">
            <span>Pickup window</span>
            <select
              value={state.bottleShopCollection.pickupWindow}
              disabled={["preparing", "ready", "collected"].includes(
                state.bottleShopCollection.state,
              )}
              onChange={(event) =>
                useDemoStore.setState({
                  bottleShopCollection: {
                    ...state.bottleShopCollection,
                    pickupWindow: event.target.value,
                  },
                })
              }
            >
              <option>6:00 pm - 6:30 pm</option>
              <option>7:30 pm - 8:00 pm</option>
              <option>Tomorrow 10:00 am - 10:30 am</option>
            </select>
          </label>
          <div className="info-strip">
            <UserCheck size={19} />
            <span>
              Age and supply remain subject to staff confirmation at the collection counter.
            </span>
          </div>
          {state.bottleShopCollection.token ? (
            <div className="collection-token">
              <PackageCheck size={23} />
              <span>
                <small>Collection token</small>
                <strong>{state.bottleShopCollection.token}</strong>
              </span>
            </div>
          ) : null}
          {state.bottleShopCollection.state === "collected" ? (
            <div className="success-panel">
              <CheckCircle2 size={21} />
              <span>
                <strong>Collected</strong>
                <small>Customer-initiated flow complete.</small>
              </span>
            </div>
          ) : state.bottleShopCollection.state === "not-started" ? (
            <Button full onClick={state.reserveBottleShopItem}>
              Reserve item
            </Button>
          ) : state.bottleShopCollection.state === "reserved" ? (
            <Button variant="ghost" full onClick={state.cancelBottleShopCollection}>
              Cancel collection reservation
            </Button>
          ) : (
            <div className="info-strip" aria-live="polite">
              <PackageCheck size={19} />
              <span>
                Venue staff controls preparation, ready and collection confirmation. You can view
                progress here.
              </span>
            </div>
          )}
        </Card>
      ) : null}

      <section>
        <SectionHeading title="Previous and available items" />
        <div className="collection-grid">
          {items.map((item) => (
            <Card key={item.id} className={selected?.id === item.id ? "selected" : ""} as="article">
              <Badge tone={item.stock === "low-stock" ? "warning" : "success"}>
                {item.stock.replaceAll("-", " ")}
              </Badge>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <strong>${item.memberPrice.toFixed(2)} member price</strong>
              <Button
                variant="secondary"
                full
                disabled={["preparing", "ready", "collected"].includes(
                  state.bottleShopCollection.state,
                )}
                onClick={() => state.setBottleShopItem(item.id)}
              >
                Select
              </Button>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
