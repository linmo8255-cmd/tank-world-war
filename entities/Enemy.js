/**
 * 敌人实体
 */
class Enemy {
    constructor() {
        this.reset();
    }
    
    reset(props = {}) {
        this.x = props.x || 0;
        this.y = props.y || 0;
        this.width = 25;
        this.height = 25;
        this.angle = 0;
        this.speed = props.speed || 2;
        this.health = props.maxHealth || 30;
        this.maxHealth = props.maxHealth || 30;
        this.vx = 0;
        this.vy = 0;
    }
    
    cleanup() {
        // 清理资源
    }
    
    update(deltaTime, target) {
        if (!target) return;
        
        const dx = target.x - this.x;
        const dy = target.y - this.y;
        const distance = Math.hypot(dx, dy);
        
        if (distance > 0) {
            this.vx = (dx / distance) * this.speed;
            this.vy = (dy / distance) * this.speed;
            this.angle = Math.atan2(dy, dx);
        }
        
        this.x += this.vx;
        this.y += this.vy;
    }
    
    takeDamage(damage) {
        this.health -= damage;
        return this.health <= 0;
    }
    
    isAlive() {
        return this.health > 0;
    }
    
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        
        // 敌人身体
        ctx.fillStyle = '#f44336';
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        
        // 敌人炮塔
        ctx.fillStyle = '#d32f2f';
        ctx.fillRect(-2, -8, 4, 8);
        
        ctx.restore();
        
        // 敌人生命值
        const healthPercent = this.health / this.maxHealth;
        ctx.fillStyle = '#f44336';
        ctx.fillRect(this.x - 15, this.y - 30, 30 * healthPercent, 4);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.strokeRect(this.x - 15, this.y - 30, 30, 4);
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Enemy;
}