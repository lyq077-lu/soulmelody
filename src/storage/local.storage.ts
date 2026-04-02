/**
 * 存储服务接口
 * 当前阶段使用本地文件存储实现
 */

export interface StorageService {
  saveAudio(taskId: string, buffer: Buffer): Promise<string>;
  getAudioPath(taskId: string): string;
  saveMetadata(taskId: string, metadata: any): Promise<void>;
  getMetadata(taskId: string): Promise<any>;
  deleteTask(taskId: string): Promise<void>;
}

export class LocalStorageService implements StorageService {
  private basePath: string;

  constructor(basePath: string = './data') {
    this.basePath = basePath;
  }

  async saveAudio(taskId: string, buffer: Buffer): Promise<string> {
    // TODO: 实现音频文件保存
    const path = `${this.basePath}/audio/${taskId}/output.mp3`;
    return path;
  }

  getAudioPath(taskId: string): string {
    return `${this.basePath}/audio/${taskId}/output.mp3`;
  }

  async saveMetadata(taskId: string, metadata: any): Promise<void> {
    // TODO: 实现元数据保存
  }

  async getMetadata(taskId: string): Promise<any> {
    // TODO: 实现元数据读取
    return {};
  }

  async deleteTask(taskId: string): Promise<void> {
    // TODO: 实现任务删除
  }
}
