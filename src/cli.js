/**
 * 音灵AI - 命令行工具
 * SoulMelody CLI
 */

const { program } = require('commander');
const SoulMelody = require('./core');

const app = new SoulMelody();

program
  .name('soulmelody')
  .description('音灵AI - 智能音乐创作平台')
  .version('0.1.0');

program
  .command('create')
  .description('创建一段新旋律')
  .option('-s, --scale <scale>', '音阶 (C Major, A Minor, G Major)', 'C Major')
  .option('-l, --length <number>', '音符数量', '8')
  .option('-t, --tempo <number>', '速度 BPM', '120')
  .option('-m, --mood <mood>', '情绪 (happy, sad, calm, energetic)', 'happy')
  .option('--save', '保存到本地', false)
  .action((options) => {
    console.log('🎵 音灵AI 正在创作旋律...\n');
    
    const melody = app.generateMelody({
      scale: options.scale,
      length: parseInt(options.length),
      tempo: parseInt(options.tempo),
      mood: options.mood
    });

    console.log('创作完成！');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🎼 ID: ${melody.id}`);
    console.log(`🎹 音阶: ${melody.scale}`);
    console.log(`⏱️  速度: ${melody.tempo} BPM`);
    console.log(`😊 情绪: ${melody.mood}`);
    console.log(`📝 音符数: ${melody.length}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('音符序列:');
    melody.notes.forEach((note, i) => {
      console.log(`  ${i + 1}. 音高:${note.note.toString().padStart(2)} 时长:${note.duration}s 力度:${note.velocity}`);
    });

    if (options.save) {
      app.saveMelody(melody);
    }
  });

program
  .command('list')
  .description('列出所有保存的作品')
  .action(() => {
    const melodies = app.listMelodies();
    
    if (melodies.length === 0) {
      console.log('📭 暂无保存的作品');
      return;
    }

    console.log(`📚 共有 ${melodies.length} 个作品:\n`);
    melodies.forEach((m, i) => {
      console.log(`${i + 1}. ${m.id}`);
      console.log(`   音阶: ${m.scale} | 情绪: ${m.mood} | 创建于: ${new Date(m.createdAt).toLocaleString()}`);
      console.log('');
    });
  });

program
  .command('show <id>')
  .description('查看指定作品的详细信息')
  .action((id) => {
    const melody = app.loadMelody(id);
    
    if (!melody) {
      console.log(`❌ 未找到作品: ${id}`);
      return;
    }

    console.log('🎵 作品详情');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🎼 ID: ${melody.id}`);
    console.log(`🎹 音阶: ${melody.scale}`);
    console.log(`⏱️  速度: ${melody.tempo} BPM`);
    console.log(`😊 情绪: ${melody.mood}`);
    console.log(`📝 音符数: ${melody.length}`);
    console.log(`📅 创建时间: ${new Date(melody.createdAt).toLocaleString()}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('音符序列:');
    melody.notes.forEach((note, i) => {
      console.log(`  ${i + 1}. 音高:${note.note.toString().padStart(2)} 时长:${note.duration}s 力度:${note.velocity}`);
    });
  });

program
  .command('delete <id>')
  .description('删除指定作品')
  .action((id) => {
    if (app.deleteMelody(id)) {
      console.log(`✅ 已删除作品: ${id}`);
    } else {
      console.log(`❌ 未找到作品: ${id}`);
    }
  });

program
  .command('stats')
  .description('查看统计信息')
  .action(() => {
    const stats = app.getStats();
    console.log('📊 音灵AI 统计信息');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🎵 总作品数: ${stats.totalMelodies}`);
    console.log(`🎹 使用音阶: ${stats.scales.join(', ') || '无'}`);
    console.log(`😊 情绪分布: ${stats.moods.join(', ') || '无'}`);
    console.log(`📅 最近创作: ${stats.lastCreated ? new Date(stats.lastCreated).toLocaleString() : '无'}`);
  });

program.parse();
