/**
 * 输入管理系统 - 统一处理键盘、鼠标、触屏
 */
class InputManager {
    constructor() {
        this.keys = {};
        this.mouse = { x: 0, y: 0, clicked: false };
        this.touch = { x: 0, y: 0, active: false };
        this.inputMode = 'keyboard'; // 'keyboard' 或 'touch'
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // 键盘事件
        document.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            this.inputMode = 'keyboard';
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
        
        // 鼠标事件
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            this.inputMode = 'keyboard';
        });
        
        document.addEventListener('click', () => {
            this.mouse.clicked = true;
        });
        
        // 触屏事件
        document.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (e.touches.length > 0) {
                this.touch.x = e.touches[0].clientX;
                this.touch.y = e.touches[0].clientY;
                this.touch.active = true;
                this.inputMode = 'touch';
            }
        }, { passive: false });
        
        document.addEventListener('touchstart', (e) => {
            if (e.touches.length > 0) {
                this.touch.x = e.touches[0].clientX;
                this.touch.y = e.touches[0].clientY;
                this.touch.active = true;
                this.inputMode = 'touch';
            }
        });
        
        document.addEventListener('touchend', () => {
            this.touch.active = false;
        });
    }
    
    /**
     * 获取移动方向
     */
    getMovementDirection() {
        const dir = { x: 0, y: 0 };
        
        if (this.inputMode === 'touch' && this.touch.active) {
            return this.touch;
        }
        
        if (this.keys['w'] || this.keys['arrowup']) dir.y -= 1;
        if (this.keys['s'] || this.keys['arrowdown']) dir.y += 1;
        if (this.keys['a'] || this.keys['arrowleft']) dir.x -= 1;
        if (this.keys['d'] || this.keys['arrowright']) dir.x += 1;
        
        return dir;
    }
    
    /**
     * 获取目标位置
     */
    getTargetPosition() {
        return this.inputMode === 'touch' ? this.touch : this.mouse;
    }
    
    /**
     * 检查是否要射击
     */
    isShootTriggered() {
        const triggered = this.mouse.clicked || this.touch.active;
        this.mouse.clicked = false;
        return triggered;
    }
    
    /**
     * 重置输入状态
     */
    reset() {
        this.mouse.clicked = false;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = InputManager;
}