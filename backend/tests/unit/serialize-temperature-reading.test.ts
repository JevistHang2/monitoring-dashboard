import { describe, expect, it } from "vitest";
import { serializeTemperatureReading } from "../../src/utils/serialize-temperature-reading.js";
import type { TemperatureReading } from "../../src/models/temperature-reading.model.js";

describe("serializeTemperatureReading", () => {
  it("converts created_at Date to UTC ISO string", () => {
    const reading: TemperatureReading = {
      created_at: new Date("2026-07-29T10:00:00.000Z"),
      value: 72,
    };

    expect(serializeTemperatureReading(reading)).toEqual({
      created_at: "2026-07-29T10:00:00.000Z",
      value: 72,
    });
  });
});
