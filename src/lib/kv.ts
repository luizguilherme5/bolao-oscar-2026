/* eslint-disable @typescript-eslint/no-explicit-any */

// In-memory fallback for local development (no Redis needed)
const memoryStore: Record<string, any> = {};
const memorySets: Record<string, Set<string>> = {};

interface KVStore {
  get<T = any>(key: string): Promise<T | null>;
  set(key: string, value: any): Promise<void>;
  del(key: string): Promise<void>;
  sadd(key: string, ...members: string[]): Promise<void>;
  smembers(key: string): Promise<string[]>;
  srem(key: string, ...members: string[]): Promise<void>;
}

function createMemoryStore(): KVStore {
  return {
    async get<T = any>(key: string): Promise<T | null> {
      const val = memoryStore[key];
      return val !== undefined ? val as T : null;
    },
    async set(key: string, value: any): Promise<void> {
      memoryStore[key] = value;
    },
    async del(key: string): Promise<void> {
      delete memoryStore[key];
    },
    async sadd(key: string, ...members: string[]): Promise<void> {
      if (!memorySets[key]) memorySets[key] = new Set();
      members.forEach((m) => memorySets[key].add(m));
    },
    async smembers(key: string): Promise<string[]> {
      return Array.from(memorySets[key] || []);
    },
    async srem(key: string, ...members: string[]): Promise<void> {
      if (memorySets[key]) {
        members.forEach((m) => memorySets[key].delete(m));
      }
    },
  };
}

async function createVercelKVStore(): Promise<KVStore> {
  const { kv } = await import("@vercel/kv");
  return {
    async get<T = any>(key: string): Promise<T | null> {
      return kv.get<T>(key);
    },
    async set(key: string, value: any): Promise<void> {
      await kv.set(key, value);
    },
    async del(key: string): Promise<void> {
      await kv.del(key);
    },
    async sadd(key: string, ...members: string[]): Promise<void> {
      for (const m of members) {
        await kv.sadd(key, m);
      }
    },
    async smembers(key: string): Promise<string[]> {
      return kv.smembers(key);
    },
    async srem(key: string, ...members: string[]): Promise<void> {
      for (const m of members) {
        await kv.srem(key, m);
      }
    },
  };
}

let kvInstance: KVStore | null = null;

export async function getKV(): Promise<KVStore> {
  if (kvInstance) return kvInstance;

  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    kvInstance = await createVercelKVStore();
  } else {
    console.warn("No Vercel KV configured, using in-memory store (data will be lost on restart)");
    kvInstance = createMemoryStore();
  }

  return kvInstance;
}
