import Redis from 'ioredis';

import {castArray} from '../utils/castArray';

const REDIS_EXPIRY = 3600;
const REDIS_PREFIX = 'purls';

const redisClient = new Redis(process.env.REDIS_URL);

function wrapValue(value: unknown): string {
  return typeof value === 'string' ? value : JSON.stringify(value);
}

function addPrefix(key: string) {
  return `${REDIS_PREFIX}:${key}`;
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

export async function putAsync<T>(key: string, data: T): Promise<T> {
  await redisClient.set(addPrefix(key), wrapValue(data), 'EX', REDIS_EXPIRY);
  return data;
}

export const client = redisClient;
