"use client";

import { useState } from "react";

import { ConnectionStatus } from "@/components/dashboard/connection-status";
import { TimezoneSelect } from "@/components/dashboard/timezone-select";
import type { Timezone } from "@/types/temperature";
import { DEFAULT_TIMEZONE } from "@/constants/temperature-constant";

export function DashboardToolbar() {
  const [timezone, setTimezone] = useState<Timezone>(DEFAULT_TIMEZONE);

  return (
    <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
      <ConnectionStatus status="disconnected" />
      <TimezoneSelect value={timezone} onChange={setTimezone} />
    </div>
  );
}
