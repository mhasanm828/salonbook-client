import { Suspense } from "react";
import ServiceDetailsClient from "@/components/ServiceDetailsClient";

async function Details({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ServiceDetailsClient id={id} />;
}

export default function ServiceDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <main className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6">
          <p className="text-center text-sm text-zinc-500">Loading...</p>
        </main>
      }
    >
      <Details params={params} />
    </Suspense>
  );
}
