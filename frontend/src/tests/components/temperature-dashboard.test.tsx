import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { TemperatureDashboard } from "@/components/dashboard/temperature-dashboard";
import type { TemperatureReading } from "@/types/temperature";

type SocketHandler = (...args: unknown[]) => void;

const socketHandlers = new Map<string, SocketHandler>();
const socketIoHandlers = new Map<string, SocketHandler>();

vi.mock("@/lib/socket", () => ({
  createSocket: () => ({
    on: (event: string, handler: SocketHandler) => {
      socketHandlers.set(event, handler);
    },
    off: (event: string) => {
      socketHandlers.delete(event);
    },
    disconnect: vi.fn(),
    io: {
      on: (event: string, handler: SocketHandler) => {
        socketIoHandlers.set(event, handler);
      },
      off: (event: string) => {
        socketIoHandlers.delete(event);
      },
    },
  }),
}));

vi.mock("@/components/dashboard/temperature-line-chart", () => ({
  TemperatureLineChart: ({ readings }: { readings: TemperatureReading[] }) => (
    <div data-testid="line-chart">Line chart readings: {readings.length}</div>
  ),
}));

vi.mock("@/components/dashboard/temperature-bar-chart", () => ({
  TemperatureBarChart: ({ readings }: { readings: TemperatureReading[] }) => (
    <div data-testid="bar-chart">Bar chart readings: {readings.length}</div>
  ),
}));

describe("TemperatureDashboard", () => {
  const initialReadings: TemperatureReading[] = [
    {
      created_at: "2026-07-27T10:00:00.000Z",
      value: 24.7,
    },
  ];

  beforeEach(() => {
    socketHandlers.clear();
    socketIoHandlers.clear();
  });

  it("updates displayed timestamps when the timezone changes", async () => {
    const user = userEvent.setup();

    render(<TemperatureDashboard initialReadings={initialReadings} />);

    expect(screen.getByText(/05:00:00 PM/)).toBeInTheDocument();

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByText("Singapore"));

    expect(screen.getByText(/06:00:00 PM/)).toBeInTheDocument();
  });

  it("appends a new reading when Socket.IO receives new-data", () => {
    render(<TemperatureDashboard initialReadings={initialReadings} />);

    expect(screen.getAllByText("24.7 °C").length).toBeGreaterThan(0);
    expect(screen.getByTestId("line-chart")).toHaveTextContent(
      "Line chart readings: 1",
    );

    act(() => {
      socketHandlers.get("new-data")?.({
        created_at: "2026-07-27T10:00:05.000Z",
        value: 25.1,
      });
    });

    expect(screen.getAllByText("25.1 °C").length).toBeGreaterThan(0);
    expect(screen.getByTestId("line-chart")).toHaveTextContent(
      "Line chart readings: 2",
    );
    expect(screen.getByTestId("bar-chart")).toHaveTextContent(
      "Bar chart readings: 2",
    );
  });
});
