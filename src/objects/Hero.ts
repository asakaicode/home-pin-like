import Phaser from 'phaser';
import { COLORS } from '../theme';

/** ヒーロー: 守る対象。溶岩が触れると失敗になる静的キャラ。 */
export class Hero {
  readonly go: Phaser.GameObjects.Arc;

  constructor(scene: Phaser.Scene, x: number, y: number, radius = 34) {
    this.go = scene.add.circle(x, y, radius, COLORS.hero);
    this.go.setStrokeStyle(3, COLORS.heroStroke, 1);
    scene.matter.add.gameObject(this.go, {
      isStatic: true,
      shape: { type: 'circle', radius },
      label: 'hero',
    });

    // 顔（静的なので固定座標の装飾でよい）
    scene.add.circle(x - 12, y - 6, 5, 0x2a2a2a);
    scene.add.circle(x + 12, y - 6, 5, 0x2a2a2a);
    scene.add.rectangle(x, y + 11, 18, 4, 0x2a2a2a).setOrigin(0.5);
  }
}
