import { QueryClient } from 'react-query'
import { api } from './api';

const queryFn = async ({ queryKey }) => {
  const { data } = await api.get(`${queryKey[0]}`);

  return data;
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn
    }
  }
})