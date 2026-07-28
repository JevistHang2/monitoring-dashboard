import { LoaderCircle } from "lucide-react";

type LoadingStateProps = {
  message?: string;
};

export function LoadingState({
  message = "Loading Page...",
}: LoadingStateProps) {
  return (
    <section className="rounded-lg border bg-card p-6 text-card-foreground">
      <div className="flex items-center gap-3">
        <LoaderCircle className="size-5 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </section>
  );
}
