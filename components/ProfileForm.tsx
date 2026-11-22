"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchProfile, updateProfile, uploadToImgBB } from "@/lib/profile";
import toast from "react-hot-toast";

export default function ProfileForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchProfile()
      .then((profile) => {
        setName(profile.name);
        setEmail(profile.email);
        setImage(profile.image);
        setPhone(profile.phone);
      })
      .catch(() =>
        setError("Could not load your profile. Please try again later.")
      )
      .finally(() => setLoading(false));
  }, []);

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const url = await uploadToImgBB(file);
      setImage(url);
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
    setSaving(true);
    try {
      await updateProfile({ name, image, phone });
      setSuccess("Profile updated successfully.");
      toast.success("Profile updated successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-sm text-zinc-500">Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Update your name, profile image and phone number. Your role cannot
        be changed from here.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 max-w-lg space-y-4">
        {image && (
          <div className="relative h-24 w-24 overflow-hidden rounded-full">
            <Image
              src={image}
              alt="Profile"
              fill
              sizes="96px"
              className="object-cover"
            />
          </div>
        )}
        <div>
          <label htmlFor="p-name" className="text-sm font-medium">
            Full Name
          </label>
          <input
            id="p-name"
            type="text"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
        <div>
          <label htmlFor="p-email" className="text-sm font-medium">
            Email (cannot be changed)
          </label>
          <input
            id="p-email"
            type="email"
            value={email}
            disabled
            className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900"
          />
        </div>
        <div>
          <label htmlFor="p-phone" className="text-sm font-medium">
            Phone Number
          </label>
          <input
            id="p-phone"
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            placeholder="+880..."
          />
        </div>
        <div>
          <label htmlFor="p-image" className="text-sm font-medium">
            Profile Image URL
          </label>
          <input
            id="p-image"
            type="url"
            value={image}
            onChange={(event) => setImage(event.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            placeholder="https://..."
          />
        </div>
        <div>
          <label htmlFor="p-upload" className="text-sm font-medium">
            Or upload an image
          </label>
          <input
            id="p-upload"
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="mt-1 w-full text-sm"
          />
          {uploading && (
            <p className="mt-1 text-xs text-zinc-500">Uploading image...</p>
          )}
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
          disabled={saving}
          className="rounded-full bg-amber-700 px-6 py-2.5 text-sm font-medium text-white hover:bg-amber-800 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
