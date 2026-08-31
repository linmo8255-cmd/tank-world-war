/**
 * 碰撞检测系统 - 优化的空间分区碰撞检测
 */
class CollisionSystem {
    constructor(width, height, gridSize = 100) {
        this.width = width;
        this.height = height;
        this.gridSize = gridSize;
        this.cols = Math.ceil(width / gridSize);
        this.rows = Math.ceil(height / gridSize);
        this.grid = new Array(this.cols * this.rows).fill(null).map(() => []);
        this.colliders = new Map();
    }
    
    /**
     * 注册碰撞体
     */
    register(entity, collisionType = 'default') {
        if (!this.colliders.has(entity)) {
            this.colliders.set(entity, {
                type: collisionType,
                lastGridCells: new Set()
            });
        }
    }
    
    /**
     * 注销碰撞体
     */
    unregister(entity) {
        if (this.colliders.has(entity)) {
            const info = this.colliders.get(entity);
            info.lastGridCells.forEach(cellIndex => {
                const cell = this.grid[cellIndex];
                const idx = cell.indexOf(entity);
                if (idx !== -1) cell.splice(idx, 1);
            });
            this.colliders.delete(entity);
        }
    }
    
    /**
     * 更新碰撞体位置
     */
    update(entity) {
        if (!this.colliders.has(entity)) return;
        
        const gridCells = this.getGridCells(entity);
        const info = this.colliders.get(entity);
        
        // 移除旧网格中的引用
        info.lastGridCells.forEach(cellIndex => {
            if (!gridCells.has(cellIndex)) {
                const cell = this.grid[cellIndex];
                const idx = cell.indexOf(entity);
                if (idx !== -1) cell.splice(idx, 1);
            }
        });
        
        // 添加到新网格
        gridCells.forEach(cellIndex => {
            if (!info.lastGridCells.has(cellIndex)) {
                this.grid[cellIndex].push(entity);
            }
        });
        
        info.lastGridCells = gridCells;
    }
    
    /**
     * 获取实体所在的网格单元
     */
    getGridCells(entity) {
        const cells = new Set();
        const minX = Math.max(0, Math.floor(entity.x / this.gridSize));
        const maxX = Math.min(this.cols - 1, Math.floor((entity.x + entity.width) / this.gridSize));
        const minY = Math.max(0, Math.floor(entity.y / this.gridSize));
        const maxY = Math.min(this.rows - 1, Math.floor((entity.y + entity.height) / this.gridSize));
        
        for (let x = minX; x <= maxX; x++) {
            for (let y = minY; y <= maxY; y++) {
                cells.add(y * this.cols + x);
            }
        }
        return cells;
    }
    
    /**
     * 获取潜在碰撞对象
     */
    getPotentialCollisions(entity) {
        const candidates = new Set();
        const gridCells = this.getGridCells(entity);
        
        gridCells.forEach(cellIndex => {
            this.grid[cellIndex].forEach(other => {
                if (other !== entity) {
                    candidates.add(other);
                }
            });
        });
        
        return Array.from(candidates);
    }
    
    /**
     * 检查两个矩形是否碰撞
     */
    static checkAABB(obj1, obj2) {
        return obj1.x < obj2.x + obj2.width &&
               obj1.x + obj1.width > obj2.x &&
               obj1.y < obj2.y + obj2.height &&
               obj1.y + obj1.height > obj2.y;
    }
    
    /**
     * 清空系统
     */
    clear() {
        this.grid.forEach(cell => cell.length = 0);
        this.colliders.clear();
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CollisionSystem;
}