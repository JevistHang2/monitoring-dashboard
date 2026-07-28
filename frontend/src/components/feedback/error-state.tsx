import { AlertTriangle } from "lucide-react";

type ErrorStateProps = {
  title?: string;
  message: string;
};

export function ErrorState({
  title = "Something went wrong",
  message,
}: ErrorStateProps) {
  return (
    <section className="rounded-lg border border-destructive bg-card p-6 text-card-foreground">
      <div className="flex items-start gap-3">
        <div className="bg-destructive/10 flex size-10 shrink-0 items-center justify-center rounded-md text-destructive">
          <AlertTriangle className="size-5" />
        </div>

        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{message}</p>
        </div>
      </div>
    </section>
  );
}
