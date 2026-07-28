import { AppShell } from "@/components/layout/app-shell";

export default function Home() {
  return (
    <AppShell>
      <section className="rounded-lg border bg-card p-6 text-card-foreground">
        <h2 className="text-lg font-semibold">Dashboard content</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The dashboard template will be built inside this area.
        </p>
      </section>
    </AppShell>
  );
}
