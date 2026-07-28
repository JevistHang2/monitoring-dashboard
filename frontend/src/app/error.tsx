"use client";

import { ErrorState } from "@/components/feedback/error-state";
import { AppShell } from "@/components/layout/app-shell";

type ErrorPageProps = {
  error: Error & { digest?: string };
};

export default function ErrorPage({ error }: ErrorPageProps) {
  return (
    <AppShell>
      <ErrorState title="Unable to render this page" message={error.message} />
    </AppShell>
  );
}
