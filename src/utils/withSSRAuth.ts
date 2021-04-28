import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { parseCookies } from 'nookies';
import decode from 'jwt-decode'
import { User } from '../contexts/AuthContext';
import { validateUserRolesAndPermissions } from './validateUserRolesAndPermissions';

type WithSSRAuthOptions = {
  permissions?: string[];
  roles?: string[];
}

export function withSSRAuth<P>(fn: GetServerSideProps<P>, options?: WithSSRAuthOptions) {
  
  return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
    const { "DashGo.token": token } = parseCookies(ctx);

    if (!token) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        }
      }
    }

    if (options) {
      const user = decode(token) as User;
      const { permissions, roles } = options;

      const userHasPermission = validateUserRolesAndPermissions({
        user,
        permissions,
        roles,
      })

      if (!userHasPermission) {
        return {
          notFound: true,
        }
      }
    }

    return await fn(ctx);
  }
}