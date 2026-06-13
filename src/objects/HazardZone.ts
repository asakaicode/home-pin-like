import Phaser from 'phaser';
import { COLORS } from '../theme';

/** 危険地帯: 宝石が触れると失敗になるセンサー領域（フェーズ3で溶岩に発展）。 */
export class HazardZone {
  readonly go: Phaser.GameObjects.Rectangle;

  constructor(scene: Phaser.Scene, x: number, y: number, w: number, h: number) {
    this.go = scene.add.rectangle(x, y, w, h, COLORS.hazard, 0.22);
    this.go.setStrokeStyle(2, COLORS.hazard, 0.8);
    scene.matter.add.gameObject(this.go, {
      isStatic: true,
      isSensor: true,
      label: 'hazard',
    });
  }
}
