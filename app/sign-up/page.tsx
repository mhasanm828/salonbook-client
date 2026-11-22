"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp, signIn, dashboardPathForRole } from "@/lib/auth-client";

function validatePassword(password: string): string | null {
  if (password.length < 6) return "Password must be at least 6 characters.";
  if (!/[A-Z]/.test(password))
    return "Password must contain one uppercase letter.";
  if (!/[a-z]/.test(password))
    return "Password must contain one lowercase letter.";
  return null;
}

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setLoading(true);
    const { error: signUpError } = await signUp.email({
      name,
      email,
      password,
      ...(image.trim() ? { image: image.trim() } : {}),
    });
    setLoading(false);

    if (signUpError) {
      setError(signUpError.message || "Sign up failed. Please try again.");
      return;
    }
    setSuccess("Account created successfully. Redirecting...");
    router.push(dashboardPathForRole("customer"));
  }

  async function handleGoogle() {
    setError("");
    await signIn.social({
      provider: "google",
      callbackURL: `${window.location.origin}${dashboardPathForRole("customer")}`,
    });
  }

  return (
    <main className="mx-auto w-full max-w-md px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Sign up as a customer to book salon appointments. Admin accounts are
        assigned securely by the salon, not through public registration.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="name" className="text-sm font-medium">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            placeholder="Your full name"
          />
        </div>

        <div>
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            placeholder="Min. 6 characters, 1 uppercase, 1 lowercase"
          />
        </div>

        <div>
          <label htmlFor="image" className="text-sm font-medium">
            Profile Image URL (optional)
          </label>
          <input
            id="image"
            type="url"
            value={image}
            onChange={(event) => setImage(event.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            placeholder="https://..."
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
          disabled={loading}
          className="w-full rounded-full bg-amber-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-amber-800 disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </form>

      <button
        type="button"
        onClick={handleGoogle}
        className="mt-4 w-full rounded-full border border-zinc-300 px-4 py-2.5 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
      >
        Continue with Google
      </button>

      <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-medium text-amber-700">
          Sign In
        </Link>
      </p>
    </main>
  );
}
