"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ServiceCard from "@/components/ServiceCard";
import { fetchServices, SERVICE_CATEGORIES, type Service } from "@/lib/services";

const CATEGORY_IMAGES: Record<string, string> = {
  "Haircut & Styling":
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80",
  "Hair Coloring":
    "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&q=80",
  "Hair Treatment":
    "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800&q=80",
  "Facial & Skincare":
    "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80",
  Makeup:
    "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80",
  "Manicure & Pedicure":
    "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=80",
  "Spa & Massage":
    "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80",
};

export default function Home() {
  const [featured, setFeatured] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices({})
      .then((services) => setFeatured(services.slice(0, 6)))
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="flex flex-1 flex-col">
      {/* Banner */}
      <section className="relative flex min-h-[420px] items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1600&q=80"
          alt="Salon interior"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative px-6 py-24 text-center text-white">
          <p className="text-sm font-medium uppercase tracking-widest text-amber-300">
            Salon Appointment Booking
          </p>
          <h1 className="mx-auto mt-4 max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
            Look Your Best, Book in Minutes
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-zinc-200">
            Explore our salon services, request an appointment online, and
            pay securely once your booking is confirmed by our team.
          </p>
          <Link
            href="/services"
            className="mt-8 inline-block rounded-full bg-amber-600 px-6 py-3 text-sm font-semibold text-white hover:bg-amber-700"
          >
            Explore Salon Services
          </Link>
        </div>
      </section>

      {/* Featured Services */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Featured Salon Services
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Our most popular services, fresh from the salon floor.
            </p>
          </div>
          <Link
            href="/services"
            className="hidden text-sm font-medium text-amber-700 sm:block"
          >
            View all services
          </Link>
        </div>

        {loading && (
          <p className="mt-10 text-center text-sm text-zinc-500">
            Loading featured services...
          </p>
        )}
        {!loading && featured.length === 0 && (
          <p className="mt-10 text-center text-sm text-zinc-500">
            Featured services will appear here once the salon adds them.
          </p>
        )}
        {!loading && featured.length > 0 && (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        )}
      </section>

      {/* Categories */}
      <section className="bg-zinc-50 dark:bg-zinc-950">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Salon Service Categories
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Pick a category to explore the services inside it.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICE_CATEGORIES.map((category) => (
              <Link
                key={category}
                href={`/services?category=${encodeURIComponent(category)}`}
                className="group relative h-36 overflow-hidden rounded-2xl"
              >
                <Image
                  src={CATEGORY_IMAGES[category]}
                  alt={category}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/45" />
                <span className="absolute inset-x-0 bottom-0 p-4 text-lg font-semibold text-white">
                  {category}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works (extra section) */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">
          How SalonBook Works
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {[
            {
              step: "1",
              title: "Browse & Request",
              text: "Explore services, open a service, and submit an appointment request with your preferred date and time slot.",
            },
            {
              step: "2",
              title: "We Confirm",
              text: "Our salon team reviews your request and confirms it. You can follow the status live from your dashboard.",
            },
            {
              step: "3",
              title: "Pay Securely",
              text: "Pay for confirmed appointments through secure Stripe Checkout and view your full payment history anytime.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="rounded-2xl border border-zinc-200 p-6 text-center dark:border-zinc-800"
            >
              <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-amber-700 text-sm font-bold text-white">
                {item.step}
              </span>
              <h3 className="mt-4 font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
