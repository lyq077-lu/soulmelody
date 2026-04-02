/**
 * 音灵AI - 核心引擎
 * SoulMelody Core Engine
 */

const fs = require('fs');
const path = require('path');

class SoulMelody {
  constructor(options = {}) {
    this.dataDir = options.dataDir || path.join(__dirname, '../data');
    this.ensureDataDir();
  }

  ensureDataDir() {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
  }

  /**
   * 生成简单的旋律模式
   * @param {Object} config - 配置参数
   * @returns {Object} 生成的旋律数据
   */
  generateMelody(config = {}) {
    const {
      scale = 'C Major',
      length = 8,
      tempo = 120,
      mood = 'happy'
    } = config;

    const scales = {
      'C Major': [60, 62, 64, 65, 67, 69, 71, 72],
      'A Minor': [57, 59, 60, 62, 64, 65, 67, 69],
      'G Major': [55, 57, 59, 60, 62, 64, 66, 67]
    };

    const notes = scales[scale] || scales['C Major'];
    const melody = [];

    for (let i = 0; i < length; i++) {
      const noteIndex = Math.floor(Math.random() * notes.length);
      const duration = [0.25, 0.5, 1, 2][Math.floor(Math.random() * 4)];
      melody.push({
        note: notes[noteIndex],
        duration,
        velocity: 80 + Math.floor(Math.random() * 40)
      });
    }

    return {
      id: this.generateId(),
      scale,
      tempo,
      mood,
      length,
      createdAt: new Date().toISOString(),
      notes: melody
    };
  }

  /**
   * 保存作品到本地存储
   * @param {Object} melody - 旋律数据
   * @returns {string} 保存的文件路径
   */
  saveMelody(melody) {
    const filename = `melody_${melody.id}.json`;
    const filepath = path.join(this.dataDir, filename);
    
    fs.writeFileSync(filepath, JSON.stringify(melody, null, 2));
    console.log(`✅ 旋律已保存: ${filepath}`);
    return filepath;
  }

  /**
   * 加载保存的作品
   * @param {string} id - 作品ID
   * @returns {Object|null} 旋律数据
   */
  loadMelody(id) {
    const filename = `melody_${id}.json`;
    const filepath = path.join(this.dataDir, filename);
    
    if (!fs.existsSync(filepath)) {
      return null;
    }

    return JSON.parse(fs.readFileSync(filepath, 'utf-8'));
  }

  /**
   * 列出所有保存的作品
   * @returns {Array} 作品列表
   */
  listMelodies() {
    if (!fs.existsSync(this.dataDir)) {
      return [];
    }

    return fs.readdirSync(this.dataDir)
      .filter(f => f.startsWith('melody_') && f.endsWith('.json'))
      .map(f => {
        const data = JSON.parse(fs.readFileSync(path.join(this.dataDir, f), 'utf-8'));
        return { id: data.id, scale: data.scale, mood: data.mood, createdAt: data.createdAt };
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  /**
   * 删除作品
   * @param {string} id - 作品ID
   * @returns {boolean} 是否删除成功
   */
  deleteMelody(id) {
    const filename = `melody_${id}.json`;
    const filepath = path.join(this.dataDir, filename);
    
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      return true;
    }
    return false;
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }

  /**
   * 获取统计信息
   * @returns {Object} 统计数据
   */
  getStats() {
    const melodies = this.listMelodies();
    return {
      totalMelodies: melodies.length,
      scales: [...new Set(melodies.map(m => m.scale))],
      moods: [...new Set(melodies.map(m => m.mood))],
      lastCreated: melodies[0]?.createdAt || null
    };
  }
}

module.exports = SoulMelody;
