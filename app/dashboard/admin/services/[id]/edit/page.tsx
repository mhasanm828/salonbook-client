import { Suspense } from "react";
import EditServiceClient from "@/components/EditServiceClient";

async function Editor({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EditServiceClient id={id} />;
}

export default function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<p className="text-sm text-zinc-500">Loading...</p>}>
      <Editor params={params} />
    </Suspense>
  );
}
