import { NextComponentType } from "next";
import Router from 'next/router'
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { validateUserRolesAndPermissions } from "./validateUserRolesAndPermissions";

type WithClientAuthOptions = {
  permissions?: string[];
  roles?: string[];
};

export function withClientAuth<P>(options?: WithClientAuthOptions) {
  return (Component: NextComponentType) => (props: P) => {
    const [isLoading, setIsLoading] = useState(true);
    const { user, isAuthenticated } = useAuth()

    useEffect(() => {
      async function checkAuthorization() {
        if (!isAuthenticated) {
          await Router.push('/')
          return;
        }
    
        if (options) {
          const { permissions, roles } = options
    
          const userCanSeeTheComponent = validateUserRolesAndPermissions({
            user,
            permissions,
            roles,
          })
    
          if (!userCanSeeTheComponent) {
            await Router.push('/dashboard')
            return;
          }
        }

        setIsLoading(false);
      }

      checkAuthorization();
    }, [isAuthenticated, user, options])

    if (isLoading) {
      return null;
    }
    
    return <Component {...props} />;
  };
}