"use client";

import { useEffect, useMemo, useState } from "react";
import type { BookingStatus, EventType, UserRole } from "@/db/types";

const BOOKING_STATUS_FLOW: Record<BookingStatus, BookingStatus[]> = {
  new: ["consulting"],
  consulting: ["docs"],
  docs: ["booked", "closed"],
  booked: [],
  closed: [],
};

const STATUS_LABELS: Record<BookingStatus, string> = {
  new: "New",
  consulting: "Consulting",
  docs: "Documents",
  booked: "Booked",
  closed: "Closed",
};

const STATUS_STYLES: Record<BookingStatus, string> = {
  new: "bg-sand text-deepgreen",
  consulting: "bg-amber-100 text-amber-800",
  docs: "bg-sky-100 text-sky-800",
  booked: "bg-emerald-100 text-emerald-800",
  closed: "bg-slate-200 text-slate-700",
};

const EVENT_LABELS: Record<EventType, string> = {
  page_view: "Page View",
  cta_click: "CTA Click",
  book_click: "Book Click",
  itinerary_open: "Itinerary Open",
};

const TABS = [
  { id: "leads", label: "Leads" },
  { id: "bookings", label: "Bookings" },
  { id: "events", label: "Events" },
  { id: "packages", label: "Packages" },
] as const;

type AdminTab = (typeof TABS)[number]["id"];

type PackageRecord = {
  id: string;
  slug: string;
  title: string;
  days: number;
  highlights: string[];
  priceFrom: number | null;
  active: boolean;
  createdAt: string;
};

type LeadRecord = {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  travelWindow: string;
  source: string;
  utm: unknown;
  createdAt: string;
};

type BookingRecord = {
  id: string;
  leadId: string;
  packageId: string | null;
  status: BookingStatus;
  amountEstimate: number | null;
  meta: unknown;
  createdAt: string;
  leadName: string;
  leadEmail: string;
  leadCountry: string;
  packageTitle: string;
};

type EventRecord = {
  id: string;
  type: EventType;
  path: string;
  sessionId: string;
  meta: unknown;
  createdAt: string;
};

type PackageDraft = {
  title: string;
  days: string;
  highlights: string;
  priceFrom: string;
  active: boolean;
};

type FeedbackState = {
  type: "success" | "error";
  message: string;
};

type AdminDashboardProps = {
  viewerRole: UserRole;
  packages: PackageRecord[];
  leads: LeadRecord[];
  bookings: BookingRecord[];
  events: EventRecord[];
};

const buildPackageDraft = (pkg: PackageRecord): PackageDraft => ({
  title: pkg.title,
  days: String(pkg.days),
  highlights: pkg.highlights.join("\n"),
  priceFrom: pkg.priceFrom !== null ? String(pkg.priceFrom) : "",
  active: pkg.active,
});

const formatCurrency = (value: number | null) => {
  if (value === null) {
    return "—";
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
};

const parseJsonSnippet = (input: unknown) => {
  if (!input) return "";
  try {
    const text = JSON.stringify(input);
    return text.length > 72 ? `${text.slice(0, 69)}…` : text;
  } catch {
    return String(input);
  }
};

export const AdminDashboard = ({
  viewerRole,
  packages,
  leads,
  bookings,
  events,
}: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState<AdminTab>("leads");
  const [packagesState, setPackagesState] = useState(() => packages);
  const [packageDrafts, setPackageDrafts] = useState<Record<string, PackageDraft>>(() =>
    Object.fromEntries(packages.map((pkg) => [pkg.id, buildPackageDraft(pkg)])),
  );
  const [leadsState] = useState(() => leads);
  const [bookingsState, setBookingsState] = useState(() => bookings);
  const [eventsState] = useState(() => events);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [updatingBooking, setUpdatingBooking] = useState<string | null>(null);

  const [leadSearch, setLeadSearch] = useState("");
  const [leadCountry, setLeadCountry] = useState("all");
  const [leadFrom, setLeadFrom] = useState("");
  const [leadTo, setLeadTo] = useState("");

  const [bookingStatusFilter, setBookingStatusFilter] = useState<"all" | BookingStatus>("all");
  const [bookingFrom, setBookingFrom] = useState("");
  const [bookingTo, setBookingTo] = useState("");

  const [eventTypeFilter, setEventTypeFilter] = useState<"all" | EventType>("all");
  const [eventFrom, setEventFrom] = useState("");
  const [eventTo, setEventTo] = useState("");

  useEffect(() => {
    if (!feedback) return;
    const timer = window.setTimeout(() => setFeedback(null), 4000);
    return () => window.clearTimeout(timer);
  }, [feedback]);

  const countries = useMemo(
    () => Array.from(new Set(leadsState.map((lead) => lead.country))).sort(),
    [leadsState],
  );

  const filteredLeads = useMemo(() => {
    return leadsState.filter((lead) => {
      const createdAt = new Date(lead.createdAt);
      const matchesSearch = leadSearch
        ? [lead.name, lead.email, lead.country, lead.phone]
            .filter(Boolean)
            .some((value) => value.toLowerCase().includes(leadSearch.toLowerCase()))
        : true;

      const matchesCountry = leadCountry === "all" || lead.country === leadCountry;

      const matchesFrom = leadFrom ? createdAt >= new Date(`${leadFrom}T00:00:00`) : true;
      const matchesTo = leadTo ? createdAt <= new Date(`${leadTo}T23:59:59`) : true;

      return matchesSearch && matchesCountry && matchesFrom && matchesTo;
    });
  }, [leadSearch, leadCountry, leadFrom, leadTo, leadsState]);

  const filteredBookings = useMemo(() => {
    return bookingsState.filter((booking) => {
      const createdAt = new Date(booking.createdAt);
      const matchesStatus = bookingStatusFilter === "all" || booking.status === bookingStatusFilter;
      const matchesFrom = bookingFrom ? createdAt >= new Date(`${bookingFrom}T00:00:00`) : true;
      const matchesTo = bookingTo ? createdAt <= new Date(`${bookingTo}T23:59:59`) : true;
      return matchesStatus && matchesFrom && matchesTo;
    });
  }, [bookingsState, bookingStatusFilter, bookingFrom, bookingTo]);

  const filteredEvents = useMemo(() => {
    return eventsState.filter((event) => {
      const createdAt = new Date(event.createdAt);
      const matchesType = eventTypeFilter === "all" || event.type === eventTypeFilter;
      const matchesFrom = eventFrom ? createdAt >= new Date(`${eventFrom}T00:00:00`) : true;
      const matchesTo = eventTo ? createdAt <= new Date(`${eventTo}T23:59:59`) : true;
      return matchesType && matchesFrom && matchesTo;
    });
  }, [eventsState, eventTypeFilter, eventFrom, eventTo]);

  const handleExport = async (
    table: "leads" | "bookings" | "events",
    filters: { from?: string; to?: string },
  ) => {
    try {
      setIsExporting(true);
      const params = new URLSearchParams();
      if (filters.from) {
        params.set("from", new Date(`${filters.from}T00:00:00`).toISOString());
      }
      if (filters.to) {
        params.set("to", new Date(`${filters.to}T23:59:59`).toISOString());
      }

      const response = await fetch(`/api/export/${table}?${params.toString()}`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Export failed (${response.status})`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${table}-${new Date().toISOString().replace(/[:]/g, "-")}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);

      setFeedback({ type: "success", message: `Exported ${table} CSV.` });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Export failed";
      setFeedback({ type: "error", message });
    } finally {
      setIsExporting(false);
    }
  };

  const handleStatusChange = async (booking: BookingRecord, nextStatus: BookingStatus) => {
    if (booking.status === nextStatus) {
      return;
    }

    const allowed = BOOKING_STATUS_FLOW[booking.status] ?? [];
    if (!allowed.includes(nextStatus)) {
      setFeedback({
        type: "error",
        message: `Cannot move from ${STATUS_LABELS[booking.status]} to ${STATUS_LABELS[nextStatus]}.`,
      });
      return;
    }

    setUpdatingBooking(booking.id);

    try {
      const response = await fetch(`/api/booking/${booking.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!response.ok) {
        throw new Error(`Update failed (${response.status})`);
      }

      const data = (await response.json()) as { status?: BookingStatus };
      const updatedStatus = data.status ?? nextStatus;

      setBookingsState((current) =>
        current.map((item) =>
          item.id === booking.id
            ? {
                ...item,
                status: updatedStatus,
              }
            : item,
        ),
      );
      setFeedback({
        type: "success",
        message: `Booking status set to ${STATUS_LABELS[updatedStatus]}.`,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update booking";
      setFeedback({ type: "error", message });
    } finally {
      setUpdatingBooking(null);
    }
  };

  const updatePackageDraft = (id: string, updater: (draft: PackageDraft) => PackageDraft) => {
    setPackageDrafts((current) => ({
      ...current,
      [id]: updater(current[id] ?? buildPackageDraft(packagesState.find((pkg) => pkg.id === id)!)),
    }));
  };

  const handlePackageSubmit = async (pkg: PackageRecord) => {
    const draft = packageDrafts[pkg.id] ?? buildPackageDraft(pkg);
    const highlights = draft.highlights
      .split("\n")
      .map((value) => value.trim())
      .filter((value) => value.length > 0);

    const days = Number.parseInt(draft.days, 10);
    if (Number.isNaN(days) || days <= 0) {
      setFeedback({ type: "error", message: "Days must be a positive number." });
      return;
    }

    const priceFrom = draft.priceFrom.trim() === "" ? null : Number.parseInt(draft.priceFrom, 10);
    if (draft.priceFrom.trim() !== "" && (priceFrom === null || Number.isNaN(priceFrom) || priceFrom < 0)) {
      setFeedback({ type: "error", message: "Price from must be a positive number or blank." });
      return;
    }

    try {
      const response = await fetch(`/api/package/${pkg.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: draft.title.trim(),
          days,
          highlights,
          price_from: priceFrom,
          active: draft.active,
        }),
      });

      if (!response.ok) {
        throw new Error(`Update failed (${response.status})`);
      }

      const data = (await response.json()) as {
        package?: {
          id: string;
          slug: string;
          title: string;
          days: number;
          highlights: string[];
          price_from: number | null;
          active: boolean;
          created_at: string;
        };
      };

      if (!data.package) {
        throw new Error("Package update failed");
      }

      const updatedPkg: PackageRecord = {
        id: data.package.id,
        slug: data.package.slug,
        title: data.package.title,
        days: data.package.days,
        highlights: data.package.highlights,
        priceFrom: data.package.price_from ?? null,
        active: data.package.active,
        createdAt: data.package.created_at,
      };

      setPackagesState((current) => current.map((item) => (item.id === updatedPkg.id ? updatedPkg : item)));
      setPackageDrafts((current) => ({
        ...current,
        [pkg.id]: buildPackageDraft(updatedPkg),
      }));

      setFeedback({ type: "success", message: `Package “${updatedPkg.title}” saved.` });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update package";
      setFeedback({ type: "error", message });
    }
  };

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-deepgreen">Admin Dashboard</h1>
        <p className="text-sm text-slate/70">Monitor leads, bookings, events, and manage packages.</p>
      </header>

      {feedback && (
        <div
          role="status"
          className={`rounded-lg border px-4 py-3 text-sm font-medium ${
            feedback.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-rose-200 bg-rose-50 text-rose-800"
          }`}
        >
          {feedback.message}
        </div>
      )}

      <nav className="flex flex-wrap gap-3">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
              activeTab === tab.id
                ? "bg-deepgreen text-white focus-visible:ring-deepgreen/40"
                : "bg-sand text-deepgreen hover:bg-sand/80 focus-visible:ring-deepgreen/20"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {activeTab === "leads" && (
        <section className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            <label className="flex flex-col text-xs font-semibold uppercase tracking-wide text-slate/70">
              Search
              <input
                type="search"
                value={leadSearch}
                onChange={(event) => setLeadSearch(event.target.value)}
                placeholder="Name, email, or phone"
                className="mt-2 rounded-lg border border-sand-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-deepgreen focus:outline-none focus:ring-2 focus:ring-deepgreen/30"
              />
            </label>
            <label className="flex flex-col text-xs font-semibold uppercase tracking-wide text-slate/70">
              Country
              <select
                value={leadCountry}
                onChange={(event) => setLeadCountry(event.target.value)}
                className="mt-2 rounded-lg border border-sand-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-deepgreen focus:outline-none focus:ring-2 focus:ring-deepgreen/30"
              >
                <option value="all">All countries</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col text-xs font-semibold uppercase tracking-wide text-slate/70">
              From
              <input
                type="date"
                value={leadFrom}
                onChange={(event) => setLeadFrom(event.target.value)}
                className="mt-2 rounded-lg border border-sand-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-deepgreen focus:outline-none focus:ring-2 focus:ring-deepgreen/30"
              />
            </label>
            <label className="flex flex-col text-xs font-semibold uppercase tracking-wide text-slate/70">
              To
              <input
                type="date"
                value={leadTo}
                onChange={(event) => setLeadTo(event.target.value)}
                className="mt-2 rounded-lg border border-sand-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-deepgreen focus:outline-none focus:ring-2 focus:ring-deepgreen/30"
              />
            </label>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate/70">
              Showing <span className="font-semibold text-deepgreen">{filteredLeads.length}</span> of {" "}
              {leadsState.length} leads
            </p>
            <button
              type="button"
              onClick={() => handleExport("leads", { from: leadFrom || undefined, to: leadTo || undefined })}
              disabled={isExporting}
              className="inline-flex items-center gap-2 rounded-lg bg-deepgreen px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-deepgreen/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deepgreen/40 disabled:cursor-not-allowed disabled:bg-deepgreen/40"
            >
              Export CSV
            </button>
          </div>

          <div className="space-y-4">
            <div className="overflow-x-auto rounded-xl border border-sand-200 bg-white shadow-sm">
              <table className="hidden min-w-full divide-y divide-sand-200 md:table">
                <thead className="bg-sand/40 text-left text-xs font-semibold uppercase tracking-wide text-slate/70">
                  <tr>
                    <th scope="col" className="px-4 py-3">Name</th>
                    <th scope="col" className="px-4 py-3">Email</th>
                    <th scope="col" className="px-4 py-3">Phone</th>
                    <th scope="col" className="px-4 py-3">Country</th>
                    <th scope="col" className="px-4 py-3">Travel Window</th>
                    <th scope="col" className="px-4 py-3">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand-100 text-sm text-slate/90">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id}>
                      <td className="px-4 py-3 font-medium text-deepgreen">{lead.name}</td>
                      <td className="px-4 py-3">
                        <a
                          className="text-deepgreen underline decoration-deepgreen/40 decoration-dashed hover:text-deepgreen/80"
                          href={`mailto:${lead.email}`}
                        >
                          {lead.email}
                        </a>
                      </td>
                      <td className="px-4 py-3">
                        <a className="text-slate/80" href={`tel:${lead.phone}`}>
                          {lead.phone}
                        </a>
                      </td>
                      <td className="px-4 py-3">{lead.country}</td>
                      <td className="px-4 py-3">{lead.travelWindow}</td>
                      <td className="px-4 py-3 text-xs text-slate/60">
                        {new Date(lead.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-3 md:hidden">
              {filteredLeads.map((lead) => (
                <article key={lead.id} className="rounded-xl border border-sand-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-deepgreen">{lead.name}</h3>
                    <time className="text-xs text-slate/60" dateTime={lead.createdAt}>
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </time>
                  </div>
                  <dl className="mt-3 space-y-1 text-sm text-slate/80">
                    <div className="flex justify-between gap-2">
                      <dt className="font-medium">Email</dt>
                      <dd>
                        <a className="text-deepgreen" href={`mailto:${lead.email}`}>
                          {lead.email}
                        </a>
                      </dd>
                    </div>
                    <div className="flex justify-between gap-2">
                      <dt className="font-medium">Phone</dt>
                      <dd>
                        <a className="text-deepgreen" href={`tel:${lead.phone}`}>
                          {lead.phone}
                        </a>
                      </dd>
                    </div>
                    <div className="flex justify-between gap-2">
                      <dt className="font-medium">Country</dt>
                      <dd>{lead.country}</dd>
                    </div>
                    <div className="flex justify-between gap-2">
                      <dt className="font-medium">Travel Window</dt>
                      <dd>{lead.travelWindow}</dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {activeTab === "bookings" && (
        <section className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            <label className="flex flex-col text-xs font-semibold uppercase tracking-wide text-slate/70">
              Status
              <select
                value={bookingStatusFilter}
                onChange={(event) =>
                  setBookingStatusFilter(event.target.value === "all" ? "all" : (event.target.value as BookingStatus))
                }
                className="mt-2 rounded-lg border border-sand-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-deepgreen focus:outline-none focus:ring-2 focus:ring-deepgreen/30"
              >
                <option value="all">All statuses</option>
                {(Object.keys(STATUS_LABELS) as BookingStatus[]).map((status) => (
                  <option key={status} value={status}>
                    {STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col text-xs font-semibold uppercase tracking-wide text-slate/70">
              From
              <input
                type="date"
                value={bookingFrom}
                onChange={(event) => setBookingFrom(event.target.value)}
                className="mt-2 rounded-lg border border-sand-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-deepgreen focus:outline-none focus:ring-2 focus:ring-deepgreen/30"
              />
            </label>
            <label className="flex flex-col text-xs font-semibold uppercase tracking-wide text-slate/70">
              To
              <input
                type="date"
                value={bookingTo}
                onChange={(event) => setBookingTo(event.target.value)}
                className="mt-2 rounded-lg border border-sand-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-deepgreen focus:outline-none focus:ring-2 focus:ring-deepgreen/30"
              />
            </label>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate/70">
              Showing <span className="font-semibold text-deepgreen">{filteredBookings.length}</span> of {" "}
              {bookingsState.length} bookings
            </p>
            <button
              type="button"
              onClick={() => handleExport("bookings", { from: bookingFrom || undefined, to: bookingTo || undefined })}
              disabled={isExporting}
              className="inline-flex items-center gap-2 rounded-lg bg-deepgreen px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-deepgreen/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deepgreen/40 disabled:cursor-not-allowed disabled:bg-deepgreen/40"
            >
              Export CSV
            </button>
          </div>

          <div className="space-y-4">
            <div className="overflow-x-auto rounded-xl border border-sand-200 bg-white shadow-sm">
              <table className="hidden min-w-full divide-y divide-sand-200 md:table">
                <thead className="bg-sand/40 text-left text-xs font-semibold uppercase tracking-wide text-slate/70">
                  <tr>
                    <th scope="col" className="px-4 py-3">Lead</th>
                    <th scope="col" className="px-4 py-3">Package</th>
                    <th scope="col" className="px-4 py-3">Estimate</th>
                    <th scope="col" className="px-4 py-3">Status</th>
                    <th scope="col" className="px-4 py-3">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand-100 text-sm text-slate/90">
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="font-semibold text-deepgreen">{booking.leadName || "Lead"}</span>
                          <span className="text-xs text-slate/60">{booking.leadEmail}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span>{booking.packageTitle || "—"}</span>
                          <span className="text-xs text-slate/60">{booking.leadCountry}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">{formatCurrency(booking.amountEstimate)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[booking.status]}`}>
                            {STATUS_LABELS[booking.status]}
                          </span>
                          <select
                            value={booking.status}
                            onChange={(event) =>
                              handleStatusChange(booking, event.target.value as BookingStatus)
                            }
                            disabled={updatingBooking === booking.id}
                            className="rounded-lg border border-sand-200 bg-white px-2 py-1 text-xs focus:border-deepgreen focus:outline-none focus:ring-2 focus:ring-deepgreen/30 disabled:cursor-not-allowed"
                          >
                            <option value={booking.status}>Update…</option>
                            {(BOOKING_STATUS_FLOW[booking.status] ?? []).map((status) => (
                              <option key={status} value={status}>
                                {STATUS_LABELS[status]}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate/60">
                        {new Date(booking.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-3 md:hidden">
              {filteredBookings.map((booking) => (
                <article key={booking.id} className="rounded-xl border border-sand-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-deepgreen">{booking.leadName || "Lead"}</h3>
                      <p className="text-xs text-slate/60">{booking.leadEmail}</p>
                    </div>
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[booking.status]}`}>
                      {STATUS_LABELS[booking.status]}
                    </span>
                  </div>
                  <dl className="mt-3 space-y-1 text-sm text-slate/80">
                    <div className="flex justify-between gap-2">
                      <dt className="font-medium">Package</dt>
                      <dd className="text-right">{booking.packageTitle || "—"}</dd>
                    </div>
                    <div className="flex justify-between gap-2">
                      <dt className="font-medium">Estimate</dt>
                      <dd>{formatCurrency(booking.amountEstimate)}</dd>
                    </div>
                    <div className="flex justify-between gap-2">
                      <dt className="font-medium">Created</dt>
                      <dd>{new Date(booking.createdAt).toLocaleDateString()}</dd>
                    </div>
                  </dl>
                  {(BOOKING_STATUS_FLOW[booking.status] ?? []).length > 0 && (
                    <div className="mt-3">
                      <label className="text-xs font-semibold uppercase tracking-wide text-slate/70">
                        Move to
                        <select
                          value={booking.status}
                          onChange={(event) =>
                            handleStatusChange(booking, event.target.value as BookingStatus)
                          }
                          disabled={updatingBooking === booking.id}
                          className="mt-1 w-full rounded-lg border border-sand-200 bg-white px-2 py-1 text-sm focus:border-deepgreen focus:outline-none focus:ring-2 focus:ring-deepgreen/30 disabled:cursor-not-allowed"
                        >
                          <option value={booking.status}>Select status</option>
                          {(BOOKING_STATUS_FLOW[booking.status] ?? []).map((status) => (
                            <option key={status} value={status}>
                              {STATUS_LABELS[status]}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {activeTab === "events" && (
        <section className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            <label className="flex flex-col text-xs font-semibold uppercase tracking-wide text-slate/70">
              Type
              <select
                value={eventTypeFilter}
                onChange={(event) =>
                  setEventTypeFilter(event.target.value === "all" ? "all" : (event.target.value as EventType))
                }
                className="mt-2 rounded-lg border border-sand-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-deepgreen focus:outline-none focus:ring-2 focus:ring-deepgreen/30"
              >
                <option value="all">All events</option>
                {(Object.keys(EVENT_LABELS) as EventType[]).map((type) => (
                  <option key={type} value={type}>
                    {EVENT_LABELS[type]}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col text-xs font-semibold uppercase tracking-wide text-slate/70">
              From
              <input
                type="date"
                value={eventFrom}
                onChange={(event) => setEventFrom(event.target.value)}
                className="mt-2 rounded-lg border border-sand-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-deepgreen focus:outline-none focus:ring-2 focus:ring-deepgreen/30"
              />
            </label>
            <label className="flex flex-col text-xs font-semibold uppercase tracking-wide text-slate/70">
              To
              <input
                type="date"
                value={eventTo}
                onChange={(event) => setEventTo(event.target.value)}
                className="mt-2 rounded-lg border border-sand-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-deepgreen focus:outline-none focus:ring-2 focus:ring-deepgreen/30"
              />
            </label>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate/70">
              Showing <span className="font-semibold text-deepgreen">{filteredEvents.length}</span> of {" "}
              {eventsState.length} events
            </p>
            <button
              type="button"
              onClick={() => handleExport("events", { from: eventFrom || undefined, to: eventTo || undefined })}
              disabled={isExporting}
              className="inline-flex items-center gap-2 rounded-lg bg-deepgreen px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-deepgreen/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deepgreen/40 disabled:cursor-not-allowed disabled:bg-deepgreen/40"
            >
              Export CSV
            </button>
          </div>

          <div className="space-y-4">
            <div className="overflow-x-auto rounded-xl border border-sand-200 bg-white shadow-sm">
              <table className="hidden min-w-full divide-y divide-sand-200 md:table">
                <thead className="bg-sand/40 text-left text-xs font-semibold uppercase tracking-wide text-slate/70">
                  <tr>
                    <th scope="col" className="px-4 py-3">Type</th>
                    <th scope="col" className="px-4 py-3">Path</th>
                    <th scope="col" className="px-4 py-3">Session</th>
                    <th scope="col" className="px-4 py-3">Meta</th>
                    <th scope="col" className="px-4 py-3">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand-100 text-sm text-slate/90">
                  {filteredEvents.map((event) => (
                    <tr key={event.id}>
                      <td className="px-4 py-3 font-semibold text-deepgreen">{EVENT_LABELS[event.type]}</td>
                      <td className="px-4 py-3">{event.path}</td>
                      <td className="px-4 py-3 text-xs text-slate/60">{event.sessionId}</td>
                      <td className="px-4 py-3 text-xs text-slate/60">{parseJsonSnippet(event.meta)}</td>
                      <td className="px-4 py-3 text-xs text-slate/60">
                        {new Date(event.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-3 md:hidden">
              {filteredEvents.map((event) => (
                <article key={event.id} className="rounded-xl border border-sand-200 bg-white p-4 shadow-sm">
                  <header className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-deepgreen">{EVENT_LABELS[event.type]}</h3>
                    <time className="text-xs text-slate/60" dateTime={event.createdAt}>
                      {new Date(event.createdAt).toLocaleTimeString()}
                    </time>
                  </header>
                  <p className="mt-2 text-sm text-slate/80">{event.path}</p>
                  {(() => {
                    const snippet = parseJsonSnippet(event.meta);
                    return snippet ? (
                      <p className="mt-2 text-xs text-slate/60">{snippet}</p>
                    ) : null;
                  })()}
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {activeTab === "packages" && (
        <section className="space-y-6">
          {viewerRole === "viewer" && (
            <div className="rounded-lg border border-sand-200 bg-sand/30 px-4 py-3 text-sm text-slate/70">
              You do not have permission to edit packages.
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            {packagesState.map((pkg) => {
              const draft = packageDrafts[pkg.id] ?? buildPackageDraft(pkg);
              return (
                <article key={pkg.id} className="flex h-full flex-col rounded-xl border border-sand-200 bg-white p-5 shadow-sm">
                  <header className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-deepgreen">{pkg.title}</h3>
                      <p className="text-xs uppercase tracking-wide text-slate/60">Slug: {pkg.slug}</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-semibold text-slate/70">Active</span>
                      <input
                        type="checkbox"
                        checked={draft.active}
                        onChange={(event) =>
                          updatePackageDraft(pkg.id, (current) => ({
                            ...current,
                            active: event.target.checked,
                          }))
                        }
                        disabled={viewerRole === "viewer"}
                        className="h-4 w-4 rounded border-sand-300 text-deepgreen focus:ring-deepgreen/40 disabled:cursor-not-allowed"
                      />
                    </div>
                  </header>

                  <div className="mt-4 space-y-4 text-sm">
                    <label className="block text-xs font-semibold uppercase tracking-wide text-slate/70">
                      Title
                      <input
                        type="text"
                        value={draft.title}
                        onChange={(event) =>
                          updatePackageDraft(pkg.id, (current) => ({
                            ...current,
                            title: event.target.value,
                          }))
                        }
                        disabled={viewerRole !== "admin"}
                        className="mt-2 w-full rounded-lg border border-sand-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-deepgreen focus:outline-none focus:ring-2 focus:ring-deepgreen/30 disabled:cursor-not-allowed"
                      />
                    </label>
                    <div className="grid gap-4 md:grid-cols-2">
                      <label className="block text-xs font-semibold uppercase tracking-wide text-slate/70">
                        Days
                        <input
                          type="number"
                          min={1}
                          value={draft.days}
                          onChange={(event) =>
                            updatePackageDraft(pkg.id, (current) => ({
                              ...current,
                              days: event.target.value,
                            }))
                          }
                          disabled={viewerRole === "viewer"}
                          className="mt-2 w-full rounded-lg border border-sand-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-deepgreen focus:outline-none focus:ring-2 focus:ring-deepgreen/30 disabled:cursor-not-allowed"
                        />
                      </label>
                      <label className="block text-xs font-semibold uppercase tracking-wide text-slate/70">
                        Price From (INR)
                        <input
                          type="number"
                          min={0}
                          step={1000}
                          value={draft.priceFrom}
                          onChange={(event) =>
                            updatePackageDraft(pkg.id, (current) => ({
                              ...current,
                              priceFrom: event.target.value,
                            }))
                          }
                          disabled={viewerRole === "viewer"}
                          className="mt-2 w-full rounded-lg border border-sand-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-deepgreen focus:outline-none focus:ring-2 focus:ring-deepgreen/30 disabled:cursor-not-allowed"
                        />
                      </label>
                    </div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-slate/70">
                      Highlights (one per line)
                      <textarea
                        value={draft.highlights}
                        onChange={(event) =>
                          updatePackageDraft(pkg.id, (current) => ({
                            ...current,
                            highlights: event.target.value,
                          }))
                        }
                        rows={5}
                        disabled={viewerRole === "viewer"}
                        className="mt-2 w-full rounded-lg border border-sand-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-deepgreen focus:outline-none focus:ring-2 focus:ring-deepgreen/30 disabled:cursor-not-allowed"
                      />
                    </label>
                  </div>

                  <div className="mt-auto flex justify-end pt-4">
                    <button
                      type="button"
                      onClick={() => handlePackageSubmit(pkg)}
                      disabled={viewerRole === "viewer"}
                      className="inline-flex items-center gap-2 rounded-lg bg-deepgreen px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-deepgreen/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deepgreen/40 disabled:cursor-not-allowed disabled:bg-deepgreen/30"
                    >
                      Save changes
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};
