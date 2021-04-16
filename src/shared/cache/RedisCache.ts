import Redis, { Redis as RedisClient } from 'ioredis';
import cacheConfig from '@config/cache';

export default class RedisCache {
  private client: RedisClient;

  constructor() {
    this.client = new Redis(cacheConfig.config.redis);
  }

  public async save(key: string, value: any): Promise<void> {
    await this.client.set(key, JSON.stringify(value));
  }

  //  descrevendo que o metodo e aquele tipo generico com o "T" e a promessa tbm e desse tipo o "T"
  // public async recover<T>(key: string): Promise<T | null>{}

  //  Metodo para apagar cache
  // public async invalidate(key: string): Promise<void> {}
}
