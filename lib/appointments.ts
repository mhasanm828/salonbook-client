import { API_URL } from "./services";

export const TIME_SLOTS = [
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
  "08:00 PM",
] as const;

export interface AppointmentService {
  _id: string;
  serviceName: string;
  category: string;
  image: string;
  price: number;
  duration: number;
}

export interface Appointment {
  _id: string;
  serviceId: AppointmentService | string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  serviceName: string;
  appointmentDate: string;
  timeSlot: string;
  message: string;
  servicePrice: number;
  paymentStatus: "unpaid" | "paid";
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
}

async function apiFetch(path: string, options: RequestInit = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      (data as { message?: string }).message || "Request failed"
    );
  }
  return data;
}

export async function bookAppointment(payload: {
  serviceId: string;
  appointmentDate: string;
  timeSlot: string;
  message?: string;
}) {
  return apiFetch("/api/appointments", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function fetchMyAppointments(): Promise<Appointment[]> {
  const data = await apiFetch("/api/appointments/me");
  return (data as { appointments: Appointment[] }).appointments;
}

export async function fetchMyStats() {
  return apiFetch("/api/appointments/me/stats") as Promise<{
    total: number;
    pending: number;
    confirmed: number;
    cancelled: number;
  }>;
}

export async function fetchAllAppointments(): Promise<Appointment[]> {
  const data = await apiFetch("/api/appointments");
  return (data as { appointments: Appointment[] }).appointments;
}

export async function cancelAppointment(id: string) {
  return apiFetch(`/api/appointments/${id}/cancel`, { method: "PATCH" });
}

export async function confirmAppointment(id: string) {
  return apiFetch(`/api/appointments/${id}/confirm`, { method: "PATCH" });
}

export async function startCheckout(appointmentId: string) {
  const data = await apiFetch("/api/payments/checkout", {
    method: "POST",
    body: JSON.stringify({ appointmentId }),
  });
  return data as { url: string; sessionId: string };
}

export function serviceOf(appointment: Appointment): AppointmentService | null {
  return typeof appointment.serviceId === "object"
    ? appointment.serviceId
    : null;
}
