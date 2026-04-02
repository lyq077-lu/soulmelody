import { v4 as uuidv4 } from 'uuid';
import { StorageService } from '../storage/local.storage';
import { logger } from '../utils/logger';

export interface SongTask {
  id: string;
  userId: string;
  lyrics: string;
  style: string;
  mood: string;
  tempo: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  estimatedTime: number;
  createdAt: string;
  updatedAt: string;
  result?: {
    audioUrl?: string;
    duration?: number;
    format?: string;
    sampleRate?: number;
  };
  error?: string;
}

export interface CreateTaskInput {
  lyrics: string;
  style: string;
  mood: string;
  tempo: string;
  userId: string;
}

export class SongService {
  private storage: StorageService;
  private tasks: Map<string, SongTask> = new Map();

  constructor(storage: StorageService) {
    this.storage = storage;
    this.loadTasks();
  }

  async createTask(input: CreateTaskInput): Promise<SongTask> {
    const task: SongTask = {
      id: uuidv4(),
      userId: input.userId,
      lyrics: input.lyrics,
      style: input.style,
      mood: input.mood,
      tempo: input.tempo,
      status: 'pending',
      progress: 0,
      estimatedTime: 60, // 预估60秒
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.tasks.set(task.id, task);
    await this.saveTask(task);

    // 模拟异步处理
    this.processTask(task.id);

    logger.info({ taskId: task.id }, '创建歌曲生成任务');
    return task;
  }

  async getTask(taskId: string): Promise<SongTask | undefined> {
    // 先从内存获取
    let task = this.tasks.get(taskId);
    
    // 如果内存没有，尝试从存储加载
    if (!task) {
      task = await this.storage.getMetadata(taskId);
      if (task) {
        this.tasks.set(taskId, task);
      }
    }
    
    return task;
  }

  async listSongs(userId?: string, page: number = 1, limit: number = 10): Promise<SongTask[]> {
    let songs = Array.from(this.tasks.values());
    
    if (userId) {
      songs = songs.filter(s => s.userId === userId);
    }
    
    // 按创建时间倒序
    songs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    // 分页
    const start = (page - 1) * limit;
    const end = start + limit;
    
    return songs.slice(start, end);
  }

  async deleteTask(taskId: string): Promise<void> {
    this.tasks.delete(taskId);
    await this.storage.deleteTask(taskId);
    logger.info({ taskId }, '删除歌曲任务');
  }

  async getAudioFile(taskId: string): Promise<string | null> {
    const task = await this.getTask(taskId);
    if (!task || task.status !== 'completed') {
      return null;
    }
    return this.storage.getAudioPath(taskId);
  }

  private async processTask(taskId: string): Promise<void> {
    const task = this.tasks.get(taskId);
    if (!task) return;

    try {
      task.status = 'processing';
      task.updatedAt = new Date().toISOString();
      await this.saveTask(task);

      logger.info({ taskId }, '开始处理歌曲生成任务');

      // 模拟处理过程
      for (let i = 0; i <= 100; i += 20) {
        await this.delay(2000);
        task.progress = i;
        task.updatedAt = new Date().toISOString();
        await this.saveTask(task);
      }

      // 模拟生成完成
      task.status = 'completed';
      task.progress = 100;
      task.result = {
        audioUrl: `/api/v1/songs/download/${taskId}`,
        duration: 180 + Math.floor(Math.random() * 120), // 3-5分钟
        format: 'mp3',
        sampleRate: 44100,
      };
      task.updatedAt = new Date().toISOString();
      
      await this.saveTask(task);
      logger.info({ taskId }, '歌曲生成任务完成');

    } catch (error) {
      task.status = 'failed';
      task.error = error instanceof Error ? error.message : '未知错误';
      task.updatedAt = new Date().toISOString();
      await this.saveTask(task);
      logger.error({ taskId, error }, '歌曲生成任务失败');
    }
  }

  private async saveTask(task: SongTask): Promise<void> {
    await this.storage.saveMetadata(task.id, task);
  }

  private async loadTasks(): Promise<void> {
    // 从存储加载所有任务（简化版，实际应分页加载）
    logger.info('加载历史任务');
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
