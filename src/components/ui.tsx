import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Check, Minus, Plus } from "lucide-react";

export function Card({
  children,
  className = "",
  as = "section",
  id,
}: {
  children: ReactNode;
  className?: string;
  as?: "section" | "article" | "div";
  id?: string;
}) {
  const Component = as;
  return (
    <Component className={`card ${className}`} id={id}>
      {children}
    </Component>
  );
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "teal";
  full?: boolean;
}

export function Button({
  className = "",
  variant = "primary",
  full = false,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`button button-${variant} ${full ? "button-full" : ""} ${className}`}
      type={type}
      {...props}
    />
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "success" | "warning" | "teal" | "gold";
}) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

export function PageIntro({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <header className="page-intro">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p>{children}</p>
    </header>
  );
}

export function SectionHeading({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="section-heading">
      <h2>{title}</h2>
      {action}
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  description?: string;
}) {
  return (
    <button
      className="toggle-row"
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
    >
      <span>
        <strong>{label}</strong>
        {description ? <small>{description}</small> : null}
      </span>
      <span className={`toggle ${checked ? "toggle-on" : ""}`} aria-hidden="true">
        <span>{checked ? <Check size={14} strokeWidth={3} /> : null}</span>
      </span>
    </button>
  );
}

export function Stepper({
  label,
  value,
  onChange,
  min = 1,
  max = 12,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="stepper">
      <span>{label}</span>
      <div>
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          aria-label={`Decrease ${label}`}
          disabled={value <= min}
        >
          <Minus size={18} />
        </button>
        <output aria-live="polite">{value}</output>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          aria-label={`Increase ${label}`}
          disabled={value >= max}
        >
          <Plus size={18} />
        </button>
      </div>
    </div>
  );
}

export function DemoDataLabel() {
  return <span className="demo-data-label">Synthetic demo data</span>;
}

export function StatusDot({
  tone = "burgundy",
}: {
  tone?: "burgundy" | "teal" | "green" | "amber" | "muted";
}) {
  return <span className={`status-dot status-dot-${tone}`} aria-hidden="true" />;
}
