// 音频管理系统
const audioManager = {
    // 背景音乐音量（0-1）
    musicVolume: 0.3,
    // 音效音量（0-1）
    sfxVolume: 0.5,
    
    // 背景音乐
    backgroundMusic: null,
    isPlayingMusic: false,
    
    // 音效缓存
    sounds: {},
    
    // 初始化音频系统
    init() {
        this.createAudioContext();
        this.loadSounds();
    },
    
    // 创建音频上下文
    createAudioContext() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    },
    
    // 加载/生成所有音效
    loadSounds() {
        // 射击音效
        this.sounds.shoot = () => this.playShootSound();
        // 爆炸音效
        this.sounds.explosion = () => this.playExplosionSound();
        // 敌人出现音效
        this.sounds.enemySpawn = () => this.playEnemySpawnSound();
        // 波次完成音效
        this.sounds.waveComplete = () => this.playWaveCompleteSound();
        // 游戏结束音效
        this.sounds.gameOver = () => this.playGameOverSound();
        // 胜利音效
        this.sounds.victory = () => this.playVictorySound();
        // UI点击音效
        this.sounds.click = () => this.playClickSound();
    },
    
    // 播放菜单音乐
    playMenuMusic() {
        if (this.isPlayingMusic) return;
        this.isPlayingMusic = true;
        this.playMenuMelody();
    },
    
    // 菜单音乐旋律
    playMenuMelody() {
        const notes = [
            { freq: 261.63, duration: 0.3 },  // C
            { freq: 329.63, duration: 0.3 },  // E
            { freq: 392.00, duration: 0.3 },  // G
            { freq: 523.25, duration: 0.6 },  // C high
            { freq: 392.00, duration: 0.3 },  // G
            { freq: 329.63, duration: 0.3 },  // E
            { freq: 261.63, duration: 0.6 },  // C
        ];
        
        let currentTime = this.audioContext.currentTime;
        const startTime = currentTime;
        
        notes.forEach(note => {
            this.playTone(note.freq, note.duration, currentTime, 0.2);
            currentTime += note.duration;
        });
        
        const totalDuration = currentTime - startTime;
        
        // 循环播放
        setTimeout(() => {
            if (this.isPlayingMusic) {
                this.playMenuMelody();
            }
        }, totalDuration * 1000);
    },
    
    // 停止背景音乐
    stopMusic() {
        this.isPlayingMusic = false;
    },
    
    // 射击音效
    playShootSound() {
        const now = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        
        gain.gain.setValueAtTime(this.sfxVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.1);
        
        osc.start(now);
        osc.stop(now + 0.1);
    },
    
    // 爆炸音效
    playExplosionSound() {
        const now = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        
        gain.gain.setValueAtTime(this.sfxVolume * 0.6, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.3);
        
        osc.start(now);
        osc.stop(now + 0.3);
        
        // 添加第二个音调
        const osc2 = this.audioContext.createOscillator();
        osc2.connect(gain);
        osc2.frequency.setValueAtTime(200, now + 0.05);
        osc2.frequency.exponentialRampToValueAtTime(60, now + 0.25);
        osc2.start(now + 0.05);
        osc2.stop(now + 0.25);
    },
    
    // 敌人出现音效
    playEnemySpawnSound() {
        const now = this.audioContext.currentTime;
        const notes = [349.23, 392.00, 440.00];  // F, G, A
        
        notes.forEach((freq, index) => {
            this.playTone(freq, 0.1, now + index * 0.1, this.sfxVolume * 0.4);
        });
    },
    
    // 波次完成音效
    playWaveCompleteSound() {
        const now = this.audioContext.currentTime;
        const notes = [
            { freq: 523.25, duration: 0.2 },  // C high
            { freq: 659.25, duration: 0.2 },  // E high
            { freq: 783.99, duration: 0.4 },  // G high
        ];
        
        let time = now;
        notes.forEach(note => {
            this.playTone(note.freq, note.duration, time, this.sfxVolume * 0.5);
            time += note.duration;
        });
    },
    
    // 游戏结束音效
    playGameOverSound() {
        const now = this.audioContext.currentTime;
        const notes = [
            { freq: 330, duration: 0.2 },
            { freq: 294, duration: 0.2 },
            { freq: 262, duration: 0.4 },
            { freq: 196, duration: 0.4 },
        ];
        
        let time = now;
        notes.forEach(note => {
            this.playTone(note.freq, note.duration, time, this.sfxVolume * 0.6);
            time += note.duration;
        });
    },
    
    // 胜利音效
    playVictorySound() {
        const now = this.audioContext.currentTime;
        const notes = [
            { freq: 523.25, duration: 0.1 },  // C high
            { freq: 523.25, duration: 0.1 },
            { freq: 659.25, duration: 0.1 },  // E high
            { freq: 659.25, duration: 0.1 },
            { freq: 783.99, duration: 0.2 },  // G high
            { freq: 783.99, duration: 0.2 },
            { freq: 523.25, duration: 0.4 },  // C high
        ];
        
        let time = now;
        notes.forEach(note => {
            this.playTone(note.freq, note.duration, time, this.sfxVolume * 0.5);
            time += note.duration;
        });
    },
    
    // UI点击音效
    playClickSound() {
        const now = this.audioContext.currentTime;
        this.playTone(440, 0.1, now, this.sfxVolume * 0.3);
    },
    
    // 通用音调生成器
    playTone(frequency, duration, startTime, volume) {
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        
        gain.gain.setValueAtTime(volume, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration * 0.8);
        
        osc.frequency.setValueAtTime(frequency, startTime);
        osc.type = 'sine';
        
        osc.start(startTime);
        osc.stop(startTime + duration);
    },
    
    // 调整音量
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
    },
    
    setEffectVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
    }
};

// 页面加载时初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        audioManager.init();
    });
} else {
    audioManager.init();
}