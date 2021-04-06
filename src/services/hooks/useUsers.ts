import { useQuery } from "react-query";
import { api } from "../api";

type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

type GetUsersReponse = {
  users: User[];
  totalCount: number;
}

export async function getUsers(page?: number): Promise<GetUsersReponse> {
  const response = await api.get('users', {
    params: { page }
  })

  const users = response.data.users.map(user => {
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
  });

  return {
    users,
    totalCount: Number(response.headers['x-total-count'])
  }
}

export function useUsers(page: number) {
  return useQuery(['users', page], () => getUsers(page), {
    staleTime: 1000 * 60 * 10, // 10 minutes
    keepPreviousData: true,
  })
}