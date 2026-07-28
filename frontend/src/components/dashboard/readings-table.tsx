import { EmptyState } from "@/components/feedback/empty-state";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatReadingDateTime } from "@/lib/timezone";
import type { TemperatureReading, Timezone } from "@/types/temperature";

import { MAX_READINGS } from "@/constants/temperature-constant";

type ReadingsTableProps = {
  readings: TemperatureReading[];
  timezone: Timezone;
};

export function ReadingsTable({ readings, timezone }: ReadingsTableProps) {
  if (readings.length === 0) {
    return (
      <div className="p-4">
        <EmptyState
          title="No readings yet"
          message="Temperature readings will appear here after the backend generates data."
        />
      </div>
    );
  }

  const visibleReadings = readings.slice(-MAX_READINGS).reverse();

  return (
    <div className="overflow-hidden">
      <div className="border-b p-4">
        <h2 className="text-lg font-semibold">Recent Readings</h2>
        <p className="text-sm text-muted-foreground">
          Timestamps are stored in UTC and displayed in the selected timezone.
        </p>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead className="text-right">Temperature</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {visibleReadings.map((reading, index) => (
              <TableRow key={`${reading.created_at}-${index}`}>
                <TableCell>
                  {formatReadingDateTime(reading.created_at, timezone)}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {reading.value} C
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
