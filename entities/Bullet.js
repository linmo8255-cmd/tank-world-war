/**
 * 子弹实体
 */
class Bullet {
    constructor() {
        this.reset();
    }
    
    reset(props = {}) {
        this.x = props.x || 0;
        this.y = props.y || 0;
        this.angle = props.angle || 0;
        this.speed = 8;
        this.distance = 0;
        this.maxDistance = 800;
        this.width = 5;
        this.height = 5;
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;
        this.damage = props.damage || 25;
    }
    
    cleanup() {
        // 清理资源
    }
    
    update(deltaTime) {
        this.x += this.vx;
        this.y += this.vy;
        this.distance += this.speed;
    }
    
    isActive() {
        return this.distance < this.maxDistance;
    }
    
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        
        ctx.fillStyle = '#FFEB3B';
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        
        ctx.restore();
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Bullet;
}