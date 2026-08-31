/**
 * 游戏状态管理
 */
class GameState {
    constructor() {
        this.reset();
    }
    
    reset() {
        this.wave = 1;
        this.kills = 0;
        this.score = 0;
        this.startTime = 0;
        this.elapsedTime = 0;
        this.isVictory = false;
        this.difficulty = 'normal';
    }
    
    update(deltaTime) {
        if (this.startTime > 0) {
            this.elapsedTime += deltaTime;
        }
    }
    
    addKill(points = 10) {
        this.kills++;
        this.score += points;
    }
    
    nextWave() {
        this.wave++;
    }
    
    getTimeElapsed() {
        return Math.floor(this.elapsedTime);
    }
    
    setVictory() {
        this.isVictory = true;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameState;
}