"use client";

import { useEffect, useState } from "react";
import { fetchTransactions, type Transaction } from "@/lib/admin";
import { StatusBadge } from "@/components/StatusBadge";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTransactions()
      .then(setTransactions)
      .catch(() =>
        setError("Could not load transactions. Please try again later.")
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Payments recorded from verified Stripe webhook events. Records
        cannot be edited manually.
      </p>

      {loading && <p className="mt-6 text-sm text-zinc-500">Loading...</p>}
      {error && (
        <p className="mt-6 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {error}
        </p>
      )}
      {!loading && !error && transactions.length === 0 && (
        <p className="mt-6 text-sm text-zinc-500">No transactions yet.</p>
      )}

      <div className="mt-6 space-y-3">
        {transactions.map((transaction) => (
          <article
            key={transaction._id}
            className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800"
          >
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-semibold">{transaction.serviceName}</h2>
              <StatusBadge status={transaction.status} />
            </div>
            <dl className="mt-2 grid gap-1 text-sm text-zinc-600 sm:grid-cols-2 dark:text-zinc-400">
              <div>
                Customer: {transaction.customerName || "-"} (
                {transaction.customerEmail})
              </div>
              <div>
                Amount: {transaction.amount}{" "}
                {transaction.currency.toUpperCase()}
              </div>
              <div>Appointment Date: {transaction.appointmentDate}</div>
              <div>
                Transaction Date:{" "}
                {transaction.createdAt
                  ? transaction.createdAt.slice(0, 10)
                  : "-"}
              </div>
              <div className="sm:col-span-2">
                Stripe Session: {transaction.stripeSessionId.slice(0, 24)}...
              </div>
            </dl>
          </article>
        ))}
      </div>
    </div>
  );
}
