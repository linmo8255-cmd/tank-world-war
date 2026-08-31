/**
 * 玩家实体
 */
class Player {
    constructor() {
        this.reset();
    }
    
    reset(props = {}) {
        this.x = props.x || 0;
        this.y = props.y || 0;
        this.width = 30;
        this.height = 30;
        this.angle = 0;
        this.speed = props.speed || 5;
        this.health = props.maxHealth || 100;
        this.maxHealth = props.maxHealth || 100;
        this.vx = 0;
        this.vy = 0;
    }
    
    cleanup() {
        // 清理资源
    }
    
    update(deltaTime, inputManager, worldWidth, worldHeight) {
        // 获取移动方向
        const moveDir = inputManager.getMovementDirection();
        const distance = Math.hypot(moveDir.x, moveDir.y);
        
        if (distance > 0) {
            this.vx = (moveDir.x / distance) * this.speed;
            this.vy = (moveDir.y / distance) * this.speed;
        } else {
            this.vx = 0;
            this.vy = 0;
        }
        
        // 更新位置
        this.x += this.vx;
        this.y += this.vy;
        
        // 边界检测
        this.x = Math.max(this.width / 2, Math.min(worldWidth - this.width / 2, this.x));
        this.y = Math.max(this.height / 2, Math.min(worldHeight - this.height / 2, this.y));
        
        // 更新朝向
        const target = inputManager.getTargetPosition();
        this.angle = Math.atan2(target.y - this.y, target.x - this.x);
    }
    
    takeDamage(damage) {
        this.health -= damage;
        return this.health <= 0;
    }
    
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        
        // 坦克主体
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        
        // 炮塔
        ctx.fillStyle = '#45a049';
        ctx.fillRect(-3, -10, 6, 10);
        
        ctx.restore();
        
        // 生命值条
        const healthPercent = this.health / this.maxHealth;
        ctx.fillStyle = healthPercent > 0.5 ? '#4CAF50' : healthPercent > 0.25 ? '#FFC107' : '#f44336';
        ctx.fillRect(this.x - 20, this.y - 40, 40 * healthPercent, 5);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.strokeRect(this.x - 20, this.y - 40, 40, 5);
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Player;
}