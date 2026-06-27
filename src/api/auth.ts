import type { SignupPayload, User } from '@/types';
import { api, clearToken, setToken } from './client';

interface LoginResponse {
  user: User;
  token?: string;
  success?: boolean;
}

export async function login(email: string, password: string): Promise<User> {
  const { data } = await api.post<LoginResponse>('/userlogin', {
    email,
    password,
  });
  if (data.token) {
    await setToken(data.token);
  }
  return data.user;
}

export async function signup(payload: SignupPayload): Promise<User> {
  // The backend creates the account then we immediately log in to get a token.
  await api.post('/usersignup', payload);
  return login(payload.email, payload.password);
}

export async function fetchProfile(): Promise<User> {
  const { data } = await api.get<{ user: User }>('/profileView');
  return data.user;
}

export async function logout(): Promise<void> {
  try {
    await api.post('/logout');
  } finally {
    await clearToken();
  }
}
