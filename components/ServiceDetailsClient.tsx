"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { fetchService, type Service } from "@/lib/services";
import { bookAppointment, TIME_SLOTS } from "@/lib/appointments";

export default function ServiceDetailsClient({ id }: { id: string }) {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user as { role?: string } | undefined;

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Protected page: guests are sent to Sign In
  useEffect(() => {
    if (!isPending && !session) {
      router.push("/sign-in");
    }
  }, [isPending, session, router]);

  useEffect(() => {
    if (!id) return;
    fetchService(id)
      .then(setService)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleBook(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (!date || !timeSlot) {
      setError("Please choose an appointment date and a time slot.");
      return;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const chosen = new Date(`${date}T00:00:00`);
    if (chosen < today) {
      setError("Appointment date cannot be in the past.");
      return;
    }
    setSubmitting(true);
    try {
      await bookAppointment({
        serviceId: id,
        appointmentDate: date,
        timeSlot,
        message,
      });
      setSuccess(
        "Appointment request submitted. Track its status from your dashboard."
      );
      setTimeout(() => router.push("/dashboard/customer/appointments"), 1200);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to submit appointment."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (isPending || loading) {
    return (
      <main className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6">
        <p className="text-center text-sm text-zinc-500">Loading...</p>
      </main>
    );
  }

  if (!session) return null;

  if (notFound || !service) {
    return (
      <main className="mx-auto w-full max-w-4xl px-4 py-16 text-center sm:px-6">
        <h1 className="text-2xl font-bold">Service not found</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          This service ID is invalid or the service is no longer available.
        </p>
        <Link
          href="/services"
          className="mt-6 inline-block rounded-full bg-amber-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-amber-800"
        >
          Back to Browse Services
        </Link>
      </main>
    );
  }

  const isAdmin = user?.role === "admin";

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6">
      <div className="relative h-72 w-full overflow-hidden rounded-2xl">
        <Image
          src={service.image}
          alt={service.serviceName}
          fill
          sizes="(max-width: 768px) 100vw, 896px"
          className="object-cover"
          priority
        />
      </div>

      <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-amber-700">
        {service.category}
      </p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight">
        {service.serviceName}
      </h1>
      <p className="mt-4 leading-7 text-zinc-600 dark:text-zinc-400">
        {service.description}
      </p>

      <div className="mt-6 flex flex-wrap gap-6 text-sm">
        <span>
          Price: <strong>৳{service.price}</strong>
        </span>
        <span>
          Estimated Duration: <strong>{service.duration} minutes</strong>
        </span>
      </div>

      <section className="mt-10 rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
        <h2 className="text-xl font-semibold">Book an Appointment</h2>
        {isAdmin ? (
          <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:bg-amber-950 dark:text-amber-200">
            Admins cannot submit customer appointment requests. Sign in with
            a customer account to book this service.
          </p>
        ) : (
          <form onSubmit={handleBook} className="mt-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="date" className="text-sm font-medium">
                  Appointment Date
                </label>
                <input
                  id="date"
                  type="date"
                  required
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                />
              </div>
              <div>
                <label htmlFor="slot" className="text-sm font-medium">
                  Time Slot
                </label>
                <select
                  id="slot"
                  required
                  value={timeSlot}
                  onChange={(event) => setTimeSlot(event.target.value)}
                  className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                >
                  <option value="">Select a time slot</option>
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="message" className="text-sm font-medium">
                Additional Message (optional)
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                rows={3}
                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                placeholder="Anything we should know before your visit?"
              />
            </div>
            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
                {error}
              </p>
            )}
            {success && (
              <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-950 dark:text-green-300">
                {success}
              </p>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-amber-700 px-6 py-2.5 text-sm font-medium text-white hover:bg-amber-800 disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Request Appointment"}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
