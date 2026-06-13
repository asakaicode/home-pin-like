import Phaser from 'phaser';
import { COLORS } from '../theme';
import { AdManager } from '../ads/AdManager';
import { SaveManager } from '../state/SaveManager';
import { makeButton } from '../ui/Button';

export interface ResultData {
  result: 'win' | 'lose';
  levelIndex: number;
  hasNext?: boolean;
  /** 今回獲得したコイン（クリア時）。 */
  coins?: number;
}

/** クリア/失敗のオーバーレイ。GameScene の上に重ねて表示される。 */
export class ResultScene extends Phaser.Scene {
  constructor() {
    super('Result');
  }

  create(data: ResultData): void {
    const w = this.scale.width;
    const h = this.scale.height;
    const cx = w / 2;
    const cy = h / 2;
    const win = data.result === 'win';

    this.add.rectangle(0, 0, w, h, 0x000000, 0.6).setOrigin(0, 0);
    this.add.rectangle(cx, cy, 560, 560, COLORS.panel, 1).setStrokeStyle(3, 0xffffff, 0.15);

    this.add
      .text(cx, cy - 210, win ? 'CLEAR!' : 'ミス…', {
        fontFamily: 'sans-serif',
        fontSize: '70px',
        color: win ? COLORS.success : COLORS.danger,
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    if (win) {
      this.buildWin(cx, cy, data);
    } else {
      this.buildLose(cx, cy, data);
    }
  }

  private buildWin(cx: number, cy: number, data: ResultData): void {
    const reward = data.coins ?? 0;
    const coinText = this.add
      .text(cx, cy - 130, `+${reward} 💰`, {
        fontFamily: 'sans-serif',
        fontSize: '40px',
        color: COLORS.accent,
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    if (data.hasNext) {
      makeButton(this, cx, cy - 50, '▶ 次のステージ', {
        width: 380,
        height: 66,
        color: 0x2e7d4f,
        onClick: () => AdManager.showInterstitial(() => this.startLevel(data.levelIndex + 1)),
      });
    } else {
      this.add
        .text(cx, cy - 50, '🎉 全ステージクリア！', {
          fontFamily: 'sans-serif',
          fontSize: '28px',
          color: COLORS.accent,
        })
        .setOrigin(0.5);
    }

    // コイン2倍（動画リワード）— 1回だけ
    const doubleBtn = makeButton(this, cx, cy + 30, '📺 コイン2倍', {
      width: 380,
      height: 60,
      color: 0x35507a,
      onClick: () => {
        AdManager.showRewarded({
          label: `コイン ${reward} を追加`,
          onReward: () => {
            SaveManager.addCoins(reward);
            coinText.setText(`+${reward * 2} 💰`);
            doubleBtn.disable();
            doubleBtn.setLabel('✓ 受け取り済み');
          },
        });
      },
    });

    this.buildBottomRow(cx, cy + 115, data.levelIndex);
  }

  private buildLose(cx: number, cy: number, data: ResultData): void {
    this.add
      .text(cx, cy - 130, 'もう一度挑戦しよう', {
        fontFamily: 'sans-serif',
        fontSize: '26px',
        color: COLORS.textLight,
      })
      .setOrigin(0.5);

    makeButton(this, cx, cy - 50, '↻ もう一度', {
      width: 380,
      height: 66,
      color: 0x8a3a3a,
      onClick: () => this.startLevel(data.levelIndex),
    });

    if (data.hasNext) {
      makeButton(this, cx, cy + 30, '📺 動画を見てスキップ', {
        width: 380,
        height: 60,
        color: 0x35507a,
        fontSize: '24px',
        onClick: () =>
          AdManager.showRewarded({
            label: 'このステージをスキップ',
            onReward: () => this.startLevel(data.levelIndex + 1),
          }),
      });
    }

    makeButton(this, cx, cy + 115, '≡ レベル選択', {
      width: 380,
      height: 60,
      color: 0x3a3350,
      onClick: () => this.startSelect(),
    });
  }

  /** 「もう一度」「レベル選択」を横並びで配置。 */
  private buildBottomRow(cx: number, y: number, levelIndex: number): void {
    makeButton(this, cx - 98, y, '↻ もう一度', {
      width: 182,
      height: 58,
      fontSize: '22px',
      color: 0x3a3350,
      onClick: () => this.startLevel(levelIndex),
    });
    makeButton(this, cx + 98, y, '≡ 選択', {
      width: 182,
      height: 58,
      fontSize: '22px',
      color: 0x3a3350,
      onClick: () => this.startSelect(),
    });
  }

  private startLevel(levelIndex: number): void {
    this.scene.start('Game', { levelIndex });
    this.scene.stop();
  }

  private startSelect(): void {
    // 一時停止中の GameScene を必ず停止してから選択画面へ（画面の重なりを防ぐ）
    this.scene.stop('Game');
    this.scene.start('LevelSelect');
    this.scene.stop();
  }
}
