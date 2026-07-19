import { useRef } from "react";
import {
  Accessibility,
  Flag,
  Headphones,
  Martini,
  PhoneCall,
  Presentation,
  RotateCcw,
  Trophy,
  Tv2,
  X,
} from "lucide-react";
import { Button, Toggle } from "../../components/ui";
import { demoRepository } from "../../services/demoRepository";
import { useDemoStore, type DemoScenario } from "../../state/demoStore";
import { useDialogFocus } from "../../hooks/useDialogFocus";
import type {
  BookingState,
  BottleShopCollectionState,
  BusState,
  DrinkOrderState,
  LayoutPresetId,
  MarketingLevel,
  OrderState,
  ParticipantAcceptance,
  PhoneAudioState,
  PhoneCallState,
  PersonaId,
  ScreenRequestState,
  ServiceState,
  VisitStage,
} from "../../types/domain";

const scenarios: Array<{ id: DemoScenario; label: string; icon: typeof Flag }> = [
  { id: "flagship", label: "Flagship journey", icon: Flag },
  { id: "sports-night", label: "Sports night", icon: Trophy },
  { id: "accessibility", label: "Accessibility", icon: Accessibility },
  { id: "executive", label: "Full executive demo", icon: Presentation },
  { id: "drinks-service", label: "Drinks and service", icon: Martini },
  { id: "television", label: "Television control", icon: Tv2 },
  { id: "phone-reception", label: "Phone reception", icon: PhoneCall },
];

const options = (values: string[]) =>
  values.map((value) => (
    <option key={value} value={value}>
      {value.replaceAll("-", " ")}
    </option>
  ));

export function DemoControls() {
  const state = useDemoStore();
  const dialogRef = useRef<HTMLElement>(null);
  const personas = demoRepository.getPersonas();
  const venues = demoRepository.getVenues();
  const venue = demoRepository.getVenue(state.venueId);
  const layout = demoRepository.getLayout(state.venueId);
  const presets = demoRepository.getLayoutPresets();
  const activePreset = presets.find((preset) => preset.id === state.layoutPresetId)!;
  const recommendedPresets = presets.filter((preset) =>
    preset.recommendedVenueIds.includes(state.venueId),
  );
  const otherPresets = presets.filter(
    (preset) => !preset.recommendedVenueIds.includes(state.venueId),
  );
  const phoneScenarios = demoRepository.getPhoneScenarios();

  useDialogFocus({
    dialogRef,
    onRequestClose: () => state.setDemoOpen(false),
    restoreFocusSelector: "[data-dialog-trigger='demo']",
  });

  return (
    <div
      className="overlay"
      role="presentation"
      onMouseDown={(event) => event.currentTarget === event.target && state.setDemoOpen(false)}
    >
      <section
        ref={dialogRef}
        className="sheet demo-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="demo-title"
        tabIndex={-1}
      >
        <header className="sheet-header">
          <div>
            <p className="eyebrow">Presenter only</p>
            <h2 id="demo-title">Demo Controls v0.2.1</h2>
          </div>
          <button
            className="icon-button"
            type="button"
            onClick={() => state.setDemoOpen(false)}
            aria-label="Close Demo Controls"
          >
            <X size={21} />
          </button>
        </header>
        <div className="sheet-stack">
          <div className="control-group">
            <h3>Journey presets</h3>
            <div className="preset-grid preset-grid-v02">
              {scenarios.map(({ id, label, icon: Icon }) => (
                <button type="button" key={id} onClick={() => state.loadScenario(id)}>
                  <Icon size={20} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="control-group field-grid">
            <h3>Customer and venue context</h3>
            <label className="field">
              <span>Persona</span>
              <select
                value={state.personaId}
                onChange={(event) => state.setPersona(event.target.value as PersonaId)}
              >
                {personas.map((persona) => (
                  <option key={persona.id} value={persona.id}>
                    {persona.fullName}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Venue</span>
              <select
                value={state.venueId}
                onChange={(event) => state.setVenue(event.target.value as typeof state.venueId)}
              >
                {venues.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Zone</span>
              <select
                value={state.selectedZoneId}
                onChange={(event) => state.selectZone(event.target.value)}
              >
                {venue.zones
                  .filter((zone) => zone.customerVisible && zone.slug)
                  .map((zone) => (
                    <option key={zone.id} value={zone.id}>
                      {zone.name}
                    </option>
                  ))}
              </select>
            </label>
            <label className="field">
              <span>Layout preset</span>
              <select
                value={state.layoutPresetId}
                onChange={(event) => state.setLayoutPreset(event.target.value as LayoutPresetId)}
              >
                <optgroup label={`Recommended for ${venue.shortName}`}>
                  {recommendedPresets.map((preset) => (
                    <option key={preset.id} value={preset.id}>
                      {preset.label}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Other demonstration presets">
                  {otherPresets.map((preset) => (
                    <option key={preset.id} value={preset.id}>
                      {preset.label}
                    </option>
                  ))}
                </optgroup>
              </select>
            </label>
            <label className="field">
              <span>Selected table</span>
              <select
                value={state.selectedTableId}
                onChange={(event) => state.selectTable(event.target.value)}
              >
                {layout.tables
                  .filter(
                    (table) =>
                      table.zoneId === state.selectedZoneId &&
                      !activePreset.hiddenTableIds.includes(table.id),
                  )
                  .map((table) => (
                    <option key={table.id} value={table.id}>
                      Table {table.displayNumber}
                    </option>
                  ))}
              </select>
            </label>
            <label className="field">
              <span>Visit stage</span>
              <select
                value={state.stage}
                onChange={(event) => state.setStage(event.target.value as VisitStage)}
              >
                {options(["before-visit", "approaching", "in-venue", "after-visit"])}
              </select>
            </label>
            <label className="field">
              <span>Simulated time</span>
              <input
                value={state.simulatedTime}
                onChange={(event) => state.setSimulatedTime(event.target.value)}
              />
            </label>
          </div>
          <div className="control-group field-grid">
            <h3>Booking, order and service</h3>
            <label className="field">
              <span>Booking</span>
              <select
                value={state.bookingState}
                onChange={(event) => state.setBookingState(event.target.value as BookingState)}
              >
                {options([
                  "suggested",
                  "held",
                  "confirmed",
                  "changed",
                  "cancelled",
                  "checked-in",
                  "completed",
                ])}
              </select>
            </label>
            <label className="field">
              <span>Food preparation</span>
              <select
                value={state.orderState}
                onChange={(event) => state.setOrderState(event.target.value as OrderState)}
              >
                {options([
                  "draft",
                  "awaiting-confirmation",
                  "submitted",
                  "preparing",
                  "ready",
                  "delivered",
                  "issue-reported",
                ])}
              </select>
            </label>
            <label className="field">
              <span>Drink review and delivery</span>
              <select
                value={state.drinkOrder.state}
                onChange={(event) =>
                  state.setDrinkOrderState(event.target.value as DrinkOrderState)
                }
              >
                {options([
                  "draft",
                  "submitted",
                  "staff-review",
                  "accepted",
                  "modified",
                  "declined",
                  "preparing",
                  "delivered",
                ])}
              </select>
            </label>
            {state.groupRound.participants.map((participant) => (
              <label className="field" key={participant.id}>
                <span>{participant.name} response</span>
                <select
                  value={participant.acceptance}
                  onChange={(event) =>
                    state.setParticipantAcceptance(
                      participant.id,
                      event.target.value as ParticipantAcceptance,
                    )
                  }
                >
                  {options([
                    "pending",
                    "accepted",
                    "declined",
                    "staff-order",
                    "age-check",
                    "delivered",
                  ])}
                </select>
              </label>
            ))}
            <label className="field">
              <span>Table Service progression</span>
              <select
                value={state.serviceRequestState ?? "none"}
                onChange={(event) =>
                  state.setServiceRequestState(
                    event.target.value === "none" ? null : (event.target.value as ServiceState),
                  )
                }
              >
                <option value="none">none</option>
                {options(["requested", "accepted", "on-the-way", "completed"])}
              </select>
            </label>
            <label className="field">
              <span>Kitchen wait</span>
              <select
                value={state.kitchenWaitTime}
                onChange={(event) => state.setKitchenWaitTime(Number(event.target.value))}
              >
                <option value={18}>18 minutes</option>
                <option value={35}>35 minutes</option>
                <option value={0}>Unavailable</option>
              </select>
            </label>
            <label className="field">
              <span>Bar wait</span>
              <select
                value={state.barWaitTime}
                onChange={(event) => state.setBarWaitTime(Number(event.target.value))}
              >
                <option value={6}>6 minutes</option>
                <option value={12}>12 minutes</option>
                <option value={25}>25 minutes</option>
              </select>
            </label>
            <label className="field">
              <span>Delivery completion</span>
              <select
                value={
                  state.orderState === "delivered" && state.drinkOrder.state === "delivered"
                    ? "all"
                    : state.orderState === "delivered"
                      ? "food"
                      : state.drinkOrder.state === "delivered"
                        ? "drink"
                        : "none"
                }
                onChange={(event) => {
                  const value = event.target.value;
                  if (value === "food" || value === "all") state.setOrderState("delivered");
                  else if (state.orderState === "delivered") state.setOrderState("submitted");
                  if (value === "drink" || value === "all") state.setDrinkOrderState("delivered");
                  else if (state.drinkOrder.state === "delivered")
                    state.setDrinkOrderState("accepted");
                }}
              >
                <option value="none">No delivery complete</option>
                <option value="food">Food delivered</option>
                <option value="drink">Drink delivered</option>
                <option value="all">Food and drink delivered</option>
              </select>
            </label>
          </div>
          <div className="control-group field-grid">
            <h3>Screen, audio and transport</h3>
            <label className="field">
              <span>Ride</span>
              <select
                value={state.rideState}
                onChange={(event) => state.setRideState(event.target.value as BusState)}
              >
                {options([
                  "requested",
                  "window-confirmed",
                  "driver-assigned",
                  "en-route",
                  "arriving",
                  "boarded",
                  "completed",
                  "delayed",
                  "missed",
                ])}
              </select>
            </label>
            <label className="field">
              <span>Screen approval</span>
              <select
                value={state.screenRequestState}
                onChange={(event) =>
                  state.setScreenRequestState(event.target.value as ScreenRequestState)
                }
              >
                {options(["idle", "requested", "approved", "scheduled", "active", "unavailable"])}
              </select>
            </label>
            <label className="field">
              <span>Phone audio</span>
              <select
                value={state.phoneAudioState}
                onChange={(event) =>
                  state.setPhoneAudioState(
                    event.target.value as PhoneAudioState,
                    state.phoneAudioScreenId ?? "screen-7",
                  )
                }
              >
                {options(["unavailable", "available", "active", "paused"])}
              </select>
            </label>
            <label className="field">
              <span>Screen schedule</span>
              <select
                value={state.screenRequestScreenId ?? "none"}
                onChange={(event) =>
                  useDemoStore.setState({
                    screenRequestScreenId:
                      event.target.value === "none" ? null : event.target.value,
                  })
                }
              >
                <option value="none">Default schedule</option>
                {venue.screens.map((screen) => (
                  <option key={screen.id} value={screen.id}>
                    {screen.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="control-group field-grid">
            <h3>Rewards, marketing, collection and phone</h3>
            <label className="field">
              <span>Draw countdown</span>
              <select
                value={state.drawCountdown}
                onChange={(event) => state.setDrawCountdown(Number(event.target.value))}
              >
                <option value={30}>30 minutes</option>
                <option value={10}>10 minutes</option>
                <option value={1}>1 minute</option>
              </select>
            </label>
            <label className="field">
              <span>Fictional draw result</span>
              <select
                value={state.fictionalDrawResult}
                onChange={(event) =>
                  state.setFictionalDrawResult(
                    event.target.value as typeof state.fictionalDrawResult,
                  )
                }
              >
                {options(["pending", "not-selected", "selected"])}
              </select>
            </label>
            <label className="field">
              <span>Marketing level</span>
              <select
                value={state.marketingLevel}
                onChange={(event) => state.setMarketingLevel(event.target.value as MarketingLevel)}
              >
                {options(["group", "venue", "customer"])}
              </select>
            </label>
            <label className="field">
              <span>Bottle-shop preparation</span>
              <select
                value={state.bottleShopCollection.state}
                onChange={(event) =>
                  state.setBottleShopState(event.target.value as BottleShopCollectionState)
                }
              >
                {options(["not-started", "reserved", "preparing", "ready", "collected"])}
              </select>
            </label>
            <label className="field">
              <span>Phone scenario</span>
              <select
                value={state.phoneScenarioId}
                onChange={(event) => state.setPhoneScenario(event.target.value)}
              >
                {phoneScenarios.map((scenario) => (
                  <option key={scenario.id} value={scenario.id}>
                    {scenario.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Phone call state</span>
              <select
                value={state.phoneCallState}
                onChange={(event) => state.setPhoneCallState(event.target.value as PhoneCallState)}
              >
                {options([
                  "incoming",
                  "disclosed",
                  "identifying",
                  "gathering",
                  "confirming",
                  "completed",
                  "human-transfer",
                ])}
              </select>
            </label>
          </div>
          <div className="control-group toggle-list">
            <h3>Presenter overlays</h3>
            <Toggle
              checked={state.staffReview}
              onChange={() => state.setStaffReview(!state.staffReview)}
              label="Staff-review emphasis"
              description="Keeps a human decision visible"
            />
            <Toggle
              checked={state.phoneAudioAvailable}
              onChange={() => state.setPhoneAudio(!state.phoneAudioAvailable)}
              label="Phone audio available"
              description="Venue-only local simulation"
            />
            <Toggle
              checked={state.presentationActive}
              onChange={() =>
                state.presentationActive ? state.exitPresentation() : state.startPresentation()
              }
              label="Presentation mode"
              description="16 guided meeting steps"
            />
          </div>
          <div className="inline-actions">
            <Button
              variant="teal"
              data-dialog-trigger="phone"
              onClick={() => {
                state.setDemoOpen(false);
                state.setPhoneOpen(true);
              }}
            >
              <Headphones size={17} />
              Open phone simulation
            </Button>
            <Button variant="secondary" onClick={state.startPresentation}>
              <Presentation size={17} />
              Start presentation
            </Button>
          </div>
          <Button variant="danger" full onClick={state.resetDemo}>
            <RotateCcw size={18} />
            Reset demo
          </Button>
        </div>
      </section>
    </div>
  );
}
