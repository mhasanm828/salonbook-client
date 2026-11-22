"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  cancelAppointment,
  fetchMyAppointments,
  serviceOf,
  startCheckout,
  type Appointment,
} from "@/lib/appointments";
import { StatusBadge } from "@/components/StatusBadge";
import toast from "react-hot-toast";

export default function MyAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setAppointments(await fetchMyAppointments());
    } catch {
      setError("Could not load your appointments. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchMyAppointments()
      .then((data) => {
        if (!cancelled) setAppointments(data);
      })
      .catch(() => {
        if (!cancelled)
          setError("Could not load your appointments. Please try again later.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handlePay(id: string) {
    setActionId(id);
    setError("");
    try {
      const { url } = await startCheckout(id);
      if (url) window.location.href = url;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to start payment.";
      setError(msg);
      toast.error(msg);
      setActionId("");
    }
  }

  async function handleCancel(id: string) {
    if (!window.confirm("Cancel this appointment request?")) return;
    setActionId(id);
    try {
      await cancelAppointment(id);
      toast.success("Appointment cancelled.");
      await load();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to cancel appointment."
      );
    } finally {
      setActionId("");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">My Appointments</h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        All appointment requests you have submitted.
      </p>

      {loading && <p className="mt-6 text-sm text-zinc-500">Loading...</p>}
      {error && (
        <p className="mt-6 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {error}
        </p>
      )}
      {!loading && !error && appointments.length === 0 && (
        <p className="mt-6 text-sm text-zinc-500">
          You have not submitted any appointment requests yet.
        </p>
      )}

      <div className="mt-6 space-y-4">
        {appointments.map((appointment) => {
          const service = serviceOf(appointment);
          return (
            <article
              key={appointment._id}
              className="flex flex-col gap-4 rounded-2xl border border-zinc-200 p-4 sm:flex-row dark:border-zinc-800"
            >
              {service?.image && (
                <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-xl sm:w-40">
                  <Image
                    src={service.image}
                    alt={appointment.serviceName}
                    fill
                    sizes="160px"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-semibold">{appointment.serviceName}</h2>
                  <StatusBadge status={appointment.status} />
                  <StatusBadge status={appointment.paymentStatus} />
                </div>
                <dl className="mt-2 grid gap-1 text-sm text-zinc-600 sm:grid-cols-2 dark:text-zinc-400">
                  <div>Category: {service?.category || "-"}</div>
                  <div>Date: {appointment.appointmentDate}</div>
                  <div>Time: {appointment.timeSlot}</div>
                  <div>Price: ৳{appointment.servicePrice}</div>
                  <div>
                    Requested:{" "}
                    {appointment.createdAt
                      ? appointment.createdAt.slice(0, 10)
                      : "-"}
                  </div>
                </dl>
                {appointment.status === "pending" && (
                  <button
                    type="button"
                    onClick={() => handleCancel(appointment._id)}
                    disabled={actionId === appointment._id}
                    className="mt-3 rounded-full border border-red-300 px-4 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-60 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950"
                  >
                    {actionId === appointment._id
                      ? "Cancelling..."
                      : "Cancel Request"}
                  </button>
                )}
                {appointment.status === "confirmed" &&
                  appointment.paymentStatus === "unpaid" && (
                    <button
                      type="button"
                      onClick={() => handlePay(appointment._id)}
                      disabled={actionId === appointment._id}
                      className="mt-3 rounded-full bg-amber-700 px-4 py-1.5 text-sm font-medium text-white hover:bg-amber-800 disabled:opacity-60"
                    >
                      {actionId === appointment._id
                        ? "Redirecting to Stripe..."
                        : "Pay Now"}
                    </button>
                  )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
