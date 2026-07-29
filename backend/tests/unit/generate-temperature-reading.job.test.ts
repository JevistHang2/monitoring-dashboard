import { describe, expect, it, vi, beforeEach } from "vitest";
import { generateMockTemperatureReading } from "../../src/services/mock-temperature.service.js";
import { createTemperatureReading } from "../../src/services/temperature-reading.service.js";
import { broadcastNewTemperatureReading } from "../../src/sockets/socket.js";
import { generateAndBroadcastTemperatureReading } from "../../src/jobs/generate-temperature-reading.job.js";

vi.mock("../../src/services/mock-temperature.service.js", () => ({
  generateMockTemperatureReading: vi.fn(),
}));

vi.mock("../../src/services/temperature-reading.service.js", () => ({
  createTemperatureReading: vi.fn(),
}));

vi.mock("../../src/sockets/socket.js", () => ({
  broadcastNewTemperatureReading: vi.fn(),
}));

describe("generateAndBroadcastTemperatureReading", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates and broadcasts a saved temperature reading", async () => {
    const input = {
      created_at: new Date("2026-07-30T10:00:00.000Z"),
      value: 72,
    };

    const savedReading = {
      created_at: "2026-07-30T10:00:00.000Z",
      value: 72,
    };

    vi.mocked(generateMockTemperatureReading).mockReturnValue(input);
    vi.mocked(createTemperatureReading).mockResolvedValue(savedReading);

    await expect(generateAndBroadcastTemperatureReading()).resolves.toEqual(
      savedReading,
    );

    expect(generateMockTemperatureReading).toHaveBeenCalledOnce();
    expect(createTemperatureReading).toHaveBeenCalledWith(input);
    expect(broadcastNewTemperatureReading).toHaveBeenCalledWith(savedReading);
  });

  it("does not broadcast when creating the reading fails", async () => {
    const input = {
      created_at: new Date("2026-07-30T10:00:00.000Z"),
      value: 72,
    };

    const error = new Error("Database insert failed");

    vi.mocked(generateMockTemperatureReading).mockReturnValue(input);
    vi.mocked(createTemperatureReading).mockRejectedValue(error);

    await expect(generateAndBroadcastTemperatureReading()).rejects.toThrow(
      "Database insert failed",
    );

    expect(generateMockTemperatureReading).toHaveBeenCalledOnce();
    expect(createTemperatureReading).toHaveBeenCalledWith(input);
    expect(broadcastNewTemperatureReading).not.toHaveBeenCalled();
  });
});
