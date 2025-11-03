import assert from "node:assert/strict";
import { describe, test } from "node:test";
import {
  bookingSchema,
  bookingStatusSchema,
  eventSchema,
  leadSchema,
  packageUpdateSchema,
} from "../validators/api";

const validEvent = {
  type: "page_view" as const,
  path: "/packages/italy",
  sessionId: "abc-123",
  meta: {
    utm: { source: "facebook" },
  },
};

describe("validators", () => {
  test("event schema accepts valid payload", () => {
    const result = eventSchema.safeParse(validEvent);
    assert.equal(result.success, true);
  });

  test("event schema rejects unknown event type", () => {
    const result = eventSchema.safeParse({ ...validEvent, type: "unknown" });
    assert.equal(result.success, false);
  });

  test("lead schema requires email and phone", () => {
    const result = leadSchema.safeParse({
      name: "Asha",
      email: "asha@example.com",
      phone: "+919999999999",
      country: "India",
      travel_window: "May 2025",
    });
    assert.equal(result.success, true);

    const invalid = leadSchema.safeParse({
      name: "Asha",
      phone: "+919999999999",
      country: "India",
      travel_window: "May 2025",
    });
    assert.equal(invalid.success, false);
  });

  test("booking schema validates optional fields", () => {
    const result = bookingSchema.safeParse({
      lead_id: "3b3f6d0f-5c3f-4b1d-8f1b-4d9526d7575c",
      package_id: "9036720b-0889-4df4-9fa5-ec75621d9c1c",
      amount_estimate: 250000,
    });
    assert.equal(result.success, true);
  });

  test("booking status schema enforces pipeline", () => {
    const valid = bookingStatusSchema.safeParse({ status: "consulting" });
    assert.equal(valid.success, true);

    const invalid = bookingStatusSchema.safeParse({ status: "pending" });
    assert.equal(invalid.success, false);
  });

  test("package update schema requires highlights", () => {
    const result = packageUpdateSchema.safeParse({
      title: "Switzerland Alpine Icons",
      days: 7,
      highlights: ["Glacier Express", "Jungfraujoch"],
      price_from: 249900,
      active: true,
    });
    assert.equal(result.success, true);

    const invalid = packageUpdateSchema.safeParse({
      title: "Invalid",
      days: 0,
      highlights: [],
    });
    assert.equal(invalid.success, false);
  });
});
