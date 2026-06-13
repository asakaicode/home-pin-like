import Phaser from 'phaser';
import { COLORS } from '../theme';
import { Rock } from '../objects/Rock';

export type LiquidKind = 'lava' | 'water';

interface Particle {
  go: Phaser.GameObjects.Arc;
  kind: LiquidKind;
  converted: boolean;
}

/**
 * 液体（溶岩・水）を多数の小さな円の粒子で表現するシステム。
 * 粒子は剛体として流動・堆積する。溶岩と水が接触すると両者を消し、岩に変える。
 * 見た目の半径を物理半径より大きくして、重なりで「液体の塊」に見せる（簡易メタボール）。
 */
export class LiquidSystem {
  private scene: Phaser.Scene;
  private particles = new Map<number, Particle>();

  private static readonly PHYS_R = 9;
  private static readonly VIS_R = 14;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  /** (x, y) を下端中心として、上方向へ volume 個の粒子をまとめて生成する。 */
  spawnPool(x: number, y: number, kind: LiquidKind, volume: number): void {
    const gap = LiquidSystem.PHYS_R * 2 + 1;
    const perRow = Math.max(1, Math.ceil(Math.sqrt(volume)));
    let i = 0;
    for (let row = 0; i < volume; row++) {
      for (let col = 0; col < perRow && i < volume; col++) {
        const px = x + (col - (perRow - 1) / 2) * gap + (row % 2) * (gap / 2);
        const py = y - row * gap;
        this.spawnParticle(px, py, kind);
        i++;
      }
    }
  }

  private spawnParticle(x: number, y: number, kind: LiquidKind): void {
    const color = kind === 'lava' ? COLORS.lava : COLORS.water;
    const go = this.scene.add.circle(x, y, LiquidSystem.VIS_R, color);
    this.scene.matter.add.gameObject(go, {
      shape: { type: 'circle', radius: LiquidSystem.PHYS_R },
      label: kind,
      restitution: 0.02,
      friction: 0.004,
      frictionAir: kind === 'lava' ? 0.03 : 0.012, // 溶岩は粘性が高い表現
      density: 0.0016,
    });
    const body = go.body as MatterJS.BodyType;
    this.particles.set(body.id, { go, kind, converted: false });
  }

  /** 溶岩と水の接触を処理し、両者を岩へ変換する。GameScene の衝突判定から呼ばれる。 */
  handleContact(a: MatterJS.BodyType, b: MatterJS.BodyType): void {
    const pa = this.particles.get(a.id);
    const pb = this.particles.get(b.id);
    if (!pa || !pb || pa.converted || pb.converted) return;
    if (pa.kind === pb.kind) return;

    pa.converted = true;
    pb.converted = true;
    const mx = (pa.go.x + pb.go.x) / 2;
    const my = (pa.go.y + pb.go.y) / 2;

    this.removeParticle(a.id, pa);
    this.removeParticle(b.id, pb);

    new Rock(this.scene, mx, my);

    // 冷却の蒸気エフェクト（小さな白い円が浮かんで消える）
    const steam = this.scene.add.circle(mx, my, 10, 0xffffff, 0.5);
    this.scene.tweens.add({
      targets: steam,
      y: my - 40,
      alpha: 0,
      scale: 1.6,
      duration: 500,
      onComplete: () => steam.destroy(),
    });
  }

  private removeParticle(id: number, p: Particle): void {
    this.scene.matter.world.remove(p.go.body as MatterJS.BodyType);
    p.go.destroy();
    this.particles.delete(id);
  }
}
