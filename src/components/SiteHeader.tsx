"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { WhatsAppCTA } from "@/components/WhatsAppCTA";
import { CONTACT_PHONE, DEFAULT_UTM } from "@/data/site";

type NavItem = {
  label: string;
  href: string;
  subtle?: boolean;
};

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Packages", href: "/packages" },
  { label: "Process", href: "/process" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy", href: "/privacy", subtle: true },
];

const navLinkBaseClass =
  "inline-flex h-11 items-center justify-center rounded-full px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2";

const FOCUSABLE_ELEMENTS =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
  items: NavItem[];
  activePath: string;
  labelledBy?: string;
};

const MobileMenu = ({
  open,
  onClose,
  items,
  activePath,
  labelledBy = "mobile-navigation-heading",
}: MobileMenuProps) => {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    previouslyFocusedRef.current =
      (document.activeElement as HTMLElement | null) ?? null;

    const menuNode = menuRef.current;
    if (!menuNode) {
      return;
    }

    const focusable = Array.from(
      menuNode.querySelectorAll<HTMLElement>(FOCUSABLE_ELEMENTS),
    ).filter((element) => !element.hasAttribute("disabled"));

    focusable[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === "Tab" && focusable.length > 0) {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
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
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      body.style.overflow = previousOverflow;
      previouslyFocusedRef.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-brand-slate/40 backdrop-blur-sm md:hidden"
      role="presentation"
      onClick={onClose}
    >
      <div
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        id="mobile-navigation"
        className="flex h-full w-[min(20rem,90vw)] flex-col gap-6 bg-white px-6 py-6 shadow-xl ring-1 ring-border"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <p
            id={labelledBy}
            className="text-sm font-medium uppercase tracking-[0.3em] text-brand-green"
          >
            Menu
          </p>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-brand-slate transition-colors hover:bg-brand-sand/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            <span className="sr-only">Close navigation menu</span>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <nav aria-label="Mobile primary navigation" className="flex flex-col gap-2">
          {items.map((item) => {
            const isActive =
              item.href === "/"
                ? activePath === "/"
                : activePath.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                onClick={onClose}
                className={`${navLinkBaseClass} justify-start bg-brand-sand/60 text-base text-brand-slate hover:bg-brand-sand focus-visible:ring-offset-brand-sand`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto flex flex-col gap-3 border-t border-border pt-4">
          <WhatsAppCTA
            phone={CONTACT_PHONE}
            text="Hi Roamalto, I'd like to plan a trip."
            utm={{ ...DEFAULT_UTM, utm_content: "header-mobile-menu" }}
            label="Plan on WhatsApp"
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

const useScrollShadow = (threshold: number): boolean => {
  const [isElevated, setIsElevated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleScroll = () => {
      window.requestAnimationFrame(() => {
        setIsElevated(window.scrollY > threshold);
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [threshold]);

  return isElevated;
};

export const NavBar = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isElevated = useScrollShadow(4);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const closeMenu = () => setIsMenuOpen(false);

    if (typeof queueMicrotask === "function") {
      queueMicrotask(closeMenu);
    } else if (typeof window !== "undefined") {
      window.setTimeout(closeMenu, 0);
    }
  }, [pathname, isMenuOpen]);

  const headerClasses = useMemo(() => {
    const base =
      "sticky top-[env(safe-area-inset-top)] z-50 border-b border-border bg-white/80 backdrop-blur transition-shadow";
    return isElevated ? `${base} shadow-[0_8px_28px_rgba(15,23,42,0.12)]` : base;
  }, [isElevated]);

  return (
    <header className={headerClasses}>
      <div className="container flex items-center justify-between gap-4 py-4 md:py-5">
        <Link
          href="/"
          className="inline-flex h-11 items-center rounded-full px-3 text-lg font-semibold text-brand-green transition-colors hover:text-brand-green/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          aria-label="Roamalto home"
        >
          Roamalto
        </Link>
        <nav
          className="hidden items-center gap-6 text-sm font-medium text-brand-slate md:flex"
          aria-label="Primary"
        >
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            const activeClass = isActive
              ? "text-brand-green"
              : item.subtle
                ? "text-brand-slate/60 hover:text-brand-green"
                : "text-brand-slate hover:text-brand-green";
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`${navLinkBaseClass} ${activeClass} focus-visible:ring-offset-white`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
          <WhatsAppCTA
            phone={CONTACT_PHONE}
            text="Hi Roamalto, I'm browsing your site."
            utm={{ ...DEFAULT_UTM, utm_content: "header" }}
            label="WhatsApp us"
            className="hidden md:inline-flex"
          />
          <button
            type="button"
            aria-label="Open navigation menu"
            aria-controls="mobile-navigation"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen(true)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-brand-slate transition-colors hover:bg-brand-sand/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2 focus-visible:ring-offset-white md:hidden"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M5 7h14M5 12h14M5 17h14" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
      <MobileMenu
        open={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        items={navItems}
        activePath={pathname}
      />
    </header>
  );
};

export const SiteHeader = NavBar;
