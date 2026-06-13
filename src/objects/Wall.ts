import Phaser from 'phaser';
import { COLORS } from '../theme';

/** 壁: 動かない静的バリア。傾けてスロープにもできる。 */
export class Wall {
  readonly go: Phaser.GameObjects.Rectangle;

  constructor(scene: Phaser.Scene, x: number, y: number, w: number, h: number, angleDeg = 0) {
    this.go = scene.add.rectangle(x, y, w, h, COLORS.wall);
    this.go.setStrokeStyle(2, COLORS.wallStroke, 1);
    this.go.setAngle(angleDeg);
    scene.matter.add.gameObject(this.go, {
      isStatic: true,
      label: 'wall',
      angle: Phaser.Math.DegToRad(angleDeg),
      friction: 0.4,
    });
  }
}
