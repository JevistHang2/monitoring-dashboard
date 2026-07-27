export type NewTemperatureReadingInput = {
  created_at: Date;
  value: number;
};

const MIN_TEMPERATURE = -10;
const MAX_TEMPERATURE = 45;

export function generateMockTemperatureReading(
  now = new Date(),
  random = Math.random,
): NewTemperatureReadingInput {
  const range = MAX_TEMPERATURE - MIN_TEMPERATURE;
  const rawValue = MIN_TEMPERATURE + random() * range;
  const value = Math.round(rawValue * 10) / 10;

  return {
    created_at: now,
    value,
  };
}
