import { Suspense } from "react";
import DashboardShell from "@/components/DashboardShell";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <main className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <p className="text-center text-sm text-zinc-500">
            Loading dashboard...
          </p>
        </main>
      }
    >
      <DashboardShell>{children}</DashboardShell>
    </Suspense>
  );
}
