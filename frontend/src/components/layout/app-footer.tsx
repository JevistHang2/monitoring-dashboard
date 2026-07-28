import { PageContainer } from "@/components/layout/page-container";

export function AppFooter() {
  return (
    <footer className="border-t bg-background">
      <PageContainer>
        <div className="flex min-h-14 items-center text-sm text-muted-foreground">
          <p>Next.js 14, Express, Socket.IO, MongoDB</p>
        </div>
      </PageContainer>
    </footer>
  );
}
