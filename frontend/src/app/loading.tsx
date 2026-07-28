import { LoadingState } from "@/components/feedback/loading-state";
import { AppShell } from "@/components/layout/app-shell";

export default function Loading() {
  return (
    <AppShell>
      <LoadingState />
    </AppShell>
  );
}
