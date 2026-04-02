import Fastify from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import { songRoutes } from './api/song.routes';
import { healthRoutes } from './api/health.routes';
import { userRoutes } from './api/user.routes';
import { LocalStorageService } from './storage/local.storage';
import { SongService } from './core/song.service';
import fastifyStatic from '@fastify/static';

const server = Fastify({
  logger: true,
});

// 全局服务实例
export const storageService = new LocalStorageService('./data');
export const songService = new SongService(storageService);

async function main() {
  // 注册插件
  await server.register(cors, {
    origin: true,
    credentials: true,
  });

  await server.register(multipart, {
    limits: {
      fileSize: 50 * 1024 * 1024, // 50MB
    },
  });

  // 注册静态文件服务
  await server.register(fastifyStatic, {
    root: storageService.getBasePath(),
    prefix: '/data/',
  });

  // 注册路由
  await server.register(healthRoutes, { prefix: '/health' });
  await server.register(songRoutes, { prefix: '/api/v1/songs' });
  await server.register(userRoutes, { prefix: '/api/v1/users' });

  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const HOST = process.env.HOST || '0.0.0.0';

  try {
    await server.listen({ port: PORT, host: HOST });
    server.log.info(`🎵 音灵AI SoulMelody 服务已启动: http://${HOST}:${PORT}`);
    server.log.info(`📁 数据存储目录: ${storageService.getBasePath()}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

main();
