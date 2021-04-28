import { useAuth } from "../contexts/AuthContext";

export function useUser() {
  const { user } = useAuth();

  return user;
}