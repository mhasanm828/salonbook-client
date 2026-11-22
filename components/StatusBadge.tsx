export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending:
      "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
    confirmed:
      "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200",
    paid: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200",
    unpaid:
      "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
    active:
      "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200",
    inactive: "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  };
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${styles[status] || styles.unpaid}`}
    >
      {status}
    </span>
  );
}

export function StatCard({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
      <p className="text-sm text-zinc-500">{label}</p>
      <p className="mt-1 text-3xl font-bold">{value}</p>
    </div>
  );
}
