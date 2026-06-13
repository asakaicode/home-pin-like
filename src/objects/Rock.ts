import Phaser from 'phaser';
import { COLORS } from '../theme';

/** 岩: 溶岩と水が接触して生成される静的な固体。足場や障害物になる。 */
export class Rock {
  readonly go: Phaser.GameObjects.Arc;

  constructor(scene: Phaser.Scene, x: number, y: number, radius = 13) {
    this.go = scene.add.circle(x, y, radius, COLORS.rock);
    this.go.setStrokeStyle(2, COLORS.rockStroke, 1);
    scene.matter.add.gameObject(this.go, {
      isStatic: true,
      shape: { type: 'circle', radius: radius - 1 },
      label: 'rock',
      friction: 0.9,
    });
  }
}
