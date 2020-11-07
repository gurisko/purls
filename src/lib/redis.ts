import Redis from 'ioredis';

import {castArray} from '../utils/castArray';

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
export function getAsync(key: string|string[]): Promise<string | null | (string | null)[]> {
  const castedKey = castArray(key);
  return new Promise((resolve, reject) => redisClient.mget(castedKey.map((key) => addPrefix(key)), (err, reply) => {
    if (err) {
      return reject(err);
    }
    return resolve(Array.isArray(key) ? reply : reply[0]);
  }));
}

export function putAsync<T>(key: string, data: T): Promise<T> {
  return new Promise((resolve, reject) => redisClient.set(addPrefix(key), wrapValue(data), (err) => {
    if (err) {
      return reject(err);
    }
    return resolve(data);
  }));
}

export const client = redisClient;
