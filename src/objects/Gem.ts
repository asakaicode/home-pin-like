import Phaser from 'phaser';

/**
 * 宝石: プレイヤーが集める対象。剛体の円としてふるまう。
 */
export class Gem {
  readonly go: Phaser.GameObjects.Arc;

  constructor(scene: Phaser.Scene, x: number, y: number, radius = 18) {
    this.go = scene.add.circle(x, y, radius, 0x4dd2ff);
    this.go.setStrokeStyle(3, 0x1a6e8e, 1);
    scene.matter.add.gameObject(this.go, {
      shape: { type: 'circle', radius },
      label: 'gem',
      restitution: 0.25,
      friction: 0.02,
      frictionAir: 0.004,
      density: 0.002,
    });
  }

  get body(): MatterJS.BodyType {
    return this.go.body as MatterJS.BodyType;
  }
}
