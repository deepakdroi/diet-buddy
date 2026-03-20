export async function apiFetch<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error(`API ERROR [${url}]:`, errorText);

    throw new Error(errorText || "Something went wrong");
  }

  return res.json() as Promise<T>;
}
