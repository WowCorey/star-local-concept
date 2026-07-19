import { NavLink } from "react-router-dom";

const items = [
  ["/visit", "Plan"],
  ["/visit/zones", "Zones"],
  ["/visit/floor-plan", "Tables"],
  ["/visit/watch", "Watch Tonight"],
] as const;

export function VisitNav() {
  return (
    <nav className="subnav" aria-label="Visit sections">
      {items.map(([to, label]) => (
        <NavLink key={to} to={to} end={to === "/visit"}>
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
