import { NavLink } from "react-router-dom";

const items = [
  ["/order/food", "Food"],
  ["/order/drinks", "Drinks"],
  ["/order/group", "Group round"],
  ["/order/status", "My order"],
  ["/order/collection", "Collection"],
] as const;

export function OrderNav() {
  return (
    <nav className="subnav order-subnav" aria-label="Order sections">
      {items.map(([to, label]) => (
        <NavLink key={to} to={to}>
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
