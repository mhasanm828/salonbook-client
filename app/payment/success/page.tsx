import Link from "next/link";

export default function PaymentSuccessPage() {
  return (
    <main className="mx-auto w-full max-w-md px-4 py-20 text-center sm:px-6">
      <p className="text-4xl">✅</p>
      <h1 className="mt-4 text-3xl font-bold tracking-tight">
        Payment Successful
      </h1>
      <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        Thank you! Your payment was received by Stripe. Your appointment
        payment status is updated automatically once Stripe confirms the
        payment through our secure webhook - this can take a few seconds.
      </p>
      <Link
        href="/dashboard/customer/appointments"
        className="mt-8 inline-block rounded-full bg-amber-700 px-6 py-2.5 text-sm font-medium text-white hover:bg-amber-800"
      >
        View My Appointments
      </Link>
    </main>
  );
}
