/**
 * 对象池管理 - 优化内存分配，减少垃圾回收
 */
class EntityPool {
    constructor(EntityClass, initialSize = 100) {
        this.EntityClass = EntityClass;
        this.available = [];
        this.active = new Set();
        this.initialSize = initialSize;
        
        // 预先分配对象
        for (let i = 0; i < initialSize; i++) {
            this.available.push(new EntityClass());
        }
    }
    
    /**
     * 获取对象
     */
    get(props = {}) {
        let entity;
        
        if (this.available.length > 0) {
            entity = this.available.pop();
        } else {
            entity = new this.EntityClass();
        }
        
        // 重置对象状态
        entity.reset(props);
        this.active.add(entity);
        
        return entity;
    }
    
    /**
     * 回收对象
     */
    release(entity) {
        if (this.active.has(entity)) {
            this.active.delete(entity);
            entity.cleanup();
            this.available.push(entity);
        }
    }
    
    /**
     * 批量回收
     */
    releaseAll(entities) {
        entities.forEach(entity => this.release(entity));
    }
    
    /**
     * 获取活跃对象数量
     */
    getActiveCount() {
        return this.active.size;
    }
    
    /**
     * 获取所有活跃对象
     */
    getAll() {
        return Array.from(this.active);
    }
    
    /**
     * 清空所有对象
     */
    clear() {
        this.active.forEach(entity => entity.cleanup());
        this.active.clear();
        this.available = [];
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = EntityPool;
}