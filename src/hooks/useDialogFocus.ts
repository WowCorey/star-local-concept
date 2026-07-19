import { useEffect, useLayoutEffect, useRef, type RefObject } from "react";

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

interface DialogFocusOptions {
  dialogRef: RefObject<HTMLElement | null>;
  onRequestClose: () => void;
  restoreFocusSelector: string;
  closeOnEscape?: boolean;
}

export function useDialogFocus({
  dialogRef,
  onRequestClose,
  restoreFocusSelector,
  closeOnEscape = true,
}: DialogFocusOptions) {
  const closeRef = useRef(onRequestClose);

  useEffect(() => {
    closeRef.current = onRequestClose;
  }, [onRequestClose]);

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const inerted: Array<{ element: HTMLElement; wasInert: boolean }> = [];
    let branch: HTMLElement | null = dialog.closest(".overlay") as HTMLElement | null;

    while (branch?.parentElement) {
      const parent = branch.parentElement;
      for (const sibling of Array.from(parent.children)) {
        if (sibling !== branch && sibling instanceof HTMLElement) {
          inerted.push({ element: sibling, wasInert: sibling.inert });
          sibling.inert = true;
        }
      }
      branch = parent;
      if (parent === document.body) break;
    }

    const getFocusable = () =>
      Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector)).filter(
        (element) => element.getClientRects().length > 0,
      );

    (getFocusable()[0] ?? dialog).focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && closeOnEscape) {
        event.preventDefault();
        closeRef.current();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = getFocusable();
      if (focusable.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }
      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      for (const { element, wasInert } of inerted) element.inert = wasInert;
      const fallback = document.querySelector<HTMLElement>(restoreFocusSelector);
      if (previouslyFocused?.isConnected) previouslyFocused.focus();
      else fallback?.focus();
    };
  }, [closeOnEscape, dialogRef, restoreFocusSelector]);
}
