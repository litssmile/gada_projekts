export type ApiUser = { id: number; ssn: string; name: string };
export type ApiReservation = {
  id: number;
  studentName: string;
  className: string;
  date: string;
  reason: string;
  notes: string;
  status: 'pending' | 'approved' | 'denied';
  submittedDate: string;
};

const API_BASE = import.meta.env.VITE_API_BASE || '';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    credentials: 'include',
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || (data && data.ok === false)) {
    const msg = (data && data.error) ? String(data.error) : `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data as T;
}

export const api = {
  login: (ssn: string, name: string) =>
    request<{ ok: true; user: ApiUser }>('/api/login.php', {
      method: 'POST',
      body: JSON.stringify({ ssn, name }),
    }),

  logout: () => request<{ ok: true }>('/api/logout.php', { method: 'POST' }),

  me: () => request<{ ok: true; user: ApiUser | null }>('/api/me.php'),

  listReservations: () =>
    request<{ ok: true; reservations: ApiReservation[] }>('/api/reservations/list.php'),

  createReservation: (payload: Omit<ApiReservation, 'id' | 'status' | 'submittedDate'>) =>
    request<{ ok: true; reservation: ApiReservation }>('/api/reservations/create.php', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};
