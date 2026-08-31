# 坦克世界大战 🎮

一个用HTML、CSS和JavaScript创建的刺激浏览器坦克射击游戏。支持PC端和安卓端完美适配！

## ✨ 游戏特性

- 🎯 **多难度系统** - 简单、普通、困难三种难度选择
- 🎨 **炫彩特效** - 爆炸粒子效果和流畅的动画
- 📱 **完全移动适配** - 支持鼠标和触屏控制（安卓友好）
- 🌊 **波次系统** - 击败所有敌人后波次增加，难度提升
- 💻 **响应式设计** - 自动适配各种屏幕尺寸
- ⚡ **流畅性能** - 使用requestAnimationFrame实现60fps

## 🎮 游戏操作

### PC端
- **移动**: `W/A/S/D` 或 `方向键` 或 `鼠标移动`
- **射击**: 左键点击
- **暂停**: P 键或暂停按钮

### 安卓端
- **移动**: 手指拖动坦克
- **射击**: 点击屏幕
- **暂停**: 暂停按钮

## 🚀 快速开始

### 方法一：直接在浏览器中打开
1. 克隆项目：
   ```bash
   git clone https://github.com/linmo8255-cmd/tank-world-war.git
   cd tank-world-war
   ```
2. 用浏览器打开 `index.html` 文件

### 方法二：使用Python简单服务器
```bash
# Python 3
python -m http.server 8000

# 然后访问: http://localhost:8000
```

### 方法三：使用Node.js服务器
```bash
# 安装http-server
npm install -g http-server

# 启动服务器
http-server

# 然后访问: http://localhost:8080
```

### 方法四：Android手机上运行
1. 将文件放在支持的服务器上
2. 在手机浏览器中访问该地址
3. 或使用Android Studio的模拟器

## 📋 游戏规则

- 控制你的绿色坦克击败红色敌人
- 敌人会主动朝你移动并造成伤害
- 你的生命值显示在屏幕左上角
- 当生命值降至0时游戏结束
- 击败所有敌人后进入下一波，难度逐步升高
- 通过提高波次数来获得高分

## 🎯 游戏目标

- 在简单难度下生存尽可能多的波次
- 挑战困难难度并创建新的杀敌记录
- 与朋友比较最终得分

## 📁 文件结构

```
tank-world-war/
├── index.html      # 游戏主HTML文件
├── styles.css      # 游戏样式表
├── game.js         # 游戏逻辑和引擎
└── README.md       # 项目说明
```

## 🛠️ 技术栈

- **HTML5** - 结构和Canvas
- **CSS3** - 样式和响应式设计
- **JavaScript (ES6+)** - 游戏逻辑
- **Canvas API** - 2D图形渲染
- **Touch Events** - 移动设备支持

## 🎨 自定义选项

你可以通过编辑 `game.js` 中的配置修改游戏参数：

```javascript
const config = {
    difficulties: {
        easy: { enemyCount: 3, enemySpeed: 2, spawnRate: 0.02 },
        normal: { enemyCount: 5, enemySpeed: 3, spawnRate: 0.03 },
        hard: { enemyCount: 8, enemySpeed: 4, spawnRate: 0.04 }
    }
};
```

## 🚀 性能优化

- 使用Canvas 2D上下文缓存
- 对象池管理子弹和粒子
- 高效的碰撞检测
- 网格背景优化

## 📱 浏览器兼容性

- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ 安卓系统浏览器
- ✅ iOS Safari

## 🐛 已知问题

无当前已知问题。如有问题，请提交Issue。

## 🤝 贡献

欢迎提交Pull Request或Issue来改进游戏！

## 📄 许可证

MIT License - 详见LICENSE文件

## 👨‍💻 开发者

- **项目创建者**: linmo8255-cmd
- **创建日期**: 2026年8月31日

## 🎮 玩家提示

- 在困难模式下，尽量不要被围困
- 使用地形和敌人的移动预判来躲避
- 集中火力优先击杀接近你的敌人
- 保持移动可以躲避敌人的大部分攻击

---

**祝你游戏愉快！🎉**
