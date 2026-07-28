import { Activity } from "lucide-react";
import { PageContainer } from "./page-container";

export function AppHeader() {
  return (
    <header className="border-b bg-background">
      <PageContainer>
        <div className="flex min-h-16 flex-col justify-center gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Real-time Monitoring
            </p>
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Temperature Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Activity className="size-4" />
            <span>Live data every 5 seconds</span>
          </div>
        </div>
      </PageContainer>
    </header>
  );
}
