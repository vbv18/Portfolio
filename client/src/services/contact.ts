import type { ContactFormValues } from "@/types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export class ContactApiError extends Error {}

export async function sendContactMessage(values: ContactFormValues) {
  const res = await fetch(`${API_URL}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ContactApiError(
      data?.message ?? "Could not send your message. Please try again.",
    );
  }

  return data as { message: string };
}
