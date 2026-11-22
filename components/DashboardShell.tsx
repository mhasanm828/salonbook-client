"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, dashboardPathForRole } from "@/lib/auth-client";

const CUSTOMER_LINKS = [
  { href: "/dashboard/customer", label: "Overview" },
  { href: "/dashboard/customer/appointments", label: "My Appointments" },
  { href: "/dashboard/customer/profile", label: "My Profile" },
];

const ADMIN_LINKS = [
  { href: "/dashboard/admin", label: "Overview" },
  { href: "/dashboard/admin/services", label: "Manage Services" },
  { href: "/dashboard/admin/services/new", label: "Add Service" },
  { href: "/dashboard/admin/appointments", label: "Manage Appointments" },
  { href: "/dashboard/admin/users", label: "Manage Users" },
  { href: "/dashboard/admin/transactions", label: "Transactions" },
  { href: "/dashboard/admin/profile", label: "My Profile" },
];

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = useSession();
  const user = session?.user as { name?: string; role?: string } | undefined;
  const role = user?.role === "admin" ? "admin" : "customer";

  useEffect(() => {
    if (isPending) return;
    if (!session) {
      router.push("/sign-in");
      return;
    }
    // A user must never reach the other role's dashboard by typing the URL
    if (pathname.startsWith("/dashboard/admin") && role !== "admin") {
      router.push(dashboardPathForRole(role));
    }
    if (pathname.startsWith("/dashboard/customer") && role === "admin") {
      router.push(dashboardPathForRole(role));
    }
    if (pathname === "/dashboard") {
      router.push(dashboardPathForRole(role));
    }
  }, [isPending, session, pathname, role, router]);

  if (isPending || !session) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <p className="text-center text-sm text-zinc-500">
          Loading dashboard...
        </p>
      </main>
    );
  }

  const links = role === "admin" ? ADMIN_LINKS : CUSTOMER_LINKS;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 md:flex-row">
      <aside className="md:w-60 md:shrink-0">
        <div className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
          <p className="font-semibold">{user?.name || "User"}</p>
          <p className="text-xs uppercase tracking-wide text-amber-700">
            {role} dashboard
          </p>
          <nav className="mt-4 flex gap-2 overflow-x-auto md:flex-col md:overflow-visible">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium ${
                    active
                      ? "bg-amber-700 text-white"
                      : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
      <section className="min-w-0 flex-1">{children}</section>
    </div>
  );
}
