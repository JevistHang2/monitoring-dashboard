import type { Timezone } from "@/types/temperature";

export function formatReadingTime(
  utcTimeStamp: string,
  timezone: Timezone,
): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(utcTimeStamp));
}

export function formatReadingDateTime(
  utcTimeStamp: string,
  timezone: Timezone,
): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(new Date(utcTimeStamp));
}
