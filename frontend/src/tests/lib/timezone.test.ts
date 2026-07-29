import { describe, expect, it } from "vitest";

import { formatReadingDateTime, formatReadingTime } from "@/lib/timezone";

describe("timezone formatting", () => {
  const utcTimestamp = "2026-07-27T10:00:00.000Z";

  it("formats time for Asia/Jakarta", () => {
    expect(formatReadingTime(utcTimestamp, "Asia/Jakarta")).toBe("05:00:00 PM");
  });

  it("formats time for Asia/Singapore", () => {
    expect(formatReadingTime(utcTimestamp, "Asia/Singapore")).toBe(
      "06:00:00 PM",
    );
  });

  it("formats time for Australia/Sydney", () => {
    expect(formatReadingTime(utcTimestamp, "Australia/Sydney")).toBe(
      "08:00:00 PM",
    );
  });

  it("formats date and time for the selected timezone", () => {
    expect(formatReadingDateTime(utcTimestamp, "Asia/Jakarta")).toContain(
      "Jul 27, 2026",
    );
  });
});
