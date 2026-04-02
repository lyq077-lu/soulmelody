import Fastify from 'fastify';
import cors from '@fastify/cors';
import { songRoutes } from './api/song.routes';
import { healthRoutes } from './api/health.routes';

const server = Fastify({
  logger: true,
});

async function main() {
  // 注册插件
  await server.register(cors, {
    origin: true,
  });

  // 注册路由
  await server.register(healthRoutes, { prefix: '/health' });
  await server.register(songRoutes, { prefix: '/api/v1/songs' });

  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const HOST = process.env.HOST || '0.0.0.0';

  try {
    await server.listen({ port: PORT, host: HOST });
    server.log.info(`🎵 音灵AI SoulMelody 服务已启动: http://${HOST}:${PORT}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

main();
