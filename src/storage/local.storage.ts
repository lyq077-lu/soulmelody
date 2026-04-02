import fs from 'fs/promises';
import path from 'path';
import { logger } from '../utils/logger';

export interface StorageService {
  saveAudio(taskId: string, buffer: Buffer): Promise<string>;
  getAudioPath(taskId: string): string;
  saveMetadata(taskId: string, metadata: any): Promise<void>;
  getMetadata(taskId: string): Promise<any>;
  deleteTask(taskId: string): Promise<void>;
  getBasePath(): string;
}

export class LocalStorageService implements StorageService {
  private basePath: string;

  constructor(basePath: string = './data') {
    this.basePath = path.resolve(basePath);
    this.ensureDirectories();
  }

  getBasePath(): string {
    return this.basePath;
  }

  private async ensureDirectories(): Promise<void> {
    const dirs = [
      this.basePath,
      path.join(this.basePath, 'audio'),
      path.join(this.basePath, 'meta'),
      path.join(this.basePath, 'temp'),
    ];

    for (const dir of dirs) {
      try {
        await fs.mkdir(dir, { recursive: true });
      } catch (err) {
        logger.error({ dir, err }, '创建目录失败');
      }
    }
  }

  async saveAudio(taskId: string, buffer: Buffer): Promise<string> {
    const dir = path.join(this.basePath, 'audio', taskId);
    await fs.mkdir(dir, { recursive: true });
    
    const filePath = path.join(dir, 'output.mp3');
    await fs.writeFile(filePath, buffer);
    
    logger.info({ taskId, filePath }, '保存音频文件');
    return filePath;
  }

  getAudioPath(taskId: string): string {
    return path.join(this.basePath, 'audio', taskId, 'output.mp3');
  }

  async saveMetadata(taskId: string, metadata: any): Promise<void> {
    const dir = path.join(this.basePath, 'meta');
    await fs.mkdir(dir, { recursive: true });
    
    const filePath = path.join(dir, `${taskId}.json`);
    await fs.writeFile(filePath, JSON.stringify(metadata, null, 2));
  }

  async getMetadata(taskId: string): Promise<any> {
    const filePath = path.join(this.basePath, 'meta', `${taskId}.json`);
    
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      return null;
    }
  }

  async deleteTask(taskId: string): Promise<void> {
    // 删除音频文件
    const audioDir = path.join(this.basePath, 'audio', taskId);
    try {
      await fs.rm(audioDir, { recursive: true, force: true });
    } catch (err) {
      // 忽略不存在的错误
    }

    // 删除元数据
    const metaPath = path.join(this.basePath, 'meta', `${taskId}.json`);
    try {
      await fs.unlink(metaPath);
    } catch (err) {
      // 忽略不存在的错误
    }
  }
}
