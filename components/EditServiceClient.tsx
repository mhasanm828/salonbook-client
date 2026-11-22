"use client";

import { useEffect, useState } from "react";
import ServiceForm from "@/components/ServiceForm";
import { fetchAllServicesAdmin } from "@/lib/admin";
import type { Service } from "@/lib/services";

export default function EditServiceClient({ id }: { id: string }) {
  const [service, setService] = useState<Service | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAllServicesAdmin()
      .then((services) => {
        const found = services.find((item) => item._id === id);
        if (!found) setError("Service not found.");
        else setService(found);
      })
      .catch(() => setError("Could not load this service."));
  }, [id]);

  if (error) {
    return (
      <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
        {error}
      </p>
    );
  }
  if (!service) return <p className="text-sm text-zinc-500">Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Edit Service</h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Update the service information below.
      </p>
      <div className="mt-6">
        <ServiceForm initial={service} />
      </div>
    </div>
  );
}
