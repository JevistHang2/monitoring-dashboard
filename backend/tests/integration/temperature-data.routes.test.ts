import request from "supertest";
import { describe, expect, it, vi } from "vitest";
import { app } from "../../src/app.js";
import { getLatestTemperatureReadings } from "../../src/services/temperature-reading.service.js";

vi.mock("../../src/services/temperature-reading.service.js", () => {
  return {
    getLatestTemperatureReadings: vi.fn(),
  };
});

describe("GET /api/data", () => {
  it("returns temperature readings with UTC timestamps", async () => {
    vi.mocked(getLatestTemperatureReadings).mockResolvedValue([
      {
        created_at: "2026-07-29T10:00:00.000Z",
        value: 72,
      },
    ]);

    const response = await request(app).get("/api/data");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: "Temperature readings fetched successfully",
      code: 200,
      data: [
        {
          created_at: "2026-07-29T10:00:00.000Z",
          value: 72,
        },
      ],
    });
  });
});
