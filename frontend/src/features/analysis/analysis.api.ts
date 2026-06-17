async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  if (!res.ok) throw new Error('Request failed');
  return res.json();
}

export const analysisApi = {
  create: (memberProfileIds: string[]) =>
    apiFetch('/api/v1/analyses', {
      method: 'POST',
      body: JSON.stringify({ memberProfileIds }),
    }),
  get: (id: string) => apiFetch(`/api/v1/analyses/${id}`),
  list: () => apiFetch<Array<{ id: string; status: string }>>('/api/v1/analyses'),
};
