import { API_URL } from "./services";

async function adminFetch(path: string, options: RequestInit = {}) {
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

export interface AdminOverview {
  totalCustomers: number;
  totalActiveServices: number;
  totalAppointments: number;
  pendingAppointments: number;
  confirmedAppointments: number;
  totalSuccessfulPayments: number;
  totalRevenue: number;
}

export async function fetchAdminOverview(): Promise<AdminOverview> {
  return adminFetch("/api/admin/overview") as Promise<AdminOverview>;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  image: string;
  role: string;
  isBlocked: boolean;
  phone: string;
  createdAt?: string;
}

export async function fetchAdminUsers(): Promise<AdminUser[]> {
  const data = await adminFetch("/api/admin/users");
  return (data as { users: AdminUser[] }).users;
}

export async function setUserBlocked(id: string, blocked: boolean) {
  return adminFetch(`/api/admin/users/${id}/${blocked ? "block" : "unblock"}`, {
    method: "PATCH",
  });
}

export interface Transaction {
  _id: string;
  appointmentId: string;
  customerName: string;
  customerEmail: string;
  serviceName: string;
  appointmentDate: string;
  amount: number;
  currency: string;
  stripeSessionId: string;
  status: "paid" | "failed";
  createdAt: string;
}

export async function fetchTransactions(): Promise<Transaction[]> {
  const data = await adminFetch("/api/payments/transactions");
  return (data as { transactions: Transaction[] }).transactions;
}

export async function fetchAllServicesAdmin() {
  const response = await fetch(`${API_URL}/api/services/all`, {
    credentials: "include",
    cache: "no-store",
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Failed to load services");
  }
  return data.services as import("./services").Service[];
}

export async function createService(payload: Record<string, unknown>) {
  return adminFetch("/api/services", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateService(
  id: string,
  payload: Record<string, unknown>
) {
  return adminFetch(`/api/services/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteService(id: string) {
  return adminFetch(`/api/services/${id}`, { method: "DELETE" });
}

export async function setServiceStatus(
  id: string,
  status: "active" | "inactive"
) {
  return adminFetch(`/api/services/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
