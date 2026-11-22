"use client";

import { useEffect, useState } from "react";
import { fetchMyStats } from "@/lib/appointments";
import { StatCard } from "@/components/StatusBadge";

export default function CustomerOverviewPage() {
  const [stats, setStats] = useState<{
    total: number;
    pending: number;
    confirmed: number;
    cancelled: number;
  } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyStats()
      .then(setStats)
      .catch(() =>
        setError("Could not load dashboard data. Please try again later.")
      );
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Your appointment requests at a glance.
      </p>
      {error && (
        <p className="mt-6 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {error}
        </p>
      )}
      {!stats && !error && (
        <p className="mt-6 text-sm text-zinc-500">Loading...</p>
      )}
      {stats && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Appointment Requests" value={stats.total} />
          <StatCard label="Pending Appointments" value={stats.pending} />
          <StatCard label="Confirmed Appointments" value={stats.confirmed} />
          <StatCard label="Cancelled Appointments" value={stats.cancelled} />
        </div>
      )}
    </div>
  );
}
