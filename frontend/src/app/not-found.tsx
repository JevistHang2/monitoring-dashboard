import { EmptyState } from "@/components/feedback/empty-state";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4 text-foreground">
      <div className="w-full max-w-xl">
        <EmptyState
          title="404 - Page not found"
          message="The page you are looking for does not exist."
        />
      </div>
    </main>
  );
}
