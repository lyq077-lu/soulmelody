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
}
