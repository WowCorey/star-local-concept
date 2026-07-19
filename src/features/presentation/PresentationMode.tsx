import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { demoRepository } from "../../services/demoRepository";
import { useDemoStore } from "../../state/demoStore";

export function PresentationMode() {
  const navigate = useNavigate();
  const state = useDemoStore();
  const steps = demoRepository.getPresentationSteps();
  const step = steps[state.presentationStep] ?? steps[0]!;

  const move = (direction: 1 | -1) => {
    const nextIndex = Math.max(0, Math.min(steps.length - 1, state.presentationStep + direction));
    state.applyPresentationStep(nextIndex);
  };

  useEffect(() => {
    navigate(step.route);
  }, [navigate, step.route]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (document.querySelector('[role="dialog"]')) return;
      if (event.key === "Escape") state.exitPresentation();
      if (event.key === "ArrowRight") move(1);
      if (event.key === "ArrowLeft") move(-1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  return (
    <aside className="presentation-controller" aria-label="Guided presentation mode">
      <div className="presentation-progress">
        <span style={{ width: `${((state.presentationStep + 1) / steps.length) * 100}%` }} />
      </div>
      <div>
        <p>
          Step {state.presentationStep + 1} of {steps.length}
        </p>
        <strong>{step.title}</strong>
        <small>{step.note}</small>
      </div>
      <button
        type="button"
        onClick={() => move(-1)}
        disabled={state.presentationStep === 0}
        aria-label="Previous presentation step"
      >
        <ChevronLeft size={19} />
      </button>
      <button
        type="button"
        onClick={() => move(1)}
        disabled={state.presentationStep === steps.length - 1}
        aria-label="Next presentation step"
      >
        <ChevronRight size={19} />
      </button>
      <button type="button" onClick={state.exitPresentation} aria-label="Exit presentation mode">
        <X size={18} />
      </button>
    </aside>
  );
}
