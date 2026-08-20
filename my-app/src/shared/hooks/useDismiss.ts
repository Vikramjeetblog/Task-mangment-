"use client";

import { useEffect, useRef } from "react";

/**
 * Closes a popover when the user clicks outside it or presses Escape.
 *
 * Attach the returned ref to the element that wraps both the trigger and the
 * popover, so clicking the trigger again doesn't count as "outside".
 */
export function useDismiss(open: boolean, onDismiss: () => void) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent | TouchEvent) {
      if (!ref.current?.contains(event.target as Node)) {
        onDismiss();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onDismiss();
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onDismiss]);

  return ref;
}
