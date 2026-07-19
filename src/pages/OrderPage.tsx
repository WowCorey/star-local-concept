import { useLocation } from "react-router-dom";
import { OrderNav } from "../components/OrderNav";
import { PageIntro } from "../components/ui";
import { BottleShopCollection } from "../features/order/BottleShopCollection";
import { DrinksOrder } from "../features/order/DrinksOrder";
import { FoodOrder } from "../features/order/FoodOrder";
import { GroupRoundOrder } from "../features/order/GroupRound";
import { OrderStatus } from "../features/order/OrderStatus";
import { demoRepository } from "../services/demoRepository";
import { useDemoStore } from "../state/demoStore";

export function OrderPage() {
  const location = useLocation();
  const venueId = useDemoStore((state) => state.venueId);
  const venue = demoRepository.getVenue(venueId);
  const section = location.pathname.split("/").at(-1);
  const content =
    section === "drinks" ? (
      <DrinksOrder />
    ) : section === "group" ? (
      <GroupRoundOrder />
    ) : section === "status" ? (
      <OrderStatus />
    ) : section === "collection" ? (
      <BottleShopCollection />
    ) : (
      <FoodOrder />
    );
  return (
    <div className="page-stack">
      <OrderNav />
      <PageIntro
        eyebrow={`${venue.shortName} · Food, drinks and service`}
        title="Order for this table"
      >
        Venue-local products, identified participants and clear human review stay in one combined
        order.
      </PageIntro>
      {content}
    </div>
  );
}
