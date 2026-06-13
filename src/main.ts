import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, BG_COLOR, PHYSICS } from './config';
import { GameScene } from './scenes/GameScene';
import { ResultScene } from './scenes/ResultScene';
import { AdManager } from './ads/AdManager';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  parent: 'game',
  backgroundColor: BG_COLOR,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'matter',
    matter: {
      gravity: { x: 0, y: PHYSICS.gravityY },
      debug: PHYSICS.debug,
    },
  },
  // 先頭の GameScene のみ自動起動。ResultScene は launch で重ねる。
  scene: [GameScene, ResultScene],
};

const game = new Phaser.Game(config);

// 下部の常設バナー広告を設置（?noads=1 で無効）
AdManager.mountBanner();

export default game;
