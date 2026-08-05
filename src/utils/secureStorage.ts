import * as SecureStore from 'expo-secure-store';
import { createLogger } from './logger';

const log = createLogger('src/utils/secureStorage.ts');

const ACCESS_KEY = 'gks_access_token';
const REFRESH_KEY = 'gks_refresh_token';

export async function saveTokens(accessToken: string, refreshToken: string) {
  log.info('saveTokens', 'start');
  try {
    await Promise.all([
      SecureStore.setItemAsync(ACCESS_KEY, accessToken),
      SecureStore.setItemAsync(REFRESH_KEY, refreshToken),
    ]);
    log.info('saveTokens', 'end');
  } catch (err) {
    log.error('saveTokens', 'failed to save tokens', {}, err);
    throw err;
  }
}

export async function loadTokens(): Promise<{ accessToken: string; refreshToken: string } | null> {
  log.info('loadTokens', 'start');
  try {
    const [accessToken, refreshToken] = await Promise.all([
      SecureStore.getItemAsync(ACCESS_KEY),
      SecureStore.getItemAsync(REFRESH_KEY),
    ]);
    if (!accessToken || !refreshToken) {
      log.info('loadTokens', 'end (no tokens found)');
      return null;
    }
    log.info('loadTokens', 'end');
    return { accessToken, refreshToken };
  } catch (err) {
    log.error('loadTokens', 'failed to load tokens', {}, err);
    throw err;
  }
}

export async function clearTokens() {
  log.info('clearTokens', 'start');
  try {
    await Promise.all([
      SecureStore.deleteItemAsync(ACCESS_KEY),
      SecureStore.deleteItemAsync(REFRESH_KEY),
    ]);
    log.info('clearTokens', 'end');
  } catch (err) {
    log.error('clearTokens', 'failed to clear tokens', {}, err);
    throw err;
  }
}
