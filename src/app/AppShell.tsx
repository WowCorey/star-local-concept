import { useEffect } from "react";
import {
  Bot,
  CalendarDays,
  CarFront,
  Gift,
  Home,
  Sparkles,
  UserRound,
  Utensils,
  X,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import type { LucideIcon } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { demoRepository } from "../services/demoRepository";
import { useDemoStore } from "../state/demoStore";
import { AssistantSheet } from "../features/assistant/AssistantSheet";
import { DemoControls } from "../features/demo/DemoControls";
import { PhoneReceptionist } from "../features/phone/PhoneReceptionist";
import { PresentationMode } from "../features/presentation/PresentationMode";
import { TableServiceSheet } from "../features/service/TableServiceSheet";

const navItems: Array<{ to: string; label: string; icon: LucideIcon; end?: boolean }> = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/visit", label: "Visit", icon: CalendarDays },
  { to: "/order", label: "Order", icon: Utensils },
  { to: "/ride", label: "Ride", icon: CarFront },
  { to: "/rewards", label: "Rewards", icon: Gift },
  { to: "/me", label: "Me", icon: UserRound },
];

export function AppShell() {
  const personaId = useDemoStore((state) => state.personaId);
  const venueId = useDemoStore((state) => state.venueId);
  const simulatedDay = useDemoStore((state) => state.simulatedDay);
  const simulatedTime = useDemoStore((state) => state.simulatedTime);
  const demoOpen = useDemoStore((state) => state.demoOpen);
  const assistantOpen = useDemoStore((state) => state.assistantOpen);
  const serviceOpen = useDemoStore((state) => state.serviceOpen);
  const phoneOpen = useDemoStore((state) => state.phoneOpen);
  const presentationActive = useDemoStore((state) => state.presentationActive);
  const stage = useDemoStore((state) => state.stage);
  const bookingState = useDemoStore((state) => state.bookingState);
  const notice = useDemoStore((state) => state.notice);
  const setDemoOpen = useDemoStore((state) => state.setDemoOpen);
  const setAssistantOpen = useDemoStore((state) => state.setAssistantOpen);
  const setServiceOpen = useDemoStore((state) => state.setServiceOpen);
  const setPhoneOpen = useDemoStore((state) => state.setPhoneOpen);
  const startPresentation = useDemoStore((state) => state.startPresentation);
  const setNotice = useDemoStore((state) => state.setNotice);
  const accessibility = useDemoStore((state) => state.accessibility[personaId]);
  const persona = demoRepository.getPersona(personaId);
  const venue = demoRepository.getVenue(venueId);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 4200);
    return () => window.clearTimeout(timer);
  }, [notice, setNotice]);

  const accessibilityClasses = [
    accessibility.largerText ? "pref-large-text" : "",
    accessibility.higherContrast ? "pref-high-contrast" : "",
    accessibility.reducedMotion ? "pref-reduced-motion" : "",
  ].join(" ");

  return (
    <div className={`presentation-canvas ${accessibilityClasses}`}>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <aside className="presentation-note" aria-label="Prototype presentation context">
        <div className="presentation-mark">
          <Sparkles size={26} />
        </div>
        <p className="eyebrow">Hospitality, coordinated</p>
        <h1>Tell the venue what kind of night you want.</h1>
        <p>
          Star Local brings the visit, table, meal, ride and entertainment into one
          customer-controlled plan.
        </p>
        <div className="presentation-context">
          <span>{persona.fullName}</span>
          <strong>{venue.name}</strong>
          <small>
            {simulatedDay} · {simulatedTime}
          </small>
        </div>
        <div className="presentation-actions">
          <button type="button" onClick={startPresentation}>
            Start Presentation
          </button>
          <button type="button" data-dialog-trigger="phone" onClick={() => setPhoneOpen(true)}>
            Simulate phone booking
          </button>
        </div>
        <a className="prototype-qr" href="https://wowcorey.github.io/star-local-concept/">
          <QRCodeSVG
            value="https://wowcorey.github.io/star-local-concept/"
            size={112}
            level="M"
            title="QR code for the public Star Local prototype"
          />
          <span>
            <strong>Open the prototype on your phone</strong>
            <small>wowcorey.github.io/star-local-concept/</small>
          </span>
        </a>
        <p className="presentation-disclaimer">
          Unofficial concept. Every person, venue and service state is fabricated.
        </p>
      </aside>

      <div className="phone-shell">
        <header className="app-header">
          <div className="app-brand" aria-label="Star Local">
            <span className="brand-star" aria-hidden="true">
              ✦
            </span>
            <span>
              <strong>Star Local</strong>
              <small>Unofficial concept</small>
            </span>
          </div>
          <button
            className="demo-trigger"
            type="button"
            data-dialog-trigger="demo"
            onClick={() => setDemoOpen(true)}
            aria-haspopup="dialog"
          >
            Demo Controls
          </button>
        </header>

        <main id="main-content" className="app-content">
          <Outlet />
          <footer className="app-footer">
            <p>Unofficial concept prototype · Synthetic data only</p>
            <p>
              No live bookings, payments, venue systems, transport tracking or gaming connections.
            </p>
            <button type="button" data-dialog-trigger="demo" onClick={() => setDemoOpen(true)}>
              Project disclaimer & demo controls
            </button>
          </footer>
        </main>

        <button
          className="ask-star-fab"
          type="button"
          data-dialog-trigger="assistant"
          onClick={() => setAssistantOpen(true)}
          aria-haspopup="dialog"
        >
          <Bot size={20} aria-hidden="true" /> Ask Star
        </button>

        {stage === "in-venue" || bookingState === "checked-in" ? (
          <button
            className="table-service-fab"
            type="button"
            data-dialog-trigger="service"
            onClick={() => setServiceOpen(true)}
            aria-haspopup="dialog"
          >
            <Utensils size={18} aria-hidden="true" /> Table Service
          </button>
        ) : null}

        <nav className="bottom-nav" aria-label="Primary navigation">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <Icon size={20} strokeWidth={2} aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {notice ? (
          <div className="toast" role="status">
            <span>{notice}</span>
            <button type="button" onClick={() => setNotice(null)} aria-label="Dismiss notification">
              <X size={16} />
            </button>
          </div>
        ) : null}
        {assistantOpen ? <AssistantSheet /> : null}
        {demoOpen ? <DemoControls /> : null}
        {serviceOpen ? <TableServiceSheet /> : null}
        {phoneOpen ? <PhoneReceptionist /> : null}
        {presentationActive ? <PresentationMode /> : null}
      </div>
    </div>
  );
}
