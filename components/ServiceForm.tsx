"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SERVICE_CATEGORIES, type Service } from "@/lib/services";
import { createService, updateService } from "@/lib/admin";
import { uploadToImgBB } from "@/lib/profile";
import toast from "react-hot-toast";

export default function ServiceForm({ initial }: { initial?: Service }) {
  const router = useRouter();
  const [serviceName, setServiceName] = useState(initial?.serviceName || "");
  const [category, setCategory] = useState<string>(
    initial?.category || SERVICE_CATEGORIES[0]
  );
  const [description, setDescription] = useState(initial?.description || "");
  const [price, setPrice] = useState(
    initial ? String(initial.price) : ""
  );
  const [duration, setDuration] = useState(
    initial ? String(initial.duration) : ""
  );
  const [image, setImage] = useState(initial?.image || "");
  const [status, setStatus] = useState<"active" | "inactive">(
    initial?.status || "active"
  );
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      setImage(await uploadToImgBB(file));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Image upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (!image) {
      setError("Please upload a service image.");
      return;
    }
    const payload = {
      serviceName,
      category,
      description,
      price: Number(price),
      duration: Number(duration),
      image,
      status,
    };
    if (!payload.serviceName || !payload.description) {
      setError("Service name and description are required.");
      return;
    }
    if (!Number.isFinite(payload.price) || payload.price <= 0) {
      setError("Price must be a positive number.");
      return;
    }
    if (!Number.isFinite(payload.duration) || payload.duration <= 0) {
      setError("Duration must be a positive number.");
      return;
    }
    setSaving(true);
    try {
      if (initial) {
        await updateService(initial._id, payload);
        setSuccess("Service updated successfully.");
        toast.success("Service updated successfully.");
      } else {
        await createService(payload);
        setSuccess("Service created successfully.");
        toast.success("Service created successfully.");
      }
      setTimeout(() => router.push("/dashboard/admin/services"), 800);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save service.");
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900";

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
      <div>
        <label htmlFor="s-name" className="text-sm font-medium">
          Service Name
        </label>
        <input
          id="s-name"
          required
          value={serviceName}
          onChange={(event) => setServiceName(event.target.value)}
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="s-category" className="text-sm font-medium">
          Service Category
        </label>
        <select
          id="s-category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className={inputClass}
        >
          {SERVICE_CATEGORIES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="s-description" className="text-sm font-medium">
          Description
        </label>
        <textarea
          id="s-description"
          required
          rows={4}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className={inputClass}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="s-price" className="text-sm font-medium">
            Price (৳)
          </label>
          <input
            id="s-price"
            type="number"
            min="1"
            required
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="s-duration" className="text-sm font-medium">
            Estimated Duration (minutes)
          </label>
          <input
            id="s-duration"
            type="number"
            min="1"
            required
            value={duration}
            onChange={(event) => setDuration(event.target.value)}
            className={inputClass}
          />
        </div>
      </div>
      <div>
        <label htmlFor="s-upload" className="text-sm font-medium">
          Service Image (upload)
        </label>
        <input
          id="s-upload"
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="mt-1 w-full text-sm"
        />
        {uploading && (
          <p className="mt-1 text-xs text-zinc-500">Uploading image...</p>
        )}
        {image && (
          <div className="relative mt-3 h-40 w-full overflow-hidden rounded-xl">
            <Image
              src={image}
              alt="Service"
              fill
              sizes="(max-width: 768px) 100vw, 672px"
              className="object-cover"
            />
          </div>
        )}
      </div>
      <div>
        <label htmlFor="s-status" className="text-sm font-medium">
          Service Status
        </label>
        <select
          id="s-status"
          value={status}
          onChange={(event) =>
            setStatus(event.target.value as "active" | "inactive")
          }
          className={inputClass}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
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
        disabled={saving || uploading}
        className="rounded-full bg-amber-700 px-6 py-2.5 text-sm font-medium text-white hover:bg-amber-800 disabled:opacity-60"
      >
        {saving
          ? "Saving..."
          : initial
            ? "Update Service"
            : "Add Service"}
      </button>
    </form>
  );
}
