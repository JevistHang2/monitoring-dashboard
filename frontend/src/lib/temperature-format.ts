export function formatTemperature(value: number | null): string {
  if (value === null) {
    return "-- °C";
  }

  return `${value.toFixed(1)} °C`;
}
