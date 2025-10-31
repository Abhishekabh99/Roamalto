"use client";

import {
  type MouseEvent as ReactMouseEvent,
  type PropsWithChildren,
  useCallback,
  useEffect,
  useId,
  useRef,
} from "react";
import { createPortal } from "react-dom";

type ModalProps = PropsWithChildren<{
  open: boolean;
  onClose: () => void;
  title: string;
  id?: string;
}>;

export const Modal = ({ open, onClose, title, children, id }: ModalProps) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const portalTarget =
    typeof window === "undefined" ? null : (document.body ?? null);
  const instanceId = useId();
  const dialogId = id ?? `${instanceId}-dialog`;
  const titleId = `${instanceId}-title`;

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
    (event: ReactMouseEvent<HTMLDivElement>) => {
      if (dialogRef.current && event.target === event.currentTarget) {
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
      <dialog
        ref={dialogRef}
        open
        id={dialogId}
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
        className="max-h-[85vh] w-[92vw] overflow-y-auto rounded-2xl border border-border bg-white p-6 shadow-lg focus:outline-none md:w-[720px] md:p-7 lg:w-[860px] lg:p-8"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h3
            id={titleId}
            className="text-lg font-semibold text-slate md:text-xl"
          >
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-slate transition-colors hover:bg-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deepgreen focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            aria-label="Close itinerary"
          >
            <span aria-hidden>X</span>
          </button>
        </div>
        <div className="space-y-5 text-sm text-foreground-muted md:text-base">
          {children}
        </div>
      </dialog>
    </div>,
    portalTarget,
  );
};
