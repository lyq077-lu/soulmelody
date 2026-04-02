import { FastifyInstance } from 'fastify';

export async function userRoutes(fastify: FastifyInstance) {
  // 获取用户信息
  fastify.get('/:userId/songs', async (request) => {
    const { userId } = request.params as any;
    const { page = 1, limit = 10 } = request.query as any;
    
    // TODO: 从数据库查询用户歌曲
    return {
      success: true,
      userId,
      data: [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: 0,
      },
    };
  });

  // 获取用户统计
  fastify.get('/:userId/stats', async (request) => {
    const { userId } = request.params as any;
    
    return {
      success: true,
      userId,
      stats: {
        totalSongs: 0,
        totalDuration: 0,
        favoriteStyle: null,
      },
    };
  });
}
