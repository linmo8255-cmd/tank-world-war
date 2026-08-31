/**
 * 游戏引擎核心 - 管理游戏生命周期和主循环
 */
class GameEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.running = false;
        this.paused = false;
        this.deltaTime = 0;
        this.lastTime = 0;
        this.fps = 0;
        this.frameCount = 0;
        
        this.setupCanvas();
    }
    
    setupCanvas() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }
    
    start() {
        this.running = true;
        this.paused = false;
        this.lastTime = performance.now();
        this.gameLoop();
    }
    
    pause() {
        this.paused = true;
    }
    
    resume() {
        this.paused = false;
        this.lastTime = performance.now();
    }
    
    stop() {
        this.running = false;
    }
    
    gameLoop = () => {
        if (!this.running) return;
        
        const currentTime = performance.now();
        this.deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        
        // 更新
        if (!this.paused && this.onUpdate) {
            this.onUpdate(this.deltaTime);
        }
        
        // 渲染
        if (this.onDraw) {
            this.onDraw(this.ctx);
        }
        
        // 计算FPS
        this.frameCount++;
        if (this.frameCount % 30 === 0 && this.onFpsUpdate) {
            this.fps = Math.round(1 / this.deltaTime);
            this.onFpsUpdate(this.fps);
        }
        
        requestAnimationFrame(this.gameLoop);
    }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameEngine;
}