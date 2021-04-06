import { useMutation } from "react-query";
import { api } from "../api";

type CreateUserInput = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export async function createUser(user: CreateUserInput) {
  const response = await api.post('users', { 
    user: {
      ...user, 
      created_at: new Date()
    } 
  })

  return response.data.user;
}

export function useCreateUser() {
  return useMutation(createUser)
}