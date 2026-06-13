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
 * ピン（釘/ボルト風）。両端に金色の留め具がつく。
 * タップで「グッと引き抜く」アニメ、ドラッグで実際に引っ張って抜ける操作に対応。
 * 引き抜く間は静的ボディを軸方向にスライドさせるので、上の物体が自然に落ち始める。
 */
export class Pin {
  readonly scene: Phaser.Scene;
  readonly rod: Phaser.GameObjects.Rectangle;
  private cap1: Phaser.GameObjects.Arc;
  private cap2: Phaser.GameObjects.Arc;
  private body: MatterJS.BodyType;

  private readonly length: number;
  private readonly startX: number;
  private readonly startY: number;
  private readonly axisX: number;
  private readonly axisY: number;
  private readonly commitDist: number;

  private pulled = false;
  private didDrag = false;

  onPulled?: (pin: Pin) => void;

  constructor(scene: Phaser.Scene, x: number, y: number, opts: PinOptions = {}) {
    this.scene = scene;
    const w = opts.width ?? 220;
    const h = opts.height ?? 18;
    const angleDeg = opts.angle ?? 0;
    const color = opts.color ?? COLORS.pin;

    this.length = w;
    this.startX = x;
    this.startY = y;

    // 棒（当たり判定つき）
    this.rod = scene.add.rectangle(x, y, w, h, color);
    this.rod.setStrokeStyle(3, COLORS.pinStroke, 1);
    this.rod.setAngle(angleDeg);
    scene.matter.add.gameObject(this.rod, {
      isStatic: true,
      label: 'pin',
      angle: Phaser.Math.DegToRad(angleDeg),
      friction: 0.6,
    });
    this.body = this.rod.body as MatterJS.BodyType;

    // 両端の金色の留め具
    const capR = Math.max(h * 0.95, 14);
    this.cap1 = scene.add.circle(0, 0, capR, COLORS.pinCap).setStrokeStyle(4, COLORS.pinStroke, 1);
    this.cap2 = scene.add.circle(0, 0, capR, COLORS.pinCap).setStrokeStyle(4, COLORS.pinStroke, 1);
    this.refreshCaps();

    // 引き抜く向き（近い方の端へ）と軸
    const dir = x < scene.scale.width / 2 ? -1 : 1;
    const a = Phaser.Math.DegToRad(angleDeg);
    this.axisX = Math.cos(a) * dir;
    this.axisY = Math.sin(a) * dir;
    this.commitDist = Math.min(52, w * 0.3);

    this.rod.setInteractive({ useHandCursor: true, draggable: true });
    scene.input.setDraggable(this.rod);
    this.rod.on(Phaser.Input.Events.POINTER_DOWN, () => {
      this.didDrag = false;
    });
    this.rod.on(Phaser.Input.Events.GAMEOBJECT_DRAG_START, () => {
      this.didDrag = true;
    });
    this.rod.on(
      Phaser.Input.Events.GAMEOBJECT_DRAG,
      (pointer: Phaser.Input.Pointer) => this.onDrag(pointer),
    );
    this.rod.on(Phaser.Input.Events.GAMEOBJECT_DRAG_END, () => this.onDragEnd());
    // ドラッグせずタップした場合は「グッと引き抜く」アニメで抜く
    this.rod.on(Phaser.Input.Events.POINTER_UP, () => {
      if (!this.pulled && !this.didDrag) this.yank();
    });
  }

  get isPulled(): boolean {
    return this.pulled;
  }

  /** 棒の現在位置から両端の留め具を再配置する。 */
  private refreshCaps(): void {
    const a = this.rod.rotation;
    const half = this.length / 2;
    const ex = Math.cos(a) * half;
    const ey = Math.sin(a) * half;
    this.cap1.setPosition(this.rod.x - ex, this.rod.y - ey).setAlpha(this.rod.alpha);
    this.cap2.setPosition(this.rod.x + ex, this.rod.y + ey).setAlpha(this.rod.alpha);
  }

  /** 現在の引き出し量（軸方向の距離）。 */
  private currentProj(): number {
    const dx = this.rod.x - this.startX;
    const dy = this.rod.y - this.startY;
    return dx * this.axisX + dy * this.axisY;
  }

  private moveTo(proj: number): void {
    const nx = this.startX + this.axisX * proj;
    const ny = this.startY + this.axisY * proj;
    this.scene.matter.body.setPosition(this.body, { x: nx, y: ny });
    this.rod.setPosition(nx, ny);
    this.refreshCaps();
  }

  private onDrag(pointer: Phaser.Input.Pointer): void {
    if (this.pulled) return;
    const dx = pointer.worldX - this.startX;
    const dy = pointer.worldY - this.startY;
    const proj = dx * this.axisX + dy * this.axisY; // 軸方向（外向き）の距離
    if (proj >= this.commitDist) {
      this.commit();
      return;
    }
    this.moveTo(Math.max(0, proj));
  }

  private onDragEnd(): void {
    if (this.pulled) return;
    const proj = this.currentProj();
    if (proj < 12) {
      // ほぼ動かさずに離した＝タップ扱いで一気に引き抜く
      this.yank();
      return;
    }
    // しきい値未満で離した → 元の位置へ戻す
    const state = { p: proj };
    this.scene.tweens.add({
      targets: state,
      p: 0,
      duration: 130,
      ease: 'Back.easeOut',
      onUpdate: () => this.moveTo(state.p),
    });
  }

  /** タップ時：少し溜めてから一気に引き抜く。 */
  private yank(): void {
    if (this.pulled) return;
    this.pulled = true;
    // 溜め（少しだけ逆向きへ）→ commit
    const anticip = { p: 0 };
    this.scene.tweens.add({
      targets: anticip,
      p: -8,
      duration: 70,
      yoyo: false,
      ease: 'Sine.easeOut',
      onUpdate: () => {
        const nx = this.startX + this.axisX * anticip.p;
        const ny = this.startY + this.axisY * anticip.p;
        this.scene.matter.body.setPosition(this.body, { x: nx, y: ny });
        this.rod.setPosition(nx, ny);
        this.refreshCaps();
      },
      onComplete: () => this.slideOut(),
    });
  }

  /** ドラッグでしきい値を超えた時：その場から抜け切る。 */
  private commit(): void {
    if (this.pulled) return;
    this.pulled = true;
    this.slideOut();
  }

  /** 軸方向に抜け切るアニメ。途中でボディを除去して上の物体を落とす。 */
  private slideOut(): void {
    Sfx.pin();
    this.spawnDust();
    this.onPulled?.(this);

    const target = this.length + 160;
    const state = { p: Math.max(0, this.currentProj()), removed: false };
    this.scene.tweens.add({
      targets: state,
      p: target,
      duration: 210,
      ease: 'Quad.easeIn',
      onUpdate: () => {
        const nx = this.startX + this.axisX * state.p;
        const ny = this.startY + this.axisY * state.p;
        if (!state.removed && state.p >= this.length * 0.8) {
          this.scene.matter.world.remove(this.body);
          state.removed = true;
        } else if (!state.removed) {
          this.scene.matter.body.setPosition(this.body, { x: nx, y: ny });
        }
        this.rod.setPosition(nx, ny);
        this.rod.setAlpha(Phaser.Math.Clamp(1 - (state.p - this.length) / 160, 0, 1));
        this.refreshCaps();
      },
      onComplete: () => this.destroyVisual(),
    });
  }

  private spawnDust(): void {
    for (let i = 0; i < 5; i++) {
      const d = this.scene.add.circle(
        this.startX + (i - 2) * 6,
        this.startY,
        Phaser.Math.Between(3, 6),
        0xcfc6e0,
        0.7,
      );
      this.scene.tweens.add({
        targets: d,
        x: d.x + (i - 2) * 14,
        y: d.y - Phaser.Math.Between(10, 30),
        alpha: 0,
        scale: 1.6,
        duration: 360,
        onComplete: () => d.destroy(),
      });
    }
  }

  private destroyVisual(): void {
    this.rod.destroy();
    this.cap1.destroy();
    this.cap2.destroy();
  }
}
