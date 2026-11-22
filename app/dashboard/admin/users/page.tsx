"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { fetchAdminUsers, setUserBlocked, type AdminUser } from "@/lib/admin";
import toast from "react-hot-toast";

export default function ManageUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setUsers(await fetchAdminUsers());
    } catch {
      setError("Could not load users. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleToggle(user: AdminUser) {
    setActionId(user.id);
    setError("");
    try {
      await setUserBlocked(user.id, !user.isBlocked);
      toast.success(user.isBlocked ? "User unblocked." : "User blocked.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user.");
    } finally {
      setActionId("");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Manage Users</h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Registered customers. Blocked users cannot access protected
        features.
      </p>

      {loading && <p className="mt-6 text-sm text-zinc-500">Loading...</p>}
      {error && (
        <p className="mt-6 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {error}
        </p>
      )}
      {!loading && !error && users.length === 0 && (
        <p className="mt-6 text-sm text-zinc-500">No customers yet.</p>
      )}

      <div className="mt-6 space-y-3">
        {users.map((user) => (
          <article
            key={user.id}
            className="flex flex-col gap-3 rounded-2xl border border-zinc-200 p-4 sm:flex-row sm:items-center dark:border-zinc-800"
          >
            {user.image ? (
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full">
                <Image
                  src={user.image}
                  alt={user.name}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-200">
                {(user.name || "?").slice(0, 1).toUpperCase()}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="font-semibold">
                {user.name}{" "}
                {user.isBlocked && (
                  <span className="ml-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700 dark:bg-red-950 dark:text-red-300">
                    Blocked
                  </span>
                )}
              </p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {user.email}
                {user.phone ? ` · ${user.phone}` : ""}
                {user.createdAt
                  ? ` · Joined ${user.createdAt.slice(0, 10)}`
                  : ""}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle(user)}
              disabled={actionId === user.id}
              className={`rounded-full px-4 py-1.5 text-sm font-medium disabled:opacity-60 ${
                user.isBlocked
                  ? "bg-green-700 text-white hover:bg-green-800"
                  : "border border-red-300 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950"
              }`}
            >
              {user.isBlocked ? "Unblock User" : "Block User"}
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
