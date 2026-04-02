import { FastifyInstance } from 'fastify';
import { songService } from '../index';

export async function songRoutes(fastify: FastifyInstance) {
  // 创建歌曲生成任务
  fastify.post('/generate', async (request, reply) => {
    const { lyrics, style, mood, tempo, userId } = request.body as any;
    
    const task = await songService.createTask({
      lyrics,
      style,
      mood,
      tempo,
      userId: userId || 'anonymous',
    });
    
    return {
      success: true,
      taskId: task.id,
      message: '歌曲生成任务已创建',
      estimatedTime: task.estimatedTime,
    };
  });

  // 查询生成状态
  fastify.get('/status/:taskId', async (request) => {
    const { taskId } = request.params as any;
    const task = await songService.getTask(taskId);
    
    if (!task) {
      throw { statusCode: 404, message: '任务不存在' };
    }
    
    return {
      taskId: task.id,
      status: task.status,
      progress: task.progress,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      result: task.result,
    };
  });

  // 获取生成的歌曲列表
  fastify.get('/list', async (request) => {
    const { userId, page = 1, limit = 10 } = request.query as any;
    const songs = await songService.listSongs(userId, parseInt(page), parseInt(limit));
    
    return {
      success: true,
      data: songs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: songs.length,
      },
    };
  });

  // 获取单个歌曲详情
  fastify.get('/:taskId', async (request) => {
    const { taskId } = request.params as any;
    const song = await songService.getTask(taskId);
    
    if (!song) {
      throw { statusCode: 404, message: '歌曲不存在' };
    }
    
    return {
      success: true,
      data: song,
    };
  });

  // 下载音频文件
  fastify.get('/download/:taskId', async (request, reply) => {
    const { taskId } = request.params as any;
    const task = await songService.getTask(taskId);
    
    if (!task || task.status !== 'completed') {
      throw { statusCode: 404, message: '音频文件不存在或未生成完成' };
    }
    
    // 重定向到静态文件路径
    return reply.redirect(`/data/audio/${taskId}/output.mp3`);
  });

  // 删除歌曲
  fastify.delete('/:taskId', async (request) => {
    const { taskId } = request.params as any;
    await songService.deleteTask(taskId);
    
    return {
      success: true,
      message: '歌曲已删除',
    };
  });
}
