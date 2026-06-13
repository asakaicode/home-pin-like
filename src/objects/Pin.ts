import Phaser from 'phaser';
import { COLORS } from '../theme';
import { Sfx } from '../audio/Sfx';

export interface PinOptions {
  width?: number;
  height?: number;
  /** 度数法の傾き（任意）。傾けると台として宝石を転がせる。 */
  angle?: number;
  color?: number;
}

/**
 * ピン: 物体をせき止める静的バリア。タップすると「抜ける」。
 * 抜くと物理ボディを除去し、せき止めていた物体が落下する。視覚的には横へスライドして消える。
 */
export class Pin {
  readonly scene: Phaser.Scene;
  readonly go: Phaser.GameObjects.Rectangle;
  private body: MatterJS.BodyType;
  private pulled = false;

  /** 抜かれた瞬間に呼ばれるコールバック（勝敗判定などで使用）。 */
  onPulled?: (pin: Pin) => void;

  constructor(scene: Phaser.Scene, x: number, y: number, opts: PinOptions = {}) {
    this.scene = scene;
    const w = opts.width ?? 220;
    const h = opts.height ?? 18;
    const angleDeg = opts.angle ?? 0;
    const color = opts.color ?? COLORS.pin;

    this.go = scene.add.rectangle(x, y, w, h, color);
    this.go.setStrokeStyle(3, COLORS.pinStroke, 1);
    this.go.setAngle(angleDeg);
    scene.matter.add.gameObject(this.go, {
      isStatic: true,
      label: 'pin',
      angle: Phaser.Math.DegToRad(angleDeg),
      friction: 0.6,
    });
    this.body = this.go.body as MatterJS.BodyType;

    this.go.setInteractive({ useHandCursor: true });
    this.go.on(Phaser.Input.Events.POINTER_DOWN, () => this.pull());
  }

  get isPulled(): boolean {
    return this.pulled;
  }

  pull(): void {
    if (this.pulled) return;
    this.pulled = true;
    Sfx.pin();

    // 物理ボディを除去 → せき止めていた物体が落下する
    this.scene.matter.world.remove(this.body);

    // 視覚的に近い方の横へスライドアウト
    const dir = this.go.x < this.scene.scale.width / 2 ? -1 : 1;
    this.scene.tweens.add({
      targets: this.go,
      x: this.go.x + dir * 520,
      angle: this.go.angle + dir * 14,
      alpha: 0,
      duration: 260,
      ease: 'Quad.easeIn',
      onComplete: () => this.go.destroy(),
    });

    this.onPulled?.(this);
  }
}
