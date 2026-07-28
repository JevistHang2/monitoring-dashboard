"use client";

import { ErrorState } from "@/components/feedback/error-state";

type ErrorPageProps = {
  error: Error & { digest?: string };
};

export default function ErrorPage({ error }: ErrorPageProps) {
  return (
    <ErrorState title="Unable to render this page" message={error.message} />
  );
}
