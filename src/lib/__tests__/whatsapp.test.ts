import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { DEFAULT_WA_TEXT, buildWaLink, mergeWaUtm } from "../whatsapp";

describe("buildWaLink", () => {
  it("sanitizes the phone number before building the link", () => {
    const href = buildWaLink("+91 123-456-7890");
    const url = new URL(href);

    assert.equal(url.origin, "https://wa.me");
    assert.equal(url.pathname, "/911234567890");
  });

  it("defaults the message when no text is provided", () => {
    const url = new URL(buildWaLink("91XXXXXXXXXX"));

    assert.equal(url.searchParams.get("text"), DEFAULT_WA_TEXT);
  });

  it("trims the provided message", () => {
    const url = new URL(buildWaLink("91XXXXXXXXXX", "  Custom message "));

    assert.equal(url.searchParams.get("text"), "Custom message");
  });

  it("merges default and custom utm parameters", () => {
    const url = new URL(
      buildWaLink("91XXXXXXXXXX", "Hello", {
        utm_medium: "button",
        utm_content: "hero",
      }),
    );

    assert.equal(url.searchParams.get("utm_source"), "site");
    assert.equal(url.searchParams.get("utm_medium"), "button");
    assert.equal(url.searchParams.get("utm_campaign"), "whatsapp");
    assert.equal(url.searchParams.get("utm_content"), "hero");
  });

  it("filters out undefined utm values", () => {
    const url = new URL(
      buildWaLink("91XXXXXXXXXX", DEFAULT_WA_TEXT, {
        utm_content: undefined,
        click_id: 12345,
      }),
    );

    assert.equal(url.searchParams.has("utm_content"), false);
    assert.equal(url.searchParams.get("click_id"), "12345");
  });
});

describe("mergeWaUtm", () => {
  it("prioritizes provided utm values over defaults", () => {
    const merged = mergeWaUtm({
      utm_source: "newsletter",
      extra: "cta",
    });

    assert.equal(merged.utm_source, "newsletter");
    assert.equal(merged.utm_medium, "cta");
    assert.equal(merged.utm_campaign, "whatsapp");
    assert.equal(merged.extra, "cta");
  });
});
