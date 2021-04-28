import { parseCookies, setCookie } from 'nookies';
import axios, { AxiosError } from 'axios'

import { signOut } from '../contexts/AuthContext';
import { RefreshTokenError } from './errors/RefreshTokenError';

let isRefreshing = false;
let failedRequestsQueue = [];

export function setupAuthClient(ctx: any = null) {
  let cookies = parseCookies(ctx);

  const auth = axios.create({
    baseURL: 'http://localhost:3333',
    headers: {
      Authorization: `Bearer ${cookies['DashGo.token']}`
    }
  })

  auth.interceptors.response.use(response => {
    return response;
  }, (error: AxiosError) => {
    if (error.response.status === 401) {
      if (error.response.data?.code === 'token.expired') {
        cookies = parseCookies(ctx);

        const refreshToken = cookies['DashGo.refreshToken']
  
        const { config: originalConfig } = error
    
        if (!isRefreshing) {
          isRefreshing = true
  
          auth.post('/refresh', {
            refreshToken,
          }).then(response => {
            const token = response.data.token;
  
            setCookie(ctx, 'DashGo.token', token, {
              maxAge: 60 * 60 * 24, // 1 day
              path: '/'
            });
        
            setCookie(ctx, 'DashGo.refreshToken', response.data.refreshToken, {
              maxAge: 60 * 60 * 24 * 15, // 15 days
              path: '/'
            });

            auth.defaults.headers['Authorization'] = `Bearer ${token}`;
  
            failedRequestsQueue.forEach((v) => v.resolve(token))
            failedRequestsQueue = []
          }).catch(err => {
            failedRequestsQueue.forEach((v) => v.reject(new RefreshTokenError()))
            failedRequestsQueue = []
  
            if (process.browser) {
              signOut()
            }
          }).finally(() => {
            isRefreshing = false
          })
        }
    
        return new Promise((originalResolve, originalReject) => {
          failedRequestsQueue.push({
            resolve: (token: string) => {
              originalConfig.headers['Authorization'] = `Bearer ${token}`;
  
              originalResolve(auth(originalConfig))
            },
            reject: (err: AxiosError) => {
              originalReject(err)
            },
          })
        })
      } else {
        if (process.browser) {
          signOut()
        } else {
          return Promise.reject(new RefreshTokenError());
        }
      }
    }
  
    return Promise.reject(error);
  })

  return auth;
}



