import { describe, expect, it } from "vitest";

import { formatTemperature } from "@/lib/temperature-format";

describe("formatTemperature", () => {
  it("returns a placeholder when the value is null", () => {
    expect(formatTemperature(null)).toBe("-- °C");
  });

  it("formats a temperature value with one decimal place", () => {
    expect(formatTemperature(24.66)).toBe("24.7 °C");
  });

  it("keeps one decimal place for whole numbers", () => {
    expect(formatTemperature(25)).toBe("25.0 °C");
  });
});
