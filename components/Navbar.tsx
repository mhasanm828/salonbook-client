"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut, dashboardPathForRole } from "@/lib/auth-client";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Browse Services" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user as
    | { name?: string; role?: string }
    | undefined;
  const dashboardHref = dashboardPathForRole(user?.role);

  async function handleLogout() {
    await signOut();
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/90 backdrop-blur dark:border-zinc-800 dark:bg-black/90">
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-xl font-bold tracking-tight">
          Salon<span className="text-amber-700">Book</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-zinc-700 hover:text-amber-700 dark:text-zinc-300"
            >
              {link.label}
            </Link>
          ))}
          {!isPending && user ? (
            <>
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {user.name}
              </span>
              <Link
                href={dashboardHref}
                className="text-sm font-medium text-zinc-700 hover:text-amber-700 dark:text-zinc-300"
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full bg-amber-700 px-4 py-2 text-sm font-medium text-white hover:bg-amber-800"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="text-sm font-medium text-zinc-700 hover:text-amber-700 dark:text-zinc-300"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="rounded-full bg-amber-700 px-4 py-2 text-sm font-medium text-white hover:bg-amber-800"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium md:hidden dark:border-zinc-700"
          aria-label="Toggle navigation menu"
          aria-expanded={open}
        >
          Menu
        </button>
      </nav>

      {open && (
        <div className="border-t border-zinc-200 px-4 py-3 md:hidden dark:border-zinc-800">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                {link.label}
              </Link>
            ))}
            {!isPending && user ? (
              <>
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {user.name}
                </span>
                <Link
                  href={dashboardHref}
                  onClick={() => setOpen(false)}
                  className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-left text-sm font-medium text-amber-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  onClick={() => setOpen(false)}
                  className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setOpen(false)}
                  className="text-sm font-medium text-amber-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
