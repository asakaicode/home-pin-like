import Phaser from 'phaser';
import { COLORS } from '../theme';

export interface ResultData {
  result: 'win' | 'lose';
  levelIndex: number;
  hasNext?: boolean;
}

/** クリア/失敗のオーバーレイ。GameScene の上に重ねて表示される。 */
export class ResultScene extends Phaser.Scene {
  constructor() {
    super('Result');
  }

  create(data: ResultData): void {
    const w = this.scale.width;
    const h = this.scale.height;
    const win = data.result === 'win';

    this.add.rectangle(0, 0, w, h, 0x000000, 0.55).setOrigin(0, 0);

    const panel = this.add.rectangle(w / 2, h / 2, 540, 440, COLORS.panel, 1);
    panel.setStrokeStyle(3, 0xffffff, 0.15);

    this.add
      .text(w / 2, h / 2 - 140, win ? 'CLEAR!' : 'ミス…', {
        fontFamily: 'sans-serif',
        fontSize: '70px',
        color: win ? COLORS.success : COLORS.danger,
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    this.add
      .text(w / 2, h / 2 - 56, win ? 'ステージクリア！' : 'もう一度挑戦しよう', {
        fontFamily: 'sans-serif',
        fontSize: '28px',
        color: COLORS.textLight,
      })
      .setOrigin(0.5);

    if (win && data.hasNext) {
      this.makeButton(w / 2, h / 2 + 50, '▶ 次のステージ', 0x2e7d4f, () => {
        this.scene.start('Game', { levelIndex: data.levelIndex + 1 });
        this.scene.stop();
      });
      this.makeButton(w / 2, h / 2 + 130, '↻ もう一度', 0x3a3350, () => {
        this.scene.start('Game', { levelIndex: data.levelIndex });
        this.scene.stop();
      });
    } else if (win && !data.hasNext) {
      this.add
        .text(w / 2, h / 2 + 40, '🎉 全ステージクリア！', {
          fontFamily: 'sans-serif',
          fontSize: '26px',
          color: COLORS.accent,
        })
        .setOrigin(0.5);
      this.makeButton(w / 2, h / 2 + 120, '↻ もう一度', 0x3a3350, () => {
        this.scene.start('Game', { levelIndex: data.levelIndex });
        this.scene.stop();
      });
    } else {
      this.makeButton(w / 2, h / 2 + 70, '↻ もう一度', 0x8a3a3a, () => {
        this.scene.start('Game', { levelIndex: data.levelIndex });
        this.scene.stop();
      });
    }
  }

  private makeButton(
    x: number,
    y: number,
    label: string,
    color: number,
    onClick: () => void,
  ): void {
    const bg = this.add.rectangle(x, y, 320, 64, color, 1).setStrokeStyle(2, 0xffffff, 0.2);
    this.add
      .text(x, y, label, {
        fontFamily: 'sans-serif',
        fontSize: '28px',
        color: COLORS.textLight,
      })
      .setOrigin(0.5);
    bg.setInteractive({ useHandCursor: true });
    bg.on(Phaser.Input.Events.POINTER_DOWN, onClick);
    bg.on(Phaser.Input.Events.POINTER_OVER, () => bg.setScale(1.04));
    bg.on(Phaser.Input.Events.POINTER_OUT, () => bg.setScale(1));
  }
}
