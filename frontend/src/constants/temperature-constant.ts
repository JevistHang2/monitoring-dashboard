import type { SocketConnectionStatus, Timezone } from "@/types/temperature";

export const MAX_READINGS = 50;

export const DEFAULT_TIMEZONE: Timezone = "Asia/Jakarta";

export const TIMEZONE_OPTIONS: Array<{
  label: string;
  value: Timezone;
}> = [
  {
    label: "Indonesia / Jakarta",
    value: "Asia/Jakarta",
  },
  {
    label: "Singapore",
    value: "Asia/Singapore",
  },
  {
    label: "Australia / Sydney",
    value: "Australia/Sydney",
  },
];

export const SOCKET_CONNECTION_STATUS_LABEL: Record<
  SocketConnectionStatus,
  string
> = {
  connected: "Connected",
  disconnected: "Disconnected",
  reconnecting: "Reconnecting",
};

export const SOCKET_CONNECTION_STATUS_CLASS_NAME: Record<
  SocketConnectionStatus,
  string
> = {
  connected: "border-emerald-200 bg-emerald-50 text-emerald-700",
  disconnected: "border-red-200 bg-red-50 text-red-700",
  reconnecting: "border-amber-200 bg-amber-50 text-amber-700",
};
