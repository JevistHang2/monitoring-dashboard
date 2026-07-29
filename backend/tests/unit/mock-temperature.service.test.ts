import { describe, expect, it } from "vitest";
import { generateMockTemperatureReading } from "../../src/services/mock-temperature.service.js";

describe("generateMockTemperatureReading", () => {
  it("returns the provided timestamp", () => {
    const now = new Date();

    const reading = generateMockTemperatureReading(now);

    expect(reading.created_at).toBe(now);
  });

  it("generates the minimum value when random returns 0", () => {
    const reading = generateMockTemperatureReading(
      new Date("2026-07-29T10:00:00.000Z"),
      () => 0,
    );

    expect(reading.value).toBe(1);
  });

  it("generates a value close to the maximum when random returns almost 1", () => {
    const reading = generateMockTemperatureReading(
      new Date("2026-07-29T10:00:00.000Z"),
      () => 0.999,
    );

    expect(reading.value).toBeGreaterThanOrEqual(1);
    expect(reading.value).toBeLessThanOrEqual(100);
  });

  it("rounds the value to one decimal place", () => {
    const reading = generateMockTemperatureReading(
      new Date("2026-07-29T10:00:00.000Z"),
      () => 0.12345,
    );

    expect(Number.isInteger(reading.value * 10)).toBe(true);
  });
});
