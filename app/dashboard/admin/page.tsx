"use client";

import { useEffect, useState } from "react";
import { fetchAdminOverview, type AdminOverview } from "@/lib/admin";
import { StatCard } from "@/components/StatusBadge";

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<AdminOverview | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAdminOverview()
      .then(setStats)
      .catch(() =>
        setError("Could not load dashboard data. Please try again later.")
      );
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Admin Overview</h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Salon performance at a glance.
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
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard label="Total Registered Customers" value={stats.totalCustomers} />
          <StatCard label="Total Active Services" value={stats.totalActiveServices} />
          <StatCard label="Total Appointment Requests" value={stats.totalAppointments} />
          <StatCard label="Pending Appointments" value={stats.pendingAppointments} />
          <StatCard label="Confirmed Appointments" value={stats.confirmedAppointments} />
          <StatCard
            label="Total Successful Payments"
            value={`${stats.totalSuccessfulPayments} (৳${stats.totalRevenue})`}
          />
        </div>
      )}
    </div>
  );
}
