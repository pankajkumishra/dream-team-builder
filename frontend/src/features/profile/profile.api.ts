import type { ProfileResponse } from '@dream-team/shared';

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message ?? 'Request failed');
  }
  return res.json();
}

export const profileApi = {
  getMe: () => apiFetch<ProfileResponse>('/api/v1/profiles/me'),
  updateMe: (data: Record<string, unknown>) =>
    apiFetch<ProfileResponse>('/api/v1/profiles/me', { method: 'PATCH', body: JSON.stringify(data) }),
  getAssessment: () => apiFetch<Record<string, unknown>>('/api/v1/profiles/me/assessment'),
  updateAssessment: (data: { responses: Record<string, number>; submit: boolean }) =>
    apiFetch('/api/v1/profiles/me/assessment', { method: 'PUT', body: JSON.stringify(data) }),
  skipAssessment: () => apiFetch('/api/v1/profiles/me/assessment/skip', { method: 'POST' }),
  addPastProject: (data: Record<string, unknown>) =>
    apiFetch('/api/v1/profiles/me/past-projects', { method: 'POST', body: JSON.stringify(data) }),
};
