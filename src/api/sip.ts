import type { AfterMaturedPayload, ChooseSipPayload, Sip } from '@/types';
import { api } from './client';

export async function getMySips(): Promise<Sip[]> {
  const { data } = await api.get<{ data: Sip[] }>('/getSIPsofuser');
  return data.data ?? [];
}

export async function getSip(sipId: string): Promise<Sip> {
  const { data } = await api.get<{ data: Sip }>(`/getSIP/${sipId}`);
  return data.data;
}

export async function getCompletedSips(): Promise<Sip[]> {
  const { data } = await api.get<{ sip: Sip[] }>('/getcompletedsips');
  return data.sip ?? [];
}

/**
 * The `choosingforsipbyuser` endpoint replies with a plain-text message and
 * uses HTTP 200 even for validation failures, so we return the raw text and
 * let the caller decide (success message starts with "Thanks").
 */
export async function chooseSip(payload: ChooseSipPayload): Promise<string> {
  const { data } = await api.post('/choosingforsipbyuser', payload);
  return typeof data === 'string' ? data : JSON.stringify(data);
}

export async function chooseAfterMatured(
  sipId: string,
  payload: AfterMaturedPayload
): Promise<string> {
  const { data } = await api.post(
    `/userchoosingafterfinshed/${sipId}`,
    payload
  );
  return typeof data === 'string' ? data : JSON.stringify(data);
}
