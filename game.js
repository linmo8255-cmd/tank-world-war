// 游戏配置
const config = {
    canvas: null,
    ctx: null,
    width: 0,
    height: 0,
    difficulties: {
        easy: { enemyCount: 3, enemySpeed: 2, spawnRate: 0.02 },
        normal: { enemyCount: 5, enemySpeed: 3, spawnRate: 0.03 },
        hard: { enemyCount: 8, enemySpeed: 4, spawnRate: 0.04 }
    },
    selectedDifficulty: 'normal'
};

// 游戏状态
const gameState = {
    running: false,
    paused: false,
    startTime: 0,
    wave: 0,
    kills: 0,
    isVictory: false
};

// 玩家对象
const player = {
    x: 0,
    y: 0,
    width: 30,
    height: 30,
    angle: 0,
    speed: 5,
    health: 100,
    maxHealth: 100,
    bullets: []
};

// 敌人数组
let enemies = [];
let particles = [];

// 输入状态
const input = {
    mouse: { x: 0, y: 0 },
    keys: {},
    touch: { x: 0, y: 0, active: false }
};

// 初始化游戏
function initGame() {
    config.canvas = document.getElementById('gameCanvas');
    config.ctx = config.canvas.getContext('2d');
    
    // 设置画布大小
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // 事件监听
    setupEventListeners();
    
    // 难度选择
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            config.selectedDifficulty = this.dataset.difficulty;
        });
    });
    
    // 开始游戏
    document.getElementById('startBtn').addEventListener('click', startGame);
    document.getElementById('pauseBtn').addEventListener('click', togglePause);
    document.getElementById('resumeBtn').addEventListener('click', togglePause);
    document.getElementById('retryBtn').addEventListener('click', startGame);
    document.getElementById('menuBtn').addEventListener('click', backToMenu);
    document.getElementById('pauseMenuBtn').addEventListener('click', backToMenu);
}

function resizeCanvas() {
    config.width = window.innerWidth;
    config.height = window.innerHeight;
    config.canvas.width = config.width;
    config.canvas.height = config.height;
    
    // 重新初始化玩家位置
    if (gameState.running) {
        player.x = config.width / 2;
        player.y = config.height / 2;
    }
}

function setupEventListeners() {
    // 鼠标事件
    document.addEventListener('mousemove', (e) => {
        input.mouse.x = e.clientX;
        input.mouse.y = e.clientY;
    });
    
    document.addEventListener('click', (e) => {
        if (gameState.running && !gameState.paused) {
            shootBullet();
        }
    });
    
    // 键盘事件
    document.addEventListener('keydown', (e) => {
        input.keys[e.key.toLowerCase()] = true;
    });
    
    document.addEventListener('keyup', (e) => {
        input.keys[e.key.toLowerCase()] = false;
    });
    
    // 触屏事件（安卓适配）
    document.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (e.touches.length > 0) {
            input.touch.x = e.touches[0].clientX;
            input.touch.y = e.touches[0].clientY;
            input.touch.active = true;
        }
    }, { passive: false });
    
    document.addEventListener('touchstart', (e) => {
        if (e.touches.length > 0) {
            input.touch.x = e.touches[0].clientX;
            input.touch.y = e.touches[0].clientY;
            input.touch.active = true;
        }
    });
    
    document.addEventListener('touchend', () => {
        input.touch.active = false;
    });
}

function startGame() {
    // 隐藏菜单
    document.getElementById('gameMenu').style.display = 'none';
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById('pauseMenu').style.display = 'none';
    document.getElementById('gameContainer').style.display = 'block';
    
    // 重置游戏状态
    gameState.running = true;
    gameState.paused = false;
    gameState.startTime = Date.now();
    gameState.wave = 1;
    gameState.kills = 0;
    gameState.isVictory = false;
    
    // 重置玩家
    player.x = config.width / 2;
    player.y = config.height / 2;
    player.health = player.maxHealth;
    player.bullets = [];
    
    // 清空敌人和粒子
    enemies = [];
    particles = [];
    
    // 创建初始敌人
    const difficulty = config.difficulties[config.selectedDifficulty];
    for (let i = 0; i < difficulty.enemyCount; i++) {
        createEnemy();
    }
    
    // 开始游戏循环
    gameLoop();
}

function createEnemy() {
    const difficulty = config.difficulties[config.selectedDifficulty];
    const side = Math.floor(Math.random() * 4);
    let x, y;
    
    switch(side) {
        case 0: x = Math.random() * config.width; y = -20; break;
        case 1: x = config.width + 20; y = Math.random() * config.height; break;
        case 2: x = Math.random() * config.width; y = config.height + 20; break;
        case 3: x = -20; y = Math.random() * config.height; break;
    }
    
    enemies.push({
        x: x,
        y: y,
        width: 25,
        height: 25,
        speed: difficulty.enemySpeed,
        health: 30,
        maxHealth: 30,
        angle: 0
    });
}

function shootBullet() {
    player.bullets.push({
        x: player.x,
        y: player.y,
        angle: player.angle,
        speed: 8,
        distance: 0,
        maxDistance: 800,
        width: 5,
        height: 5
    });
}

function togglePause() {
    gameState.paused = !gameState.paused;
    document.getElementById('pauseMenu').style.display = gameState.paused ? 'flex' : 'none';
    if (!gameState.paused) {
        gameLoop();
    }
}

function backToMenu() {
    gameState.running = false;
    gameState.paused = false;
    document.getElementById('gameContainer').style.display = 'none';
    document.getElementById('pauseMenu').style.display = 'none';
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById('gameMenu').style.display = 'flex';
}

function gameLoop() {
    if (!gameState.running) return;
    
    if (!gameState.paused) {
        update();
    }
    
    draw();
    
    requestAnimationFrame(gameLoop);
}

function update() {
    // 更新玩家位置
    const moveDir = { x: 0, y: 0 };
    
    if (input.keys['w'] || input.keys['arrowup']) moveDir.y -= 1;
    if (input.keys['s'] || input.keys['arrowdown']) moveDir.y += 1;
    if (input.keys['a'] || input.keys['arrowleft']) moveDir.x -= 1;
    if (input.keys['d'] || input.keys['arrowright']) moveDir.x += 1;
    
    // 触屏移动（安卓适配）
    if (input.touch.active) {
        const dx = input.touch.x - player.x;
        const dy = input.touch.y - player.y;
        const distance = Math.hypot(dx, dy);
        if (distance > 50) {
            moveDir.x = dx / distance;
            moveDir.y = dy / distance;
        }
    }
    
    const moveDistance = Math.hypot(moveDir.x, moveDir.y);
    if (moveDistance > 0) {
        player.x += (moveDir.x / moveDistance) * player.speed;
        player.y += (moveDir.y / moveDistance) * player.speed;
    }
    
    // 边界碰撞
    player.x = Math.max(player.width / 2, Math.min(config.width - player.width / 2, player.x));
    player.y = Math.max(player.height / 2, Math.min(config.height - player.height / 2, player.y));
    
    // 更新玩家角度
    const targetX = input.touch.active ? input.touch.x : input.mouse.x;
    const targetY = input.touch.active ? input.touch.y : input.mouse.y;
    player.angle = Math.atan2(targetY - player.y, targetX - player.x);
    
    // 更新子弹
    for (let i = player.bullets.length - 1; i >= 0; i--) {
        const bullet = player.bullets[i];
        bullet.x += Math.cos(bullet.angle) * bullet.speed;
        bullet.y += Math.sin(bullet.angle) * bullet.speed;
        bullet.distance += bullet.speed;
        
        if (bullet.distance > bullet.maxDistance) {
            player.bullets.splice(i, 1);
            continue;
        }
        
        // 子弹与敌人碰撞
        for (let j = enemies.length - 1; j >= 0; j--) {
            if (checkCollision(bullet, enemies[j])) {
                enemies[j].health -= 25;
                player.bullets.splice(i, 1);
                
                // 创建爆炸粒子
                createExplosion(enemies[j].x, enemies[j].y);
                
                if (enemies[j].health <= 0) {
                    enemies.splice(j, 1);
                    gameState.kills++;
                }
                break;
            }
        }
    }
    
    // 更新敌人
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;
        const distance = Math.hypot(dx, dy);
        
        if (distance > 0) {
            enemy.x += (dx / distance) * enemy.speed;
            enemy.y += (dy / distance) * enemy.speed;
            enemy.angle = Math.atan2(dy, dx);
        }
        
        // 敌人与玩家碰撞
        if (checkCollision(enemy, player)) {
            player.health -= 0.5;
            if (player.health <= 0) {
                endGame(false);
                return;
            }
        }
    }
    
    // 更新粒子
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        if (p.life <= 0) {
            particles.splice(i, 1);
        }
    }
    
    // 生成新敌人
    const difficulty = config.difficulties[config.selectedDifficulty];
    if (Math.random() < difficulty.spawnRate && enemies.length < difficulty.enemyCount * (1 + gameState.wave * 0.5)) {
        createEnemy();
    }
    
    // 检查胜利条件
    if (enemies.length === 0 && gameState.kills > 0) {
        gameState.wave++;
        for (let i = 0; i < difficulty.enemyCount + gameState.wave; i++) {
            createEnemy();
        }
    }
    
    // 更新UI
    updateUI();
}

function createExplosion(x, y) {
    for (let i = 0; i < 8; i++) {
        particles.push({
            x: x,
            y: y,
            vx: Math.random() * 4 - 2,
            vy: Math.random() * 4 - 2,
            life: 30,
            color: `hsl(${Math.random() * 60}, 100%, 50%)`
        });
    }
}

function checkCollision(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
}

function draw() {
    // 清空画布
    config.ctx.fillStyle = '#1a1a1a';
    config.ctx.fillRect(0, 0, config.width, config.height);
    
    // 绘制网格背景
    drawGrid();
    
    // 绘制敌人
    enemies.forEach(enemy => drawEnemy(enemy));
    
    // 绘制玩家
    drawPlayer();
    
    // 绘制子弹
    player.bullets.forEach(bullet => drawBullet(bullet));
    
    // 绘制粒子
    particles.forEach(particle => drawParticle(particle));
}

function drawGrid() {
    config.ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    config.ctx.lineWidth = 1;
    const gridSize = 50;
    
    for (let x = 0; x < config.width; x += gridSize) {
        config.ctx.beginPath();
        config.ctx.moveTo(x, 0);
        config.ctx.lineTo(x, config.height);
        config.ctx.stroke();
    }
    
    for (let y = 0; y < config.height; y += gridSize) {
        config.ctx.beginPath();
        config.ctx.moveTo(0, y);
        config.ctx.lineTo(config.width, y);
        config.ctx.stroke();
    }
}

function drawPlayer() {
    // 玩家身体
    config.ctx.save();
    config.ctx.translate(player.x, player.y);
    config.ctx.rotate(player.angle);
    
    // 坦克主体
    config.ctx.fillStyle = '#4CAF50';
    config.ctx.fillRect(-player.width / 2, -player.height / 2, player.width, player.height);
    
    // 炮塔
    config.ctx.fillStyle = '#45a049';
    config.ctx.fillRect(-3, -10, 6, 10);
    
    config.ctx.restore();
    
    // 绘制健康值指示
    const healthPercent = player.health / player.maxHealth;
    config.ctx.fillStyle = healthPercent > 0.5 ? '#4CAF50' : healthPercent > 0.25 ? '#FFC107' : '#f44336';
    config.ctx.fillRect(player.x - 20, player.y - 40, 40 * healthPercent, 5);
    config.ctx.strokeStyle = '#fff';
    config.ctx.lineWidth = 1;
    config.ctx.strokeRect(player.x - 20, player.y - 40, 40, 5);
}

function drawEnemy(enemy) {
    config.ctx.save();
    config.ctx.translate(enemy.x, enemy.y);
    config.ctx.rotate(enemy.angle);
    
    // 敌人身体
    config.ctx.fillStyle = '#f44336';
    config.ctx.fillRect(-enemy.width / 2, -enemy.height / 2, enemy.width, enemy.height);
    
    // 敌人炮塔
    config.ctx.fillStyle = '#d32f2f';
    config.ctx.fillRect(-2, -8, 4, 8);
    
    config.ctx.restore();
    
    // 绘制敌人健康值
    const healthPercent = enemy.health / enemy.maxHealth;
    config.ctx.fillStyle = '#f44336';
    config.ctx.fillRect(enemy.x - 15, enemy.y - 30, 30 * healthPercent, 4);
    config.ctx.strokeStyle = '#fff';
    config.ctx.lineWidth = 1;
    config.ctx.strokeRect(enemy.x - 15, enemy.y - 30, 30, 4);
}

function drawBullet(bullet) {
    config.ctx.save();
    config.ctx.translate(bullet.x, bullet.y);
    config.ctx.rotate(bullet.angle);
    
    config.ctx.fillStyle = '#FFEB3B';
    config.ctx.fillRect(-bullet.width / 2, -bullet.height / 2, bullet.width, bullet.height);
    
    config.ctx.restore();
}

function drawParticle(particle) {
    config.ctx.fillStyle = particle.color;
    config.ctx.globalAlpha = particle.life / 30;
    config.ctx.fillRect(particle.x - 3, particle.y - 3, 6, 6);
    config.ctx.globalAlpha = 1;
}

function updateUI() {
    document.getElementById('playerHealth').style.width = (player.health / player.maxHealth * 100) + '%';
    document.getElementById('killCount').textContent = gameState.kills;
    document.getElementById('enemyCount').textContent = enemies.length;
}

function endGame(victory) {
    gameState.running = false;
    gameState.isVictory = victory;
    
    const gameOverTitle = document.getElementById('gameOverTitle');
    gameOverTitle.textContent = victory ? '胜利！' : '游戏结束';
    gameOverTitle.className = victory ? 'victory' : 'defeat';
    
    const timeElapsed = Math.floor((Date.now() - gameState.startTime) / 1000);
    document.getElementById('finalKills').textContent = gameState.kills;
    document.getElementById('finalWave').textContent = gameState.wave;
    document.getElementById('finalTime').textContent = timeElapsed;
    
    document.getElementById('gameContainer').style.display = 'none';
    document.getElementById('gameOver').style.display = 'flex';
}

// 初始化游戏
window.addEventListener('load', initGame);
