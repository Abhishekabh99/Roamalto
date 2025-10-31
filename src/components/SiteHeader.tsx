"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  "rounded-full px-3 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deepgreen focus-visible:ring-offset-2 focus-visible:ring-offset-sand";

export const SiteHeader = () => {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-sand/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 md:py-5">
        <Link
          href="/"
          className="rounded-full px-2 py-1 text-lg font-semibold text-deepgreen focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deepgreen focus-visible:ring-offset-2 focus-visible:ring-offset-sand"
          aria-label="Roamalto home"
        >
          Roamalto
        </Link>
        <nav
          className="flex flex-1 items-center justify-end gap-4 text-sm font-medium text-foreground-muted md:gap-6"
          aria-label="Primary"
        >
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`${navLinkBaseClass} ${
                  isActive
                    ? "text-deepgreen"
                    : "text-foreground-muted hover:text-deepgreen"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <WhatsAppCTA
          phone={CONTACT_PHONE}
          text="Hi Roamalto, I'm browsing your site."
          utm={{ ...DEFAULT_UTM, utm_content: "header" }}
          label="WhatsApp us"
          className="hidden sm:inline-flex"
        />
        <WhatsAppCTA
          phone={CONTACT_PHONE}
          text="Hi Roamalto, I'm browsing your site."
          utm={{ ...DEFAULT_UTM, utm_content: "header-mobile" }}
          label="WhatsApp"
          size="sm"
          className="sm:hidden"
        />
      </div>
    </header>
  );
};
