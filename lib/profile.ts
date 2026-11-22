import { API_URL } from "./services";

/** Upload an image file to ImgBB and return its public URL. */
export async function uploadToImgBB(file: File): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Image upload is not configured (NEXT_PUBLIC_IMGBB_API_KEY missing)."
    );
  }
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(
    `https://api.imgbb.com/1/upload?key=${apiKey}`,
    { method: "POST", body: formData }
  );
  const data = await response.json().catch(() => null);
  if (!response.ok || !data?.data?.display_url) {
    throw new Error("Image upload failed. Please try again.");
  }
  return data.data.display_url as string;
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  image: string;
  phone: string;
  role: string;
}

export async function fetchProfile(): Promise<Profile> {
  const response = await fetch(`${API_URL}/api/profile`, {
    credentials: "include",
    cache: "no-store",
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Failed to load profile");
  }
  return data.user as Profile;
}

export async function updateProfile(payload: {
  name?: string;
  image?: string;
  phone?: string;
}) {
  const response = await fetch(`${API_URL}/api/profile`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Failed to update profile");
  }
  return data;
}
