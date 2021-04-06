import { AxiosError } from "axios";
import { useQuery } from "react-query";
import { api } from "../api";

type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export async function getUser(userId: string): Promise<User> {
  const response = await api.get(`user/${userId}`)

  const { user } = response.data;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: new Date(user.created_at).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }
}

export function fetchUser({ queryKey }) {
  const [, userId] = queryKey as string[]

  return getUser(userId)
}

export function useUser(userId: string) {
  return useQuery(['user', userId], fetchUser, {
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
}