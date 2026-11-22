"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ServiceCard from "@/components/ServiceCard";
import {
  fetchServices,
  SERVICE_CATEGORIES,
  type Service,
  type ServiceQuery,
} from "@/lib/services";

function BrowseServicesContent() {
  const searchParams = useSearchParams();
  const [services, setServices] = useState<Service[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(
    searchParams.get("category") || ""
  );
  const [sort, setSort] = useState<ServiceQuery["sort"]>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchServices({ search, category, sort });
        if (!cancelled) setServices(data);
      } catch {
        if (!cancelled) {
          setServices([]);
          setError(
            "Could not load services. Please make sure the server is running and try again."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    const timer = setTimeout(load, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [search, category, sort]);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">Browse Services</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Explore our salon services. Search by name, filter by category, or
        sort by price.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search services by name..."
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          aria-label="Search services by name"
        />
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          aria-label="Filter by category"
        >
          <option value="">All Categories</option>
          {SERVICE_CATEGORIES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(event) =>
            setSort(event.target.value as ServiceQuery["sort"])
          }
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          aria-label="Sort by price"
        >
          <option value="">Sort: Newest First</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      {loading && (
        <p className="mt-12 text-center text-sm text-zinc-500">
          Loading services...
        </p>
      )}

      {!loading && error && (
        <p className="mt-12 rounded-lg bg-red-50 px-4 py-3 text-center text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {error}
        </p>
      )}

      {!loading && !error && services.length === 0 && (
        <p className="mt-12 text-center text-sm text-zinc-500">
          No services found. Try a different search or category.
        </p>
      )}

      {!loading && !error && services.length > 0 && (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service._id} service={service} />
          ))}
        </div>
      )}
    </main>
  );
}

export default function BrowseServicesPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
          <p className="text-center text-sm text-zinc-500">
            Loading services...
          </p>
        </main>
      }
    >
      <BrowseServicesContent />
    </Suspense>
  );
}
