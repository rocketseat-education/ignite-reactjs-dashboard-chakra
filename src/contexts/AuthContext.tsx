import { createContext, useState, useContext, useEffect } from 'react';
import { setupAuthClient } from '../services/auth';
import nookies from 'nookies'
import Router from 'next/router';

interface User {
  email: string;
  permissions: string[];
  roles: string[];
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
  user: User;
  isAuthenticated: boolean;
  isAuthLoaded: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function signOut() {
  nookies.destroy(null, 'DashGo.token');
  nookies.destroy(null, 'DashGo.refreshToken');

  Router.push('/');
}

const auth = setupAuthClient();

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User>();
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);

  // useEffect(() => {
  //   const token = Cookie.get('DashGo.token');

  //   if (token) {
  //     auth.defaults.headers.authorization = `Bearer ${token}`;

  //     auth.get('/me')
  //       .then(response => {
  //         const { email, permissions, roles } = response.data

  //         setUser({
  //           email,
  //           permissions,
  //           roles,
  //         })

  //         setIsAuthLoaded(true);
  //       }).catch(err => {
  //         signOut();
  //       });
  //   } else {
  //     setIsAuthLoaded(true);
  //   }
  // }, []);

  async function signIn({ email, password }) {
    const response = await auth.post('sessions', {
      email,
      password,
    });

    const { token, refreshToken, permissions, roles } = response.data;

    nookies.set(null, 'DashGo.token', token, {
      maxAge: 60 * 60 * 24, // 1 day
    });

    nookies.set(null, 'DashGo.refreshToken', refreshToken, {
      maxAge: 60 * 60 * 24 * 15, // 15 days
    });

    auth.defaults.headers.authorization = `Bearer ${token}`;

    setUser({
      email,
      permissions,
      roles
    })
  }

  return (
    <AuthContext.Provider value={{ signIn, signOut, user, isAuthLoaded, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
