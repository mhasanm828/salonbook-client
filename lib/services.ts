export interface Service {
  _id: string;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  status: "active" | "inactive";
  createdAt?: string;
}

export const SERVICE_CATEGORIES = [
  "Haircut & Styling",
  "Hair Coloring",
  "Hair Treatment",
  "Facial & Skincare",
  "Makeup",
  "Manicure & Pedicure",
  "Spa & Massage",
] as const;

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface ServiceQuery {
  search?: string;
  category?: string;
  sort?: "price-asc" | "price-desc" | "";
}

export async function fetchServices(
  query: ServiceQuery = {}
): Promise<Service[]> {
  const params = new URLSearchParams();
  if (query.search) params.set("search", query.search);
  if (query.category) params.set("category", query.category);
  if (query.sort) params.set("sort", query.sort);

  const response = await fetch(
    `${API_URL}/api/services?${params.toString()}`,
    { cache: "no-store" }
  );
  if (!response.ok) {
    throw new Error("Failed to load services");
  }
  const data = (await response.json()) as { services: Service[] };
  return data.services;
}

export async function fetchService(id: string): Promise<Service> {
  const response = await fetch(`${API_URL}/api/services/${id}`, {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error("Service not found");
  }
  const data = (await response.json()) as { service: Service };
  return data.service;
}
