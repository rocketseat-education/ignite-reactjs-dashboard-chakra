import { createContext, useState, useContext, useEffect } from 'react';
import Router from 'next/router';
import { setCookie, destroyCookie, parseCookies } from 'nookies'
import { authClient } from '../services/authClient';

export type User = {
  email: string; 
  permissions: string[];
  roles: string[];
}

type SignInCredentials = {
  email: string;
  password: string;
}

type AuthContextData = {
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
  user: User;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function signOut() {
  destroyCookie(undefined, 'DashGo.token');
  destroyCookie(undefined, 'DashGo.refreshToken');

  Router.push('/');
}

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const { 'DashGo.token': token } = parseCookies();

    if (token) {
      authClient.get('/me')
        .then(response => {
          const { email, permissions, roles } = response.data

          setUser({
            email,
            permissions,
            roles,
          })
        })
        .catch(() => {
          signOut();
        });
    }
  }, []);

  async function signIn({ email, password }) {
    const response = await authClient.post('sessions', {
      email,
      password,
    });

    const { token, refreshToken, permissions, roles } = response.data;

    setCookie(undefined, 'DashGo.token', token, {
      maxAge: 60 * 60 * 24, // 1 day
      path: '/'
    });

    setCookie(undefined, 'DashGo.refreshToken', refreshToken, {
      maxAge: 60 * 60 * 24 * 15, // 15 days
      path: '/'
    });

    authClient.defaults.headers['Authorization'] = `Bearer ${token}`;

    setUser({
      email,
      permissions,
      roles
    })

    await Router.push('/dashboard');
  }

  return (
    <AuthContext.Provider value={{ signIn, signOut, user, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
