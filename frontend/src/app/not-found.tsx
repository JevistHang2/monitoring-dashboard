import { EmptyState } from "@/components/feedback/empty-state";
import { AppShell } from "@/components/layout/app-shell";

export default function NotFound() {
  return (
    <AppShell>
      <EmptyState
        title="Page not found"
        message="The page you are looking for does not exist."
      />
    </AppShell>
  );
}
