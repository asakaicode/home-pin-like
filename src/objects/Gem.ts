import Phaser from 'phaser';
import { COLORS } from '../theme';

/**
 * 宝石: プレイヤーが集める対象。剛体の円としてふるまう。
 * ゴールに入ると collect() で回収アニメーション後に消える。
 */
export class Gem {
  readonly go: Phaser.GameObjects.Arc;
  readonly radius: number;
  collected = false;

  constructor(scene: Phaser.Scene, x: number, y: number, radius = 18) {
    this.radius = radius;
    this.go = scene.add.circle(x, y, radius, COLORS.gem);
    this.go.setStrokeStyle(3, COLORS.gemStroke, 1);
    this.go.setData('ref', this);
    scene.matter.add.gameObject(this.go, {
      shape: { type: 'circle', radius },
      label: 'gem',
      restitution: 0.2,
      friction: 0.02,
      frictionAir: 0.004,
      density: 0.002,
    });
  }

  get body(): MatterJS.BodyType {
    return this.go.body as MatterJS.BodyType;
  }

  /** ゴールへ吸い込まれる回収演出。完了で onDone を呼ぶ。 */
  collect(targetX: number, targetY: number, onDone: () => void): void {
    if (this.collected) return;
    this.collected = true;

    const scene = this.go.scene;
    scene.matter.world.remove(this.body);
    scene.tweens.add({
      targets: this.go,
      x: targetX,
      y: targetY,
      scale: 0.15,
      alpha: 0,
      duration: 240,
      ease: 'Back.easeIn',
      onComplete: () => {
        this.go.destroy();
        onDone();
      },
    });
  }
}
