import { z } from 'zod';

export const generateSongSchema = z.object({
  lyrics: z.string().min(1).max(2000).describe('歌词内容'),
  style: z.enum(['pop', 'rock', 'folk', 'electronic', 'classical', 'jazz']).default('pop').describe('音乐风格'),
  mood: z.enum(['happy', 'sad', 'romantic', 'energetic', 'calm', 'epic']).default('happy').describe('情感氛围'),
  tempo: z.enum(['slow', 'medium', 'fast']).default('medium').describe('节奏速度'),
  userId: z.string().optional().describe('用户ID'),
});

export const taskStatusSchema = z.object({
  taskId: z.string().uuid().describe('任务ID'),
});

export type GenerateSongInput = z.infer<typeof generateSongSchema>;
