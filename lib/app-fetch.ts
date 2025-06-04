import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import { z } from "zod/v4-mini";

export const AppFetchError = z.object({
  status: z.number(),
  message: z.string(),
});

export type AppFetchErrorType = z.infer<typeof AppFetchError>;

export interface AppFetchProps {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string> | ReadonlyHeaders;
  body?: string | FormData;
}

export async function appFetch<T>({
  url,
  method,
  headers,
  body,
}: AppFetchProps): Promise<T> {
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body,
    credentials: "include",
  });

  if (!response.ok) {
    throw {
      status: response.status || 500,
      message: response.statusText || "An unexpected error occurred.",
    } as AppFetchErrorType;
  }

  // Cast the JSON response to `T`
  const result = (await response.json()) as T;
  return result;
}
