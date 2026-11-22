"use client";

import { useCallback, useEffect, useState } from "react";
import {
  cancelAppointment,
  confirmAppointment,
  fetchAllAppointments,
  type Appointment,
} from "@/lib/appointments";
import { StatusBadge } from "@/components/StatusBadge";

export default function ManageAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setAppointments(await fetchAllAppointments());
    } catch {
      setError("Could not load appointments. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function runAction(id: string, action: "confirm" | "cancel") {
    if (
      action === "cancel" &&
      !window.confirm("Cancel this appointment request?")
    )
      return;
    setActionId(id);
    setError("");
    try {
      if (action === "confirm") await confirmAppointment(id);
      else await cancelAppointment(id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed.");
    } finally {
      setActionId("");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">
        Manage Appointments
      </h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Review, confirm or cancel customer appointment requests.
      </p>

      {loading && <p className="mt-6 text-sm text-zinc-500">Loading...</p>}
      {error && (
        <p className="mt-6 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {error}
        </p>
      )}
      {!loading && !error && appointments.length === 0 && (
        <p className="mt-6 text-sm text-zinc-500">
          No appointment requests yet.
        </p>
      )}

      <div className="mt-6 space-y-4">
        {appointments.map((appointment) => (
          <article
            key={appointment._id}
            className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800"
          >
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-semibold">{appointment.serviceName}</h2>
              <StatusBadge status={appointment.status} />
              <StatusBadge status={appointment.paymentStatus} />
            </div>
            <dl className="mt-2 grid gap-1 text-sm text-zinc-600 sm:grid-cols-2 dark:text-zinc-400">
              <div>
                Customer: {appointment.customerName || "-"} (
                {appointment.customerEmail})
              </div>
              <div>Price: ৳{appointment.servicePrice}</div>
              <div>
                Appointment: {appointment.appointmentDate} at{" "}
                {appointment.timeSlot}
              </div>
              <div>
                Requested:{" "}
                {appointment.createdAt
                  ? appointment.createdAt.slice(0, 10)
                  : "-"}
              </div>
            </dl>
            {appointment.message && (
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Message: {appointment.message}
              </p>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              {appointment.status === "pending" && (
                <button
                  type="button"
                  onClick={() => runAction(appointment._id, "confirm")}
                  disabled={actionId === appointment._id}
                  className="rounded-full bg-green-700 px-4 py-1.5 text-sm font-medium text-white hover:bg-green-800 disabled:opacity-60"
                >
                  Confirm
                </button>
              )}
              {appointment.status !== "cancelled" && (
                <button
                  type="button"
                  onClick={() => runAction(appointment._id, "cancel")}
                  disabled={actionId === appointment._id}
                  className="rounded-full border border-red-300 px-4 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-60 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950"
                >
                  Cancel
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
