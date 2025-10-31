"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { Portal } from "@/components/Portal";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

type MobileMenuItem = {
  href: string;
  label: string;
  subtle?: boolean;
};

type MobileMenuProps = {
  id: string;
  open: boolean;
  onClose: () => void;
  items: MobileMenuItem[];
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  footer?: ReactNode;
};

const FOCUSABLE_SELECTORS =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export const MobileMenu = ({
  id,
  open,
  onClose,
  items,
  triggerRef,
  footer,
}: MobileMenuProps) => {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const pathname = usePathname();

  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) {
      return;
    }

    const panel = panelRef.current;
    if (!panel) {
      return;
    }

    restoreFocusRef.current = triggerRef.current ?? null;

    const focusableNodes = panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS);
    const firstFocusable = focusableNodes[0] ?? panel;
    firstFocusable.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || focusableNodes.length === 0) {
        return;
      }

      const first = focusableNodes[0];
      const last = focusableNodes[focusableNodes.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey) {
        if (active === first || active === panel) {
          event.preventDefault();
          last.focus();
        }
      } else if (active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      const toRestore = restoreFocusRef.current;
      if (toRestore) {
        const focusLater = () => toRestore.focus();
        if (typeof queueMicrotask === "function") {
          queueMicrotask(focusLater);
        } else if (typeof window !== "undefined") {
          window.setTimeout(focusLater, 0);
        }
      }
    };
  }, [open, onClose, triggerRef]);

  const handleLinkClick = useCallback(() => {
    onClose();
  }, [onClose]);

  const renderedItems = useMemo(() => {
    return items.map((item) => {
      const isActive =
        item.href === "/"
          ? pathname === "/"
          : pathname.startsWith(item.href);
      return (
        <li key={item.href}>
          <Link
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            onClick={handleLinkClick}
            className={`block w-full rounded-lg px-4 py-3 text-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green ${
              isActive
                ? "bg-slate-50 text-brand-green"
                : "text-brand-slate hover:bg-slate-50"
            }`}
          >
            {item.label}
          </Link>
        </li>
      );
    });
  }, [items, handleLinkClick, pathname]);

  if (!open) {
    return null;
  }

  return (
    <Portal>
      <>
        <div
          className="fixed inset-0 z-[60] bg-black/30 md:hidden"
          onClick={onClose}
          role="presentation"
        />
        <div
          ref={panelRef}
          id={id}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          tabIndex={-1}
          className="fixed inset-x-0 top-[env(safe-area-inset-top)] bottom-[env(safe-area-inset-bottom)] z-[61] overflow-y-auto bg-white md:hidden"
        >
          <div className="px-4 py-4">
            <nav aria-label="Mobile">
              <ul className="flex flex-col gap-1">{renderedItems}</ul>
            </nav>
            {footer ? (
              <div className="mt-6 border-t border-slate-200 pt-4">{footer}</div>
            ) : null}
          </div>
        </div>
      </>
    </Portal>
  );
};
