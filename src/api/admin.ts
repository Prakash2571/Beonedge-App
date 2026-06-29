import type { User } from '@/types';
import { api } from './client';

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
