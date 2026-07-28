import type { Timezone } from "@/types/temperature";

export const MAX_READINGS = 50;

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
