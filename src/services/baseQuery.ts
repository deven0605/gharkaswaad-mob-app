import { fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { Mutex } from 'async-mutex';
import { RootState } from '../store';
import { refreshCredentials, logout } from '../store/authSlice';
import { GATEWAY_BASE_URL } from '../config/api';
import { createLogger } from '../utils/logger';

const log = createLogger('src/services/baseQuery.ts');

// Mutex prevents multiple simultaneous refresh calls (e.g. two 401s at once)
const refreshMutex = new Mutex();

const rawBaseQuery = fetchBaseQuery({
  baseUrl: GATEWAY_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const url = typeof args === 'string' ? args : args.url;
  log.info('baseQueryWithReauth', 'start', { url });
  try {
    await refreshMutex.waitForUnlock();
    let result = await rawBaseQuery(args, api, extraOptions);

    if (result.error?.status !== 401) {
      if (result.error) {
        log.error('baseQueryWithReauth', 'end (request error)', { url, error: result.error });
      } else {
        log.info('baseQueryWithReauth', 'end', { url });
      }
      return result;
    }

    // --- 401 received — attempt a silent token refresh (FR-1.15) ---
    if (refreshMutex.isLocked()) {
      // Another request already refreshing; wait then retry with the new token
      await refreshMutex.waitForUnlock();
      result = await rawBaseQuery(args, api, extraOptions);
      log.info('baseQueryWithReauth', 'end (retried after concurrent refresh)', { url });
      return result;
    }

    const release = await refreshMutex.acquire();
    try {
      const currentRefreshToken = (api.getState() as RootState).auth.refreshToken;
      const refreshResult = await rawBaseQuery(
        {
          url: '/auth/customer/refresh',
          method: 'POST',
          body: { refreshToken: currentRefreshToken },
        },
        api,
        extraOptions,
      );

      if (refreshResult.data) {
        const { accessToken, refreshToken } = refreshResult.data as RefreshResponse;
        api.dispatch(refreshCredentials({ accessToken, refreshToken }));
        result = await rawBaseQuery(args, api, extraOptions);
      } else {
        log.error('baseQueryWithReauth', 'token refresh failed, logging out', { url });
        api.dispatch(logout());
      }
    } catch (err) {
      log.error('baseQueryWithReauth', 'error during token refresh', { url }, err);
      throw err;
    } finally {
      release();
    }

    log.info('baseQueryWithReauth', 'end (after refresh)', { url });
    return result;
  } catch (err) {
    log.error('baseQueryWithReauth', 'unhandled error', { url }, err);
    throw err;
  }
};
