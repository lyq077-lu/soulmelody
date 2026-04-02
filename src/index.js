/**
 * 音灵AI - 主入口
 * SoulMelody Entry Point
 */

const SoulMelody = require('./core');

// 创建实例
const app = new SoulMelody();

// 演示模式
console.log('╔════════════════════════════════╗');
console.log('║     🎵 音灵AI SoulMelody 🎵     ║');
console.log('║   用AI唤醒音乐的灵魂            ║');
console.log('╚════════════════════════════════╝');
console.log();

// 生成示例旋律
console.log('正在生成示例旋律...\n');
const melody = app.generateMelody({
  scale: 'C Major',
  length: 8,
  tempo: 120,
  mood: 'happy'
});

console.log('✅ 示例旋律生成完成！');
console.log(`🎼 ID: ${melody.id}`);
console.log(`🎹 音阶: ${melody.scale}`);
console.log(`⏱️  速度: ${melody.tempo} BPM`);
console.log(`😊 情绪: ${melody.mood}`);
console.log();

// 保存示例
const savedPath = app.saveMelody(melody);
console.log();

// 显示统计
const stats = app.getStats();
console.log('📊 当前统计:');
console.log(`   作品总数: ${stats.totalMelodies}`);
console.log();

// 显示使用提示
console.log('使用提示:');
console.log('  npm run cli -- create --save    创建并保存新旋律');
console.log('  npm run cli -- list             查看所有作品');
console.log('  npm run cli -- stats            查看统计信息');
console.log();
console.log('🎉 音灵AI 初始化完成！');

module.exports = SoulMelody;
