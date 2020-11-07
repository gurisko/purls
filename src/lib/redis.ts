import Redis from 'ioredis';

import {castArray} from '../utils/castArray';

const redisClient = new Redis(process.env.REDIS_URL);

function wrapValue(value: unknown): string {
  return typeof value === 'string' ? value : JSON.stringify(value);
}

function addPrefix(key: string) {
  const {REDIS_PREFIX} = process.env;
  return REDIS_PREFIX ? `${REDIS_PREFIX}:${key}` : key;
}

export function getAsync(key: string): Promise<string | null>;
export function getAsync(key: string[]): Promise<(string | null)[]>;
export async function getAsync(key: string|string[]): Promise<string | null | (string | null)[]> {
  const keys = castArray(key);
  const data = await redisClient
    .pipeline(keys.map((key) => ['get', addPrefix(key)]))
    .exec();
  const results = data.map(([, result]) => result);
  return results.length === 1 ? results[0] : results;
}

export async function setAsync<T>(key: string, data: T): Promise<T> {
  const {REDIS_EXPIRY} = process.env;
  const expiryArgs = REDIS_EXPIRY && +REDIS_EXPIRY > 0
    ? ['EX', REDIS_EXPIRY]
    : [];
  await redisClient.set(addPrefix(key), wrapValue(data), ...expiryArgs);
  return data;
}

export const client = redisClient;
