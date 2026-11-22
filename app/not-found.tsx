import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="mx-auto w-full max-w-md px-4 py-20 text-center sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-widest text-amber-700">
        404
      </p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight">
        Page Not Found
      </h1>
      <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        The page you are looking for does not exist or may have been moved.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-full bg-amber-700 px-6 py-2.5 text-sm font-medium text-white hover:bg-amber-800"
      >
        Go to Home
      </Link>
    </main>
  );
}
