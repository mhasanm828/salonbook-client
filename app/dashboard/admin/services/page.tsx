"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Service } from "@/lib/services";
import {
  deleteService,
  fetchAllServicesAdmin,
  setServiceStatus,
} from "@/lib/admin";
import { StatusBadge } from "@/components/StatusBadge";
import toast from "react-hot-toast";

export default function ManageServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setServices(await fetchAllServicesAdmin());
    } catch {
      setError("Could not load services. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleToggle(service: Service) {
    setActionId(service._id);
    try {
      await setServiceStatus(
        service._id,
        service.status === "active" ? "inactive" : "active"
      );
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status.");
    } finally {
      setActionId("");
    }
  }

  async function handleDelete(service: Service) {
    if (!window.confirm(`Delete "${service.serviceName}" permanently?`)) return;
    setActionId(service._id);
    try {
      await deleteService(service._id);
      toast.success("Service deleted.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete service.");
    } finally {
      setActionId("");
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manage Services</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            All services, including inactive ones.
          </p>
        </div>
        <Link
          href="/dashboard/admin/services/new"
          className="rounded-full bg-amber-700 px-4 py-2 text-sm font-medium text-white hover:bg-amber-800"
        >
          Add New Service
        </Link>
      </div>

      {loading && <p className="mt-6 text-sm text-zinc-500">Loading...</p>}
      {error && (
        <p className="mt-6 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {error}
        </p>
      )}
      {!loading && !error && services.length === 0 && (
        <p className="mt-6 text-sm text-zinc-500">No services yet.</p>
      )}

      <div className="mt-6 space-y-3">
        {services.map((service) => (
          <article
            key={service._id}
            className="flex flex-col gap-4 rounded-2xl border border-zinc-200 p-4 sm:flex-row sm:items-center dark:border-zinc-800"
          >
            <div className="relative h-20 w-full shrink-0 overflow-hidden rounded-xl sm:w-28">
              <Image
                src={service.image}
                alt={service.serviceName}
                fill
                sizes="112px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-semibold">{service.serviceName}</h2>
                <StatusBadge status={service.status} />
              </div>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {service.category} · ৳{service.price} · {service.duration} min
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/dashboard/admin/services/${service._id}/edit`}
                className="rounded-full border border-zinc-300 px-3 py-1.5 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
              >
                Edit
              </Link>
              <button
                type="button"
                onClick={() => handleToggle(service)}
                disabled={actionId === service._id}
                className="rounded-full border border-zinc-300 px-3 py-1.5 text-sm font-medium hover:bg-zinc-50 disabled:opacity-60 dark:border-zinc-700 dark:hover:bg-zinc-800"
              >
                {service.status === "active" ? "Deactivate" : "Activate"}
              </button>
              <button
                type="button"
                onClick={() => handleDelete(service)}
                disabled={actionId === service._id}
                className="rounded-full border border-red-300 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-60 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950"
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
