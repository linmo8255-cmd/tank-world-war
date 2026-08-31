/**
 * 渲染系统
 */
class RenderSystem {
    constructor(ctx, width, height) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
    }
    
    clear() {
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(0, 0, this.width, this.height);
    }
    
    drawGrid(gridSize = 50) {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        this.ctx.lineWidth = 1;
        
        for (let x = 0; x < this.width; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.height);
            this.ctx.stroke();
        }
        
        for (let y = 0; y < this.height; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.width, y);
            this.ctx.stroke();
        }
    }
    
    drawEntities(entities) {
        entities.forEach(entity => {
            if (entity.draw && typeof entity.draw === 'function') {
                entity.draw(this.ctx);
            }
        });
    }
    
    drawUI(gameState, playerHealth, playerMaxHealth) {
        const healthPercent = (playerHealth / playerMaxHealth) * 100;
        document.getElementById('playerHealth').style.width = healthPercent + '%';
        document.getElementById('killCount').textContent = gameState.kills;
        document.getElementById('enemyCount').textContent = gameState.enemyCount || 0;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = RenderSystem;
}