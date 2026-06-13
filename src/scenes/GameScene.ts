import Phaser from 'phaser';
import { LEVELS } from '../levels';
import type { LevelData } from '../levels/levelSchema';
import { loadLevel } from '../systems/LevelLoader';
import { LiquidSystem } from '../systems/LiquidSystem';
import { Gem } from '../objects/Gem';
import { COLORS } from '../theme';
import { SaveManager } from '../state/SaveManager';
import { Sfx } from '../audio/Sfx';
import { makeButton } from '../ui/Button';

export interface GameSceneData {
  levelIndex?: number;
}

const COIN_FIRST_CLEAR = 50;
const COIN_REPLAY = 10;

/**
 * パズル本体シーン。レベルデータを読み込み、物理・操作・勝敗判定を回す。
 */
export class GameScene extends Phaser.Scene {
  private levelIndex = 0;
  private gems: Gem[] = [];
  private bodyToGem = new Map<number, Gem>();
  private totalToCollect = 0;
  private collected = 0;
  private resolved = false;
  private liquid!: LiquidSystem;
  private hudText!: Phaser.GameObjects.Text;

  constructor() {
    super('Game');
  }

  init(data: GameSceneData): void {
    let idx = data.levelIndex;
    if (idx === undefined) {
      // 初回起動時は ?level=N（1始まり）で開始レベルを指定できる（開発/ディープリンク用）
      const param = new URLSearchParams(window.location.search).get('level');
      const n = param !== null ? parseInt(param, 10) : NaN;
      if (!Number.isNaN(n)) idx = Phaser.Math.Clamp(n - 1, 0, LEVELS.length - 1);
    }
    this.levelIndex = idx ?? 0;
    this.gems = [];
    this.bodyToGem = new Map();
    this.collected = 0;
    this.resolved = false;
  }

  create(): void {
    const level = LEVELS[this.levelIndex % LEVELS.length];

    this.matter.world.setBounds(0, 0, level.world.width, level.world.height, 64);
    this.matter.world.setGravity(0, level.world.gravity);

    this.liquid = new LiquidSystem(this);
    const loaded = loadLevel(this, level, this.liquid);
    this.gems = loaded.gems;
    this.totalToCollect = level.goal.count;
    for (const g of this.gems) {
      this.bodyToGem.set(g.body.id, g);
    }

    this.buildHud(level);

    this.matter.world.on('collisionstart', this.onCollision, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      // シーン終了時に world が先に破棄されている場合があるため任意連鎖でガード
      this.matter?.world?.off('collisionstart', this.onCollision, this);
    });
  }

  private buildHud(level: LevelData): void {
    const w = this.scale.width;
    const h = this.scale.height;

    this.add
      .text(20, 22, `Lv.${level.id}  ${level.name}`, {
        fontFamily: 'sans-serif',
        fontSize: '26px',
        color: COLORS.textLight,
      })
      .setOrigin(0, 0);

    this.hudText = this.add
      .text(w - 20, 22, '', {
        fontFamily: 'sans-serif',
        fontSize: '28px',
        color: COLORS.accent,
        fontStyle: 'bold',
      })
      .setOrigin(1, 0);
    this.updateHud();

    if (level.hint) {
      this.add
        .text(w / 2, 66, level.hint, {
          fontFamily: 'sans-serif',
          fontSize: '20px',
          color: COLORS.textDim,
          align: 'center',
          wordWrap: { width: w - 60 },
        })
        .setOrigin(0.5, 0);
    }

    // 下部の操作ボタン（全面で反応する共通ボタン）
    makeButton(this, w / 2, h - 38, '↻ リトライ', {
      width: 210,
      height: 58,
      fontSize: '24px',
      onClick: () => this.scene.restart({ levelIndex: this.levelIndex }),
    });
    makeButton(this, 112, h - 38, '◀ 選択', {
      width: 168,
      height: 58,
      fontSize: '22px',
      onClick: () => this.scene.start('LevelSelect'),
    });
  }

  private updateHud(): void {
    this.hudText.setText(`💎 ${this.collected} / ${this.totalToCollect}`);
  }

  private onCollision(event: Phaser.Physics.Matter.Events.CollisionStartEvent): void {
    if (this.resolved) return;
    for (const pair of event.pairs) {
      this.resolvePair(pair.bodyA as MatterJS.BodyType, pair.bodyB as MatterJS.BodyType);
      if (this.resolved) return;
    }
  }

  private resolvePair(a: MatterJS.BodyType, b: MatterJS.BodyType): void {
    const la = a.label;
    const lb = b.label;

    // 溶岩 × 水 → 岩
    if ((la === 'lava' && lb === 'water') || (la === 'water' && lb === 'lava')) {
      this.liquid.handleContact(a, b);
      return;
    }

    // 宝石の相互作用
    if (la === 'gem' || lb === 'gem') {
      const gemBody = la === 'gem' ? a : b;
      const other = la === 'gem' ? b : a;
      const gem = this.bodyToGem.get(gemBody.id);
      if (!gem || gem.collected) return;
      if (other.label === 'goal') {
        gem.collect(other.position.x, other.position.y, () => this.onGemCollected());
      } else if (other.label === 'hazard' || other.label === 'lava') {
        this.lose();
      }
      return;
    }

    // 溶岩 × ヒーロー → 失敗
    if ((la === 'lava' && lb === 'hero') || (la === 'hero' && lb === 'lava')) {
      this.lose();
    }
  }

  private onGemCollected(): void {
    Sfx.collect();
    this.collected++;
    this.updateHud();
    if (this.collected >= this.totalToCollect) {
      this.win();
    }
  }

  private win(): void {
    if (this.resolved) return;
    this.resolved = true;
    Sfx.win();

    const firstClear = SaveManager.markCleared(this.levelIndex);
    const reward = firstClear ? COIN_FIRST_CLEAR : COIN_REPLAY;
    SaveManager.addCoins(reward);
    SaveManager.unlockUpTo(this.levelIndex + 1);

    this.time.delayedCall(320, () => {
      this.scene.launch('Result', {
        result: 'win',
        levelIndex: this.levelIndex,
        hasNext: this.levelIndex + 1 < LEVELS.length,
        coins: reward,
      });
      this.scene.pause();
    });
  }

  private lose(): void {
    if (this.resolved) return;
    this.resolved = true;
    Sfx.lose();
    this.cameras.main.shake(220, 0.012);
    this.time.delayedCall(280, () => {
      this.scene.launch('Result', {
        result: 'lose',
        levelIndex: this.levelIndex,
        hasNext: this.levelIndex + 1 < LEVELS.length,
      });
      this.scene.pause();
    });
  }
}
