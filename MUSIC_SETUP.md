# 音乐配置完全指南

## 快速开始

### 1️⃣ 准备音乐文件

你可以使用以下格式的音乐文件：
- **MP3** (.mp3) - 推荐，兼容性最好
- **OGG** (.ogg) - 开源格式，质量高
- **WAV** (.wav) - 无损格式，文件较大
- **WEBM** (.webm) - 网络优化格式

### 2️⃣ 创建项目结构

```bash
your-project/
├── index.html
├── styles.css
├── core/
│   ├── GameEngine.js
│   ├── AudioManager.js
│   ├── EntityPool.js
│   └── ...
├── entities/
│   ├── Player.js
│   ├── Enemy.js
│   └── ...
├── systems/
│   └── ...
└── assets/
    └── music/
        ├── menu.mp3
        ├── gameplay.mp3
        ├── gameOver.mp3
        └── victory.mp3
```

### 3️⃣ HTML 中引入脚本

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>坦克世界大战</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <!-- UI 部分 -->
        <div id="gameMenu" class="menu">...</div>
        <div id="gameContainer" class="game-container" style="display: none;">
            <canvas id="gameCanvas"></canvas>
        </div>
    </div>

    <!-- 核心脚本 -->
    <script src="core/GameEngine.js"></script>
    <script src="core/AudioManager.js"></script>
    <script src="core/EntityPool.js"></script>
    <script src="core/CollisionSystem.js"></script>
    <script src="core/InputManager.js"></script>
    <script src="core/GameState.js"></script>
    
    <!-- 实体脚本 -->
    <script src="entities/Player.js"></script>
    <script src="entities/Enemy.js"></script>
    <script src="entities/Bullet.js"></script>
    <script src="entities/Particle.js"></script>
    
    <!-- 系统脚本 -->
    <script src="systems/RenderSystem.js"></script>
    <script src="systems/WaveSystem.js"></script>
    
    <!-- 游戏主逻辑 -->
    <script src="game-optimized.js"></script>
</body>
</html>
```

### 4️⃣ game-optimized.js 中配置音乐

```javascript
// 创建音频管理器
const audioManager = new AudioManager();

// 设置音乐文件路径
audioManager.setMusicFiles({
    menu: 'assets/music/menu.mp3',
    gameplay: 'assets/music/gameplay.mp3',
    gameOver: 'assets/music/gameOver.mp3',
    victory: 'assets/music/victory.mp3'
});

// 在适当的位置播放音乐
function startGame() {
    audioManager.playGameplayMusic();
    // ... 其他游戏初始化代码
}

function endGame(isVictory) {
    if (isVictory) {
        audioManager.playVictorySound();
    } else {
        audioManager.playGameOverSound();
    }
}
```

## 🎵 使用自己的音乐

### 方法 1: 使用相对路径

如果音乐文件在 `assets/music/` 文件夹中：

```javascript
audioManager.setMusicFile('menu', 'assets/music/my-menu-music.mp3');
audioManager.setMusicFile('gameplay', 'assets/music/my-gameplay-music.mp3');
```

### 方法 2: 使用绝对路径

```javascript
audioManager.setMusicFile('menu', '/path/to/my-music.mp3');
```

### 方法 3: 使用 Base64 编码

对于小文件，可以转换为 Base64：

```javascript
// 使用 Base64 数据 URL
audioManager.setMusicFile('menu', 'data:audio/mpeg;base64,//NExAAQAIoAVABEAEQASABEAEQARB...');
```

### 方法 4: 运行时上传

```html
<input type="file" id="musicUpload" accept="audio/*">

<script>
    document.getElementById('musicUpload').addEventListener('change', (e) => {
        const file = e.target.files[0];
        const url = URL.createObjectURL(file);
        audioManager.setMusicFile('gameplay', url);
    });
</script>
```

## 🔊 音量控制

### HTML 中添加音量滑块

```html
<div class="audio-controls">
    <label>音乐音量: <span id="musicVolumeValue">30</span>%</label>
    <input type="range" id="musicVolume" min="0" max="100" value="30">
    
    <label>音效音量: <span id="sfxVolumeValue">50</span>%</label>
    <input type="range" id="sfxVolume" min="0" max="100" value="50">
</div>
```

### JavaScript 中监听变化

```javascript
document.getElementById('musicVolume').addEventListener('change', (e) => {
    const volume = e.target.value / 100;
    audioManager.setMusicVolume(volume);
    document.getElementById('musicVolumeValue').textContent = e.target.value;
});

document.getElementById('sfxVolume').addEventListener('change', (e) => {
    const volume = e.target.value / 100;
    audioManager.setEffectVolume(volume);
    document.getElementById('sfxVolumeValue').textContent = e.target.value;
});
```

## 🎯 常见问题

### Q1: 音乐无法播放

**可能原因**：
1. 文件路径错误
2. 浏览器 CORS 限制
3. 音频格式不支持

**解决方案**：
```javascript
audioManager.setMusicFile('gameplay', 'assets/music/game.mp3')
    .then(() => console.log('音乐加载成功'))
    .catch(err => console.error('加载失败:', err));
```

### Q2: 音乐文件太大

**解决方案**：
1. 使用 MP3 格式压缩
2. 降低比特率（128kbps 通常足够）
3. 使用在线工具优化文件大小

### Q3: 某些浏览器不支持

**解决方案**：提供多格式备选

```javascript
audioManager.setMusicFile('gameplay', 'assets/music/game.mp3');
// 如果 MP3 失败，自动降级到合成音效
```

## 🎶 推荐的音乐来源

- **Open Game Art**: https://opengameart.org/
- **FreeSound**: https://freesound.org/
- **Incompetech**: https://incompetech.com/
- **YouTube Audio Library**: https://www.youtube.com/audiolibrary

## 📋 音乐规范

| 类型 | 推荐时长 | 建议 BPM | 格式 |
|------|--------|--------|------|
| 菜单音乐 | 30-60秒 | 80-120 | MP3 |
| 游戏音乐 | 1-3分钟 | 120-160 | MP3 |
| 游戏结束 | 2-4秒 | - | MP3/合成 |
| 胜利音效 | 3-5秒 | - | MP3/合成 |
