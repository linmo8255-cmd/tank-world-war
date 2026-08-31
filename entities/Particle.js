/**
 * 粒子实体
 */
class Particle {
    constructor() {
        this.reset();
    }
    
    reset(props = {}) {
        this.x = props.x || 0;
        this.y = props.y || 0;
        this.vx = props.vx || 0;
        this.vy = props.vy || 0;
        this.life = props.life || 30;
        this.maxLife = props.life || 30;
        this.color = props.color || '#FFEB3B';
    }
    
    cleanup() {
        // 清理资源
    }
    
    update(deltaTime) {
        this.x += this.vx;
        this.y += this.vy;
        this.life--;
    }
    
    isAlive() {
        return this.life > 0;
    }
    
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.life / this.maxLife;
        ctx.fillRect(this.x - 3, this.y - 3, 6, 6);
        ctx.globalAlpha = 1;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Particle;
}