import Image from "next/image";
import Link from "next/link";
import type { Service } from "@/lib/services";

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="relative h-48 w-full">
        <Image
          src={service.image}
          alt={service.serviceName}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
          {service.category}
        </p>
        <h3 className="mt-1 text-lg font-semibold">{service.serviceName}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
          {service.description}
        </p>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="font-bold">৳{service.price}</span>
          <span className="text-zinc-500">{service.duration} min</span>
        </div>
        <Link
          href={`/services/${service._id}`}
          className="mt-4 rounded-full bg-amber-700 px-4 py-2 text-center text-sm font-medium text-white hover:bg-amber-800"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}
