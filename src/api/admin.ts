import type { ChosenSip, ReinvestSip, User } from '@/types';
import { api } from './client';

/* ---------------- User management ---------------- */

export async function getPendingUsers(): Promise<User[]> {
  const { data } = await api.get<{ user: User[] }>('/pendingusers');
  return data.user ?? [];
}

export async function getAllUsers(): Promise<User[]> {
  const { data } = await api.get<{ user: User[] | null }>('/allUsers');
  return data.user ?? [];
}

export async function approveUser(userId: string): Promise<string> {
  const { data } = await api.patch(`/authorise/${userId}`, {});
  return typeof data === 'string' ? data : 'User approved';
}

export async function rejectUser(userId: string): Promise<string> {
  const { data } = await api.patch(`/rejectuser/${userId}`, {});
  return typeof data === 'string' ? data : 'User rejected';
}

/* ---------------- Payments ---------------- */

/** SIPs users have chosen and are awaiting their first/next payment. */
export async function getChosenSips(): Promise<ChosenSip[]> {
  const { data } = await api.get<ChosenSip[]>('/getuserwhojustchoosesip');
  return Array.isArray(data) ? data : [];
}

/**
 * Record a payment for a user's SIP (the transaction-wrapped endpoint).
 * Returns the backend's message; validation failures throw via axios.
 */
export async function recordPayment(
  userId: string,
  sipId: string,
  totalMonths: number,
  totalAmount: number
): Promise<string> {
  const { data } = await api.post<{ message?: string }>(
    `/dopaymentofuser/${userId}/${sipId}`,
    { totalMonths, totalAmount }
  );
  if (typeof data === 'string') return data;
  return data.message ?? 'Payment recorded';
}

/* ---------------- Reinvest ---------------- */

/** SIPs whose user requested a reinvest. */
export async function getReinvestRequests(): Promise<ReinvestSip[]> {
  const { data } = await api.get('/getuserswhowanttoreinvest');
  // The endpoint returns an array, or a plain string when there are none.
  return Array.isArray(data) ? (data as ReinvestSip[]) : [];
}

/** Set up the reinvested SIP for a user (transaction-wrapped). */
export async function setReinvest(
  userId: string,
  amount: number,
  months: number
): Promise<string> {
  const { data } = await api.post(`/setreinvestdata/${userId}`, {
    amount,
    months,
  });
  return typeof data === 'string' ? data : 'Reinvest set up';
}
