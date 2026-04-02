import { FastifyInstance } from 'fastify';

export async function healthRoutes(fastify: FastifyInstance) {
  fastify.get('/', async () => {
    return {
      status: 'ok',
      service: 'soulmelody',
      version: '0.1.0',
      timestamp: new Date().toISOString(),
    };
  });

  fastify.get('/ready', async () => {
    // TODO: 检查数据库、存储等依赖
    return {
      ready: true,
      checks: {
        storage: 'ok',
        database: 'ok',
      },
    };
  });
}
