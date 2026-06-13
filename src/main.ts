import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, BG_COLOR, PHYSICS } from './config';
import { GameScene } from './scenes/GameScene';

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
  scene: [GameScene],
};

export default new Phaser.Game(config);
