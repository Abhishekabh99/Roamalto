"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { MobileMenu } from "@/components/MobileMenu";
import { WhatsAppCTA } from "@/components/WhatsAppCTA";
import { CONTACT_PHONE, DEFAULT_UTM } from "@/data/site";

type NavItem = {
  label: string;
  href: string;
  subtle?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Packages", href: "/packages" },
  { label: "Process", href: "/process" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy", href: "/privacy", subtle: true },
];

const DESKTOP_LINK_CLASSES =
  "inline-flex items-center rounded-xl px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2 focus-visible:ring-offset-white";

export const NavBar = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const desktopLinks = useMemo(() => {
    return NAV_ITEMS.map((item) => {
      const isActive =
        item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
      const colorClasses = isActive
        ? "text-brand-green"
        : item.subtle
          ? "text-brand-slate/60 hover:text-brand-green"
          : "text-brand-slate hover:text-brand-green";

      return (
        <Link
          key={item.href}
          href={item.href}
          aria-current={isActive ? "page" : undefined}
          className={`${DESKTOP_LINK_CLASSES} ${colorClasses}`}
        >
          {item.label}
        </Link>
      );
    });
  }, [pathname]);

  const menuFooter = (
    <WhatsAppCTA
      phone={CONTACT_PHONE}
      text="Hi Roamalto, I'd like to plan a trip."
      utm={{ ...DEFAULT_UTM, utm_content: "header-mobile-menu" }}
      label="Plan on WhatsApp"
    />
  );

  const toggleLabel = open ? "Close menu" : "Open menu";

  return (
    <header className="sticky top-[env(safe-area-inset-top)] z-40 border-b border-border bg-white/90 backdrop-blur">
      <div className="container mx-auto flex h-14 max-w-screen-xl items-center justify-between px-4">
        <Link
          href="/"
          aria-label="Roamalto home"
          className="flex items-center gap-3 text-lg font-semibold text-brand-green transition-colors hover:text-brand-green/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        >
          Roamalto
        </Link>
        <nav
          aria-label="Primary"
          className="hidden items-center gap-6 md:flex"
        >
          {desktopLinks}
        </nav>
        <div className="flex items-center gap-6">
          <WhatsAppCTA
            phone={CONTACT_PHONE}
            text="Hi Roamalto, I'm browsing your site."
            utm={{ ...DEFAULT_UTM, utm_content: "header" }}
            label="WhatsApp us"
            className="hidden md:inline-flex"
          />
          <div className="md:hidden">
            <button
              ref={triggerRef}
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white/90 px-0 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green"
              aria-label={toggleLabel}
              aria-controls="mobile-menu"
              aria-expanded={open}
              onClick={() => setOpen((value) => !value)}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-5 w-5 text-brand-slate"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                {open ? (
                  <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
                ) : (
                  <path d="M5 7h14M5 12h14M5 17h14" strokeLinecap="round" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      <MobileMenu
        id="mobile-menu"
        open={open}
        onClose={() => setOpen(false)}
        items={NAV_ITEMS}
        triggerRef={triggerRef}
        footer={menuFooter}
      />
    </header>
  );
};
