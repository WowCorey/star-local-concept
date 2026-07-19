import { useRef, useState } from "react";
import { CheckCircle2, Clock3, MessageSquareText, UserRound, X } from "lucide-react";
import { Badge, Button } from "../../components/ui";
import { getServiceTeam } from "../v02/model";
import { useDemoStore } from "../../state/demoStore";
import { useDialogFocus } from "../../hooks/useDialogFocus";

const serviceKinds = [
  "Water",
  "Extra cutlery",
  "Napkins",
  "Sauce",
  "High chair",
  "Clean table",
  "Missing meal",
  "Missing drink",
  "Order issue",
  "Pay the bill",
  "Accessibility assistance",
  "Speak to staff",
  "Speak to manager",
  "First aid / urgent assistance",
];

export function TableServiceSheet() {
  const state = useDemoStore();
  const [note, setNote] = useState(state.serviceRequest?.note ?? "");
  const [dismissWarning, setDismissWarning] = useState(false);
  const dialogRef = useRef<HTMLElement>(null);

  const requestClose = () => {
    if (state.serviceRequest?.urgent) {
      setDismissWarning(true);
      return;
    }
    state.setServiceOpen(false);
  };
  useDialogFocus({
    dialogRef,
    onRequestClose: requestClose,
    restoreFocusSelector: "[data-dialog-trigger='service']",
  });

  const team = state.serviceRequest ? getServiceTeam(state.serviceRequest.kind) : null;
  return (
    <div
      className="overlay"
      role="presentation"
      onMouseDown={(event) => event.currentTarget === event.target && requestClose()}
    >
      <section
        ref={dialogRef}
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="service-title"
        tabIndex={-1}
      >
        <header className="sheet-header">
          <div>
            <p className="eyebrow">In-venue help</p>
            <h2 id="service-title">Table Service</h2>
          </div>
          <button
            className="icon-button"
            type="button"
            onClick={requestClose}
            aria-label="Close Table Service"
          >
            <X size={21} />
          </button>
        </header>
        <div className="sheet-stack">
          {dismissWarning ? (
            <div className="safety-strip" role="alert">
              <strong>Urgent request remains active</strong>
              <span>Closing this view does not cancel the request. Alert nearby staff now.</span>
              <Button variant="secondary" onClick={() => state.setServiceOpen(false)}>
                Close view and keep request active
              </Button>
            </div>
          ) : null}
          {state.serviceRequest ? (
            <div className="service-live" aria-live="polite">
              <div className="service-live-heading">
                <span>
                  <Clock3 size={20} />
                </span>
                <div>
                  <Badge tone={state.serviceRequest.state === "completed" ? "success" : "teal"}>
                    {state.serviceRequest.state.replaceAll("-", " ")}
                  </Badge>
                  <h3>{state.serviceRequest.kind}</h3>
                </div>
              </div>
              <p>
                <strong>{team?.label}</strong> · {team?.responseLabel}
              </p>
              {state.serviceRequest.note ? (
                <p className="service-note">
                  <MessageSquareText size={15} />
                  {state.serviceRequest.note}
                </p>
              ) : null}
              {state.serviceRequest.state === "completed" ? (
                <div className="success-panel">
                  <CheckCircle2 size={21} />
                  <span>
                    <strong>Completed</strong>
                    <small>You can create another request if needed.</small>
                  </span>
                </div>
              ) : (
                <div className="info-strip">
                  <Clock3 size={19} />
                  <span>
                    Venue staff controls acceptance and arrival updates. This view follows the
                    request.
                  </span>
                </div>
              )}
              <div className="inline-actions">
                {!state.serviceRequest.urgent && state.serviceRequest.state !== "completed" ? (
                  <Button variant="ghost" onClick={state.cancelServiceRequest}>
                    Cancel request
                  </Button>
                ) : null}
                <Button
                  variant="secondary"
                  onClick={() => state.requestService("Speak to staff", note)}
                >
                  <UserRound size={17} />
                  Request a person
                </Button>
              </div>
            </div>
          ) : (
            <>
              <p>
                Choose what the table needs. The request routes to a synthetic operational team,
                never a named employee.
              </p>
              <div className="service-choice-grid">
                {serviceKinds.map((kind) => (
                  <button key={kind} type="button" onClick={() => state.requestService(kind, note)}>
                    {kind}
                    <small>{getServiceTeam(kind).label}</small>
                  </button>
                ))}
              </div>
              <label className="field">
                <span>Optional note</span>
                <textarea
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="Add a short note for the team"
                />
              </label>
            </>
          )}
          <p className="microcopy">
            For urgent or first-aid help, also alert nearby staff immediately.
          </p>
        </div>
      </section>
    </div>
  );
}
