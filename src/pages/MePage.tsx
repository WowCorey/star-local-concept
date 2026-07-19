import { useState } from "react";
import {
  Accessibility,
  CheckCircle2,
  ChevronDown,
  Edit3,
  EyeOff,
  Pause,
  Shield,
  Trash2,
  UserRound,
} from "lucide-react";
import { Badge, Button, Card, PageIntro, SectionHeading, Toggle } from "../components/ui";
import { demoRepository } from "../services/demoRepository";
import { useDemoStore } from "../state/demoStore";
import type { AccessibilityPreferences, CommunicationPreferences } from "../types/domain";

const accessibilityLabels: Record<keyof AccessibilityPreferences, [string, string]> = {
  largerText: ["Larger text", "Increase text throughout this device"],
  higherContrast: ["Higher contrast", "Strengthen borders and secondary text"],
  reducedMotion: ["Reduced motion", "Remove non-essential transitions"],
  quieterSeating: ["Quieter seating", "Prefer lower-noise zones"],
  stepFreeRoute: ["Step-free route", "Show step-free arrival information"],
  lowTable: ["Low table", "Prefer a standard-height low table"],
  wheelchairSpace: ["Wheelchair space", "Keep turning and transfer space"],
  accessibleBus: ["Accessible bus seating", "Ask a person to confirm capacity"],
};

const communicationLabels: Record<keyof CommunicationPreferences, [string, string]> = {
  booking: ["Booking reminders", "Useful visit and hold updates"],
  food: ["Food and specials", "Venue-local menu information"],
  events: ["Events and sport", "Only interests you saved"],
  transport: ["Courtesy transport", "Your own ride updates"],
  generalMarketing: ["General marketing", "Broader group messages"],
};

const serviceKinds = [
  "Water",
  "Extra cutlery",
  "Napkins",
  "Sauce",
  "High chair",
  "Clean table",
  "Missing item",
  "Order problem",
  "Accessibility assistance",
  "Speak to staff",
];

export function MePage() {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftValue, setDraftValue] = useState("");
  const state = useDemoStore();
  const persona = demoRepository.getPersona(state.personaId);
  const memories = state.memories[state.personaId].filter((memory) => memory.status !== "removed");
  const access = state.accessibility[state.personaId];
  const communications = state.communications[state.personaId];

  const startEdit = (id: string, value: string) => {
    setEditingId(id);
    setDraftValue(value);
  };

  return (
    <div className="page-stack">
      <PageIntro
        eyebrow="Your information, your call"
        title={`What Star remembers about ${persona.firstName}`}
      >
        Review each saved preference, change it, pause its use or remove it. No medical detail is
        required.
      </PageIntro>

      <Card className="profile-card">
        <span className="avatar avatar-large">{persona.initials}</span>
        <div>
          <Badge tone="gold">Synthetic member</Badge>
          <h2>{persona.fullName}</h2>
          <p>
            {persona.memberId} · {persona.tier}
          </p>
        </div>
      </Card>

      <section id="memory">
        <SectionHeading title="Saved memories" action={<Badge>{memories.length} visible</Badge>} />
        <div className="memory-list">
          {memories.map((memory) => (
            <Card key={memory.id} className={memory.status === "paused" ? "memory-paused" : ""}>
              <div className="memory-heading">
                <div>
                  <Badge tone={memory.status === "paused" ? "warning" : "teal"}>
                    {memory.status}
                  </Badge>
                  <h3>{memory.label}</h3>
                  <small>{memory.source}</small>
                </div>
                <span className="memory-category">{memory.category}</span>
              </div>
              {editingId === memory.id ? (
                <div className="field-grid">
                  <label className="field">
                    <span>Edit remembered value</span>
                    <input
                      value={draftValue}
                      onChange={(event) => setDraftValue(event.target.value)}
                    />
                  </label>
                  <div className="inline-actions">
                    <Button
                      onClick={() => {
                        state.updateMemory(memory.id, draftValue);
                        setEditingId(null);
                      }}
                    >
                      Save
                    </Button>
                    <Button variant="ghost" onClick={() => setEditingId(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="memory-value">{memory.value}</p>
              )}
              <div className="memory-actions">
                <button type="button" onClick={() => startEdit(memory.id, memory.value)}>
                  <Edit3 size={16} />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() =>
                    state.setMemoryStatus(
                      memory.id,
                      memory.status === "paused" ? "active" : "paused",
                    )
                  }
                >
                  <Pause size={16} />
                  {memory.status === "paused" ? "Resume" : "Pause"}
                </button>
                <button type="button" onClick={() => state.setMemoryStatus(memory.id, "removed")}>
                  <Trash2 size={16} />
                  Remove
                </button>
              </div>
            </Card>
          ))}
          {memories.length === 0 ? (
            <Card>
              <div className="empty-state">
                <EyeOff size={28} />
                <h2>Nothing saved</h2>
                <p>
                  This persona has removed every remembered preference. Core service remains
                  available.
                </p>
              </div>
            </Card>
          ) : null}
        </div>
      </section>

      <Card className="protected-card">
        <div className="protected-heading">
          <span>
            <Shield size={22} />
          </span>
          <div>
            <Badge tone="warning">Protected boundary</Badge>
            <h2>Never used for recommendations</h2>
          </div>
        </div>
        <p>These categories stay outside the hospitality personalisation model:</p>
        <ul className="protected-grid">
          <li>Gaming activity</li>
          <li>Gambling exclusions</li>
          <li>RSA decisions</li>
          <li>Security incidents</li>
          <li>Staff safety reports</li>
        </ul>
        <p className="microcopy">
          This prototype contains no records from any of these categories.
        </p>
      </Card>

      <Card>
        <SectionHeading title="Communication settings" />
        <div className="toggle-list">
          {(Object.keys(communicationLabels) as Array<keyof CommunicationPreferences>).map(
            (key) => (
              <Toggle
                key={key}
                checked={communications[key]}
                onChange={() => state.toggleCommunication(key)}
                label={communicationLabels[key][0]}
                description={communicationLabels[key][1]}
              />
            ),
          )}
        </div>
      </Card>

      <Card>
        <SectionHeading title="Accessibility preferences" />
        <div className="info-strip">
          <Accessibility size={21} />
          <span>
            Choose helpful experience settings without disclosing a diagnosis or medical history.
          </span>
        </div>
        <div className="toggle-list">
          {(Object.keys(accessibilityLabels) as Array<keyof AccessibilityPreferences>).map(
            (key) => (
              <Toggle
                key={key}
                checked={access[key]}
                onChange={() => state.toggleAccessibility(key)}
                label={accessibilityLabels[key][0]}
                description={accessibilityLabels[key][1]}
              />
            ),
          )}
        </div>
      </Card>

      <Card id="service">
        <SectionHeading
          title="Ask for service"
          action={
            state.serviceRequestState ? (
              <Badge tone={state.serviceRequestState === "completed" ? "success" : "teal"}>
                {state.serviceRequestState}
              </Badge>
            ) : null
          }
        />
        <p>Every request is a local simulation with a clear human route.</p>
        <div className="service-grid">
          {serviceKinds.map((kind) => (
            <button
              type="button"
              key={kind}
              onClick={() => state.requestService(kind)}
              className={state.serviceRequestKind === kind ? "active" : ""}
            >
              {kind}
              <ChevronDown size={14} />
            </button>
          ))}
        </div>
        {state.serviceRequestKind ? (
          <div className="service-status">
            <span>
              <UserRound size={20} />
            </span>
            <div>
              <strong>{state.serviceRequestKind}</strong>
              <small>{state.serviceRequestState?.replaceAll("-", " ")}</small>
            </div>
            {state.serviceRequestState !== "completed" ? (
              <Button
                variant="secondary"
                onClick={() =>
                  state.setServiceRequestState(
                    state.serviceRequestState === "requested"
                      ? "accepted"
                      : state.serviceRequestState === "accepted"
                        ? "on-the-way"
                        : "completed",
                  )
                }
              >
                Advance
              </Button>
            ) : (
              <CheckCircle2 size={21} />
            )}
          </div>
        ) : null}
      </Card>

      <Card>
        <SectionHeading title="About this prototype" />
        <p>
          <strong>Star Local is an unofficial, independent concept.</strong> It is not connected to,
          approved by, sponsored by or endorsed by Star Group.
        </p>
        <ul className="about-list">
          <li>No live venue or booking connection</li>
          <li>No real payment, loyalty or identity system</li>
          <li>No live AI, location, bus or phone service</li>
          <li>No gaming controls or recommendation data</li>
          <li>All members, venues, products and states are synthetic</li>
        </ul>
        <Button variant="ghost" full onClick={state.resetDemo}>
          Reset demo
        </Button>
      </Card>
    </div>
  );
}
