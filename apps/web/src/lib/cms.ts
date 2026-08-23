"use client";

import { apiUrl } from "@/lib/api";

export async function cmsFetch(path: string, init?: RequestInit) {
  const res = await fetch(apiUrl(path), {
    ...init,
    credentials: "include",
    headers: {
      ...(init?.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(init?.headers || {}),
    },
  });
  if (res.status === 401) {
    throw new Error("unauthorized");
  }
  if (!res.ok) {
    throw new Error(await res.text());
  }
  return res.json();
}

export async function uploadFile(file: File) {
  const body = new FormData();
  body.append("file", file);
  const res = await fetch(apiUrl("/cms/uploads"), {
    method: "POST",
    credentials: "include",
    body,
  });
  if (!res.ok) throw new Error("upload failed");
  return res.json() as Promise<{ url: string }>;
}
