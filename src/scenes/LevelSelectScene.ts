import Phaser from 'phaser';
import { COLORS } from '../theme';
import { LEVELS } from '../levels';
import { SaveManager } from '../state/SaveManager';
import { Sfx } from '../audio/Sfx';
import { makeButton } from '../ui/Button';

/** ステージ選択画面。クリア状況・解放状況を反映したグリッド。 */
export class LevelSelectScene extends Phaser.Scene {
  constructor() {
    super('LevelSelect');
  }

  create(): void {
    // どの経路から来ても、残っているゲーム/リザルトを停止（画面の重なり防止）
    this.scene.stop('Game');
    this.scene.stop('Result');

    const w = this.scale.width;
    const h = this.scale.height;
    this.add.rectangle(0, 0, w, h, COLORS.exteriorDark).setOrigin(0, 0);

    this.add
      .text(w / 2, 70, 'ステージ選択', {
        fontFamily: 'sans-serif',
        fontSize: '40px',
        color: COLORS.textLight,
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    this.add
      .text(w - 24, 28, `💰 ${SaveManager.coins}`, {
        fontFamily: 'sans-serif',
        fontSize: '28px',
        color: COLORS.accent,
        fontStyle: 'bold',
      })
      .setOrigin(1, 0);

    // グリッド
    const cols = 3;
    const cell = 160;
    const gap = 30;
    const firstX = (w - (cols * cell + (cols - 1) * gap)) / 2 + cell / 2;
    const firstY = 220;
    const step = cell + gap;

    LEVELS.forEach((_lvl, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = firstX + col * step;
      const y = firstY + row * step;
      const unlocked = SaveManager.isUnlocked(i);
      const cleared = SaveManager.isCleared(i);
      const color = unlocked ? (cleared ? 0x2e7d4f : 0x3a3350) : 0x241f33;

      const box = this.add.rectangle(x, y, cell, cell, color).setStrokeStyle(3, 0xffffff, 0.12);
      this.add
        .text(x, unlocked ? y - 14 : y, unlocked ? `${i + 1}` : '🔒', {
          fontFamily: 'sans-serif',
          fontSize: unlocked ? '52px' : '44px',
          color: unlocked ? COLORS.textLight : '#6b6480',
          fontStyle: 'bold',
        })
        .setOrigin(0.5);
      if (cleared) {
        this.add
          .text(x, y + 44, '★', { fontSize: '34px', color: COLORS.accent })
          .setOrigin(0.5);
      }
      if (unlocked) {
        box.setInteractive({ useHandCursor: true });
        box.on(Phaser.Input.Events.POINTER_DOWN, () => {
          Sfx.click();
          this.scene.start('Game', { levelIndex: i });
        });
        box.on(Phaser.Input.Events.POINTER_OVER, () => box.setScale(1.05));
        box.on(Phaser.Input.Events.POINTER_OUT, () => box.setScale(1));
      }
    });

    makeButton(this, w / 2, h - 70, '◀ メニュー', {
      width: 260,
      color: 0x3a3350,
      onClick: () => this.scene.start('Menu'),
    });
  }
}
