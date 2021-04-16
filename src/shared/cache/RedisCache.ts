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
  public async recover<T>(key: string): Promise<T | null> {
    // buscar as informações pela key
    const data = await this.client.get(key);

    // se nao tiver nada nas keys
    if (!data) {
      return null;
    }

    // tem que fazer um parsed para devolover ao padrao original
    const parsedData = JSON.parse(data) as T;

    //  Depois fazer um retorno com os dados corretos
    return parsedData;
  }

  //  Metodo para apagar cache
  public async invalidate(key: string): Promise<void> {
    //  Pegar o cliente e faz um metodo del com a chave
    await this.client.del(key);
  }
}
