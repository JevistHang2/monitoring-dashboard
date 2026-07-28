import { Inbox } from "lucide-react";

type EmptyStateProps = {
  title?: string;
  message: string;
};

export function EmptyState({
  title = "No data available",
  message,
}: EmptyStateProps) {
  return (
    <section className="rounded-lg border bg-card p-6 text-card-foreground">
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <div className="flex size-12 items-center justify-center rounded-md bg-muted text-muted-foreground">
          <Inbox className="size-6" />
        </div>

        <h2 className="mt-4 text-lg font-semibold">{title}</h2>
        <p className="mt-1 max-w-md text-sm text-muted-foreground">{message}</p>
      </div>
    </section>
  );
}
