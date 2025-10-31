"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
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

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export const MobileMenu = ({
  id,
  open,
  onClose,
  items,
  triggerRef,
  footer,
}: MobileMenuProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const initialFocusRef = useRef<HTMLElement | null>(null);
  const pathname = usePathname();

  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) {
      return;
    }

    const node = containerRef.current;
    if (!node) {
      return;
    }

    const focusables = node.querySelectorAll<HTMLElement>(FOCUSABLE);
    const firstFocusable = focusables[0] ?? null;
    initialFocusRef.current = triggerRef.current;

    firstFocusable?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || focusables.length === 0) {
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey) {
        if (active === first) {
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
    };
  }, [open, onClose, triggerRef]);

  useEffect(() => {
    if (open) {
      onClose();
    }
  }, [pathname, open, onClose]);

  useEffect(() => {
    if (open) {
      return;
    }

    const previous = initialFocusRef.current;
    if (previous) {
      previous.focus();
    }
  }, [open]);

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
            className={`block w-full rounded-lg px-4 py-3 text-left text-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green ${
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
    <div
      id={id}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation"
      className="fixed inset-x-0 top-[env(safe-area-inset-top)] bottom-[env(safe-area-inset-bottom)] z-50 md:hidden"
    >
      <div
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
        role="presentation"
      />
      <div
        ref={containerRef}
        className="relative mx-3 mt-3 flex max-h-[calc(100%-2rem)] flex-col gap-4 overflow-y-auto rounded-2xl bg-white p-4 shadow-xl"
      >
        <nav aria-label="Mobile">
          <ul className="flex flex-col gap-1">{renderedItems}</ul>
        </nav>
        {footer ? <div className="border-t border-slate-200 pt-4">{footer}</div> : null}
      </div>
    </div>
  );
};
