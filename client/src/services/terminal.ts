const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export class TerminalApiError extends Error {
  statusCode?: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = "TerminalApiError";
    this.statusCode = statusCode;
  }
}

export interface TerminalMessagePayload {
  role: "user" | "assistant";
  content: string;
}

export interface TerminalQueryResponse {
  reply: string;
  model?: string;
}

export interface TerminalInfoResponse {
  name: string;
  role: string;
  status: string;
  location: string;
  projects: Array<{
    id: string;
    title: string;
    tagline: string;
    tech: string[];
    githubUrl?: string;
    liveUrl?: string;
  }>;
  skills: Array<{
    id: string;
    title: string;
    eyebrow: string;
    items: string[];
  }>;
  email: string;
  linkedin: string;
  github: string;
  lastSyncedAt?: string;
}

export async function askTerminalAi(
  message: string,
  history: TerminalMessagePayload[] = [],
): Promise<TerminalQueryResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000);

  try {
    const res = await fetch(`${API_URL}/api/terminal`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new TerminalApiError(
        data?.message ?? "Unable to complete request. Please try again.",
        res.status,
      );
    }

    return data as TerminalQueryResponse;
  } catch (error: unknown) {
    clearTimeout(timeoutId);

    if (error instanceof TerminalApiError) {
      throw error;
    }

    if (error instanceof Error && error.name === "AbortError") {
      throw new TerminalApiError(
        "Request timed out. The server took too long to respond.",
      );
    }

    throw new TerminalApiError(
      "Unable to connect to the AI terminal service. Please ensure the backend server is running.",
    );
  }
}

export async function fetchTerminalInfo(): Promise<TerminalInfoResponse | null> {
  try {
    const res = await fetch(`${API_URL}/api/terminal/info`);
    if (!res.ok) return null;
    return (await res.json()) as TerminalInfoResponse;
  } catch {
    return null;
  }
}
