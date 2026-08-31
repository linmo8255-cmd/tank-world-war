/**
 * 坦克世界大战 - 优化版
 * 使用模块化架构 + 对象池 + 空间分区碰撞检测
 */

// 全局变量
let engine;
let audioManager;
let inputManager;
let gameState;
let player;
let waveSystem;
let renderSystem;
let collisionSystem;

let bulletPool;
let particlePool;
let enemyPool;

let enemies = [];
let bullets = [];
let particles = [];

const DIFFICULTY_CONFIG = {
    easy: { enemyCount: 3, enemySpeed: 2, spawnRate: 0.02 },
    normal: { enemyCount: 5, enemySpeed: 3, spawnRate: 0.03 },
    hard: { enemyCount: 8, enemySpeed: 4, spawnRate: 0.04 }
};

/**
 * 初始化游戏
 */
function initGame() {
    // 初始化引擎
    engine = new GameEngine('gameCanvas');
    
    // 初始化音频管理器
    audioManager = new AudioManager();
    
    // 设置音乐文件（可选）
    try {
        audioManager.setMusicFiles({
            menu: 'assets/music/menu.mp3',
            gameplay: 'assets/music/gameplay.mp3',
            gameOver: 'assets/music/gameOver.mp3',
            victory: 'assets/music/victory.mp3'
        });
    } catch (e) {
        console.log('音乐文件加载失败，使用默认音效');
    }
    
    // 初始化其他系统
    inputManager = new InputManager();
    gameState = new GameState();
    waveSystem = new WaveSystem(DIFFICULTY_CONFIG);
    renderSystem = new RenderSystem(engine.ctx, engine.width, engine.height);
    collisionSystem = new CollisionSystem(engine.width, engine.height, 100);
    
    // 创建对象池
    bulletPool = new EntityPool(Bullet, 200);
    particlePool = new EntityPool(Particle, 500);
    enemyPool = new EntityPool(Enemy, 100);
    
    // 初始化玩家
    player = new Player();
    player.reset({
        x: engine.width / 2,
        y: engine.height / 2,
        maxHealth: 100,
        speed: 5
    });
    collisionSystem.register(player);
    
    // 绑定游戏循环
    engine.onUpdate = update;
    engine.onDraw = draw;
    engine.onFpsUpdate = (fps) => {
        // console.log('FPS:', fps);
    };
    
    // 设置难度按钮
    setupDifficultyButtons();
    
    // 设置游戏按钮
    setupGameButtons();
}

/**
 * 设置难度按钮
 */
function setupDifficultyButtons() {
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            waveSystem.setDifficulty(this.dataset.difficulty);
        });
    });
}

/**
 * 设置游戏按钮
 */
function setupGameButtons() {
    document.getElementById('startBtn').addEventListener('click', startGame);
    document.getElementById('pauseBtn').addEventListener('click', togglePause);
    document.getElementById('resumeBtn').addEventListener('click', togglePause);
    document.getElementById('retryBtn').addEventListener('click', startGame);
    document.getElementById('menuBtn').addEventListener('click', backToMenu);
    document.getElementById('pauseMenuBtn').addEventListener('click', backToMenu);
    
    // 音量控制
    const sfxVolumeSlider = document.getElementById('sfxVolume');
    if (sfxVolumeSlider) {
        sfxVolumeSlider.addEventListener('input', (e) => {
            audioManager.setEffectVolume(e.target.value / 100);
            document.getElementById('sfxVolumeValue').textContent = e.target.value;
        });
    }
}

/**
 * 开始游戏
 */
function startGame() {
    document.getElementById('gameMenu').style.display = 'none';
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById('pauseMenu').style.display = 'none';
    document.getElementById('gameContainer').style.display = 'block';
    
    // 重置游戏状态
    gameState.reset();
    gameState.wave = 1;
    gameState.difficulty = waveSystem.currentDifficulty;
    gameState.startTime = Date.now();
    
    // 重置玩家
    player.reset({
        x: engine.width / 2,
        y: engine.height / 2,
        maxHealth: 100,
        speed: 5
    });
    player.health = player.maxHealth;
    
    // 清空敌人和子弹
    enemies.forEach(e => enemyPool.release(e));
    bullets.forEach(b => bulletPool.release(b));
    particles.forEach(p => particlePool.release(p));
    enemies = [];
    bullets = [];
    particles = [];
    
    // 创建初始敌人
    const enemyCount = waveSystem.getEnemyCountForWave();
    for (let i = 0; i < enemyCount; i++) {
        createEnemy();
    }
    
    // 播放游戏音乐
    audioManager.playGameplayMusic();
    
    // 启动引擎
    engine.start();
}

/**
 * 创建敌人
 */
function createEnemy() {
    const side = Math.floor(Math.random() * 4);
    let x, y;
    
    switch(side) {
        case 0: x = Math.random() * engine.width; y = -20; break;
        case 1: x = engine.width + 20; y = Math.random() * engine.height; break;
        case 2: x = Math.random() * engine.width; y = engine.height + 20; break;
        case 3: x = -20; y = Math.random() * engine.height; break;
    }
    
    const enemy = enemyPool.get({
        x: x,
        y: y,
        speed: waveSystem.getEnemySpeed(),
        maxHealth: 30
    });
    
    enemies.push(enemy);
    collisionSystem.register(enemy);
}

/**
 * 射击
 */
function shootBullet() {
    const bullet = bulletPool.get({
        x: player.x,
        y: player.y,
        angle: player.angle
    });
    
    bullets.push(bullet);
    collisionSystem.register(bullet);
    
    audioManager.playShootSound();
}

/**
 * 创建爆炸效果
 */
function createExplosion(x, y) {
    for (let i = 0; i < 8; i++) {
        const particle = particlePool.get({
            x: x,
            y: y,
            vx: Math.random() * 4 - 2,
            vy: Math.random() * 4 - 2,
            color: `hsl(${Math.random() * 60}, 100%, 50%)`,
            life: 30
        });
        particles.push(particle);
    }
    
    audioManager.playExplosionSound();
}

/**
 * 暂停/恢复
 */
function togglePause() {
    if (engine.paused) {
        engine.resume();
        document.getElementById('pauseMenu').style.display = 'none';
    } else {
        engine.pause();
        document.getElementById('pauseMenu').style.display = 'flex';
    }
}

/**
 * 返回菜单
 */
function backToMenu() {
    engine.stop();
    audioManager.stopAllMusic();
    
    document.getElementById('gameContainer').style.display = 'none';
    document.getElementById('pauseMenu').style.display = 'none';
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById('gameMenu').style.display = 'flex';
}

/**
 * 游戏更新逻辑
 */
function update(deltaTime) {
    gameState.update(deltaTime);
    
    // 更新玩家
    player.update(deltaTime, inputManager, engine.width, engine.height);
    collisionSystem.update(player);
    
    // 检查射击
    if (inputManager.isShootTriggered()) {
        shootBullet();
    }
    inputManager.reset();
    
    // 更新子弹
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        bullet.update(deltaTime);
        collisionSystem.update(bullet);
        
        if (!bullet.isActive()) {
            bulletPool.release(bullet);
            bullets.splice(i, 1);
            continue;
        }
        
        // 检查与敌人的碰撞
        const candidates = collisionSystem.getPotentialCollisions(bullet);
        for (const enemy of candidates) {
            if (CollisionSystem.checkAABB(bullet, enemy)) {
                if (enemy.takeDamage(bullet.damage)) {
                    // 敌人死亡
                    createExplosion(enemy.x, enemy.y);
                    const enemyIdx = enemies.indexOf(enemy);
                    if (enemyIdx !== -1) {
                        enemies.splice(enemyIdx, 1);
                    }
                    enemyPool.release(enemy);
                    collisionSystem.unregister(enemy);
                    gameState.addKill(10);
                } else {
                    // 创建碰撞效果
                    createExplosion(bullet.x, bullet.y);
                }
                
                // 移除子弹
                bulletPool.release(bullet);
                bullets.splice(i, 1);
                break;
            }
        }
    }
    
    // 更新敌人
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        enemy.update(deltaTime, player);
        collisionSystem.update(enemy);
        
        // 检查与玩家的碰撞
        if (CollisionSystem.checkAABB(enemy, player)) {
            if (player.takeDamage(0.5)) {
                // 玩家死亡
                endGame(false);
                return;
            }
        }
    }
    
    // 更新粒子
    for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        particle.update(deltaTime);
        
        if (!particle.isAlive()) {
            particlePool.release(particle);
            particles.splice(i, 1);
        }
    }
    
    // 生成新敌人
    if (waveSystem.shouldSpawnEnemy(enemies.length)) {
        createEnemy();
        audioManager.playEnemySpawnSound();
    }
    
    // 检查波次完成
    if (enemies.length === 0 && gameState.kills > 0) {
        gameState.nextWave();
        waveSystem.nextWave();
        audioManager.playWaveCompleteSound();
        
        // 生成下一波敌人
        const newEnemyCount = waveSystem.getEnemyCountForWave();
        for (let i = 0; i < newEnemyCount; i++) {
            createEnemy();
        }
    }
}

/**
 * 游戏渲染逻辑
 */
function draw(ctx) {
    // 清空画布
    renderSystem.clear();
    
    // 绘制网格
    renderSystem.drawGrid(50);
    
    // 绘制所有实体
    enemies.forEach(enemy => enemy.draw(ctx));
    player.draw(ctx);
    bullets.forEach(bullet => bullet.draw(ctx));
    particles.forEach(particle => particle.draw(ctx));
    
    // 更新UI
    gameState.enemyCount = enemies.length;
    renderSystem.drawUI(gameState, player.health, player.maxHealth);
}

/**
 * 游戏结束
 */
function endGame(isVictory) {
    engine.stop();
    
    gameState.isVictory = isVictory;
    
    const gameOverTitle = document.getElementById('gameOverTitle');
    gameOverTitle.textContent = isVictory ? '胜利！' : '游戏结束';
    gameOverTitle.className = isVictory ? 'victory' : 'defeat';
    
    document.getElementById('finalKills').textContent = gameState.kills;
    document.getElementById('finalWave').textContent = gameState.wave;
    document.getElementById('finalTime').textContent = gameState.getTimeElapsed();
    
    document.getElementById('gameContainer').style.display = 'none';
    document.getElementById('gameOver').style.display = 'flex';
    
    if (isVictory) {
        audioManager.playVictorySound();
    } else {
        audioManager.playGameOverSound();
    }
}

// 页面加载时初始化
window.addEventListener('load', () => {
    initGame();
});
