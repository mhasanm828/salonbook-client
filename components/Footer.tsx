import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        <div>
          <p className="text-lg font-bold">
            Salon<span className="text-amber-700">Book</span>
          </p>
          <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Book salon services online in a few simple steps. Browse
            services, request an appointment, and pay securely after
            confirmation.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide">
            Quick Links
          </p>
          <ul className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
            <li>
              <Link href="/" className="hover:text-amber-700">
                Home
              </Link>
            </li>
            <li>
              <Link href="/services" className="hover:text-amber-700">
                Browse Services
              </Link>
            </li>
            <li>
              <Link href="/sign-in" className="hover:text-amber-700">
                Sign In
              </Link>
            </li>
            <li>
              <Link href="/sign-up" className="hover:text-amber-700">
                Sign Up
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide">
            Contact
          </p>
          <ul className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
            <li>Phone: +880 1700-000000</li>
            <li>Email: hello@salonbook.example</li>
            <li>Address: Barishal, Bangladesh</li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide">
            Opening Hours
          </p>
          <ul className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
            <li>Sat - Thu: 10:00 AM - 9:00 PM</li>
            <li>Friday: 3:00 PM - 9:00 PM</li>
          </ul>
          <div className="mt-4 flex gap-4 text-sm font-medium">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-amber-700"
            >
              Facebook
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-amber-700"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-200 py-4 text-center text-sm text-zinc-500 dark:border-zinc-800">
        © {new Date().getFullYear()} SalonBook. All rights reserved.
      </div>
    </footer>
  );
}
