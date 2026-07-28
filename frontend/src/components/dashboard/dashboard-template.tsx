import type { ReactNode } from "react";

type DashboardTemplateProps = {
  notice?: ReactNode;
  toolbar: ReactNode;
  metrics: ReactNode;
  lineChart: ReactNode;
  barChart: ReactNode;
  readings: ReactNode;
};

export function DashboardTemplate({
  notice,
  toolbar,
  metrics,
  lineChart,
  barChart,
  readings,
}: DashboardTemplateProps) {
  return (
    <div className="flex flex-col gap-6">
      {notice && <section>{notice}</section>}

      <section className="flex flex-col gap-4 rounded-lg border bg-card p-4 text-card-foreground sm:flex-row sm:items-center sm:justify-between">
        {toolbar}
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics}
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <div className="min-h-80 rounded-lg border bg-card p-4 text-card-foreground">
          {lineChart}
        </div>

        <div className="min-h-80 rounded-lg border bg-card p-4 text-card-foreground">
          {barChart}
        </div>
      </section>

      <section className="rounded-lg border bg-card text-card-foreground">
        {readings}
      </section>
    </div>
  );
}
