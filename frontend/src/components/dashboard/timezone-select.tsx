"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TIMEZONE_OPTIONS } from "@/constants/temperature-constant";
import type { Timezone } from "@/types/temperature";

type TimezoneSelectProps = {
  value: Timezone;
  onChange: (timezone: Timezone) => void;
};

export function TimezoneSelect({ value, onChange }: TimezoneSelectProps) {
  return (
    <Select
      value={value}
      onValueChange={(nextValue) => onChange(nextValue as Timezone)}
    >
      <SelectTrigger className="w-full sm:w-56">
        <SelectValue placeholder="Select timezone" />
      </SelectTrigger>

      <SelectContent>
        {TIMEZONE_OPTIONS.map((timezone) => (
          <SelectItem key={timezone.value} value={timezone.value}>
            {timezone.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
