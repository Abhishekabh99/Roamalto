"use client";

import {
  type PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { createPortal } from "react-dom";

type ModalProps = PropsWithChildren<{
  open: boolean;
  onClose: () => void;
  title: string;
}>;

export const Modal = ({ open, onClose, title, children }: ModalProps) => {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const portalTarget =
    typeof window === "undefined" ? null : (document.body ?? null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";

    return () => {
      body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open || !dialogRef.current) {
      return;
    }
    dialogRef.current.focus();
  }, [open]);

  const handleBackdropClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) {
        onClose();
      }
    },
    [onClose],
  );

  if (!portalTarget || !open) {
    return null;
  }

  return createPortal(
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate/70 px-4 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        aria-label={title}
        className="max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-6 shadow-[var(--shadow-card)] ring-1 ring-border"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h3 className="text-lg font-semibold text-slate md:text-xl">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-9 items-center justify-center rounded-full border border-border text-slate transition-colors hover:bg-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deepgreen focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            aria-label="Close itinerary"
          >
            <span aria-hidden>X</span>
          </button>
        </div>
        <div className="space-y-4 text-sm text-foreground-muted">{children}</div>
      </div>
    </div>,
    portalTarget,
  );
};
