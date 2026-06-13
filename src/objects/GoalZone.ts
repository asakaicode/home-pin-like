import Phaser from 'phaser';
import { COLORS } from '../theme';

/** ゴール: 宝石が入ると回収されるセンサー領域。 */
export class GoalZone {
  readonly go: Phaser.GameObjects.Rectangle;

  constructor(scene: Phaser.Scene, x: number, y: number, w: number, h: number) {
    this.go = scene.add.rectangle(x, y, w, h, COLORS.goal, 0.16);
    this.go.setStrokeStyle(2, COLORS.goal, 0.7);
    scene.matter.add.gameObject(this.go, {
      isStatic: true,
      isSensor: true,
      label: 'goal',
    });
  }
}
