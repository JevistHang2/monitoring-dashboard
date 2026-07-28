export type TemperatureReading = {
  created_at: string;
  value: number;
};

export type Timezone = "Asia/Jakarta" | "Asia/Singapore" | "Australia/Sydney";

export type SocketConnectionStatus =
  "connected" | "disconnected" | "reconnecting";
