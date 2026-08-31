/**
 * 波次系统 - 管理敌人生成和难度
 */
class WaveSystem {
    constructor(difficultyConfig) {
        this.difficultyConfig = difficultyConfig;
        this.wave = 1;
        this.currentDifficulty = difficultyConfig.normal;
    }
    
    setDifficulty(difficulty) {
        if (this.difficultyConfig[difficulty]) {
            this.currentDifficulty = this.difficultyConfig[difficulty];
        }
    }
    
    /**
     * 获取当前波次的敌人数量
     */
    getEnemyCountForWave() {
        return this.currentDifficulty.enemyCount + this.wave - 1;
    }
    
    /**
     * 获取敌人速度
     */
    getEnemySpeed() {
        return this.currentDifficulty.enemySpeed + (this.wave - 1) * 0.5;
    }
    
    /**
     * 获取敌人生成速率
     */
    getSpawnRate() {
        return this.currentDifficulty.spawnRate + (this.wave - 1) * 0.005;
    }
    
    /**
     * 是否应该生成新敌人
     */
    shouldSpawnEnemy(currentEnemyCount) {
        const maxEnemies = this.getEnemyCountForWave();
        return Math.random() < this.getSpawnRate() && currentEnemyCount < maxEnemies;
    }
    
    /**
     * 下一波
     */
    nextWave() {
        this.wave++;
    }
    
    /**
     * 重置
     */
    reset() {
        this.wave = 1;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = WaveSystem;
}