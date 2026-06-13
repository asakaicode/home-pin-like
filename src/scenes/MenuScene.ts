import Phaser from 'phaser';
import { COLORS } from '../theme';
import { SaveManager } from '../state/SaveManager';
import { Sfx } from '../audio/Sfx';
import { makeButton } from '../ui/Button';

/** タイトル/メニュー画面。 */
export class MenuScene extends Phaser.Scene {
  private soundIcon!: Phaser.GameObjects.Text;

  constructor() {
    super('Menu');
  }

  create(): void {
    const w = this.scale.width;
    const h = this.scale.height;
    this.add.rectangle(0, 0, w, h, 0x1a1626).setOrigin(0, 0);

    // タイトル
    this.add
      .text(w / 2, h * 0.22, 'HOME', {
        fontFamily: 'sans-serif',
        fontSize: '96px',
        color: COLORS.accent,
        fontStyle: 'bold',
      })
      .setOrigin(0.5);
    this.add
      .text(w / 2, h * 0.22 + 96, 'PIN', {
        fontFamily: 'sans-serif',
        fontSize: '96px',
        color: COLORS.textLight,
        fontStyle: 'bold',
      })
      .setOrigin(0.5);
    this.add
      .text(w / 2, h * 0.22 + 175, 'ピンを抜いてお宝を集めよう', {
        fontFamily: 'sans-serif',
        fontSize: '24px',
        color: COLORS.textDim,
      })
      .setOrigin(0.5);

    // ミニ装飾（ピンの上に宝石）
    const py = h * 0.5;
    this.add.rectangle(w / 2, py, 280, 18, COLORS.pin).setStrokeStyle(3, COLORS.pinStroke, 1);
    for (let i = 0; i < 4; i++) {
      this.add
        .circle(w / 2 - 66 + i * 44, py - 22, 18, COLORS.gem)
        .setStrokeStyle(3, COLORS.gemStroke, 1);
    }

    // コイン表示
    this.add
      .text(w - 24, 28, `💰 ${SaveManager.coins}`, {
        fontFamily: 'sans-serif',
        fontSize: '30px',
        color: COLORS.accent,
        fontStyle: 'bold',
      })
      .setOrigin(1, 0);

    // サウンド切替
    const soundBg = this.add
      .circle(46, 46, 30, 0x3a3350)
      .setInteractive({ useHandCursor: true });
    this.soundIcon = this.add
      .text(46, 46, SaveManager.soundOn ? '🔊' : '🔇', { fontSize: '30px' })
      .setOrigin(0.5);
    soundBg.on(Phaser.Input.Events.POINTER_DOWN, () => {
      const on = SaveManager.toggleSound();
      this.soundIcon.setText(on ? '🔊' : '🔇');
      Sfx.click();
    });

    // あそぶ
    makeButton(this, w / 2, h * 0.68, '▶ あそぶ', {
      width: 380,
      height: 84,
      color: 0x2e7d4f,
      fontSize: '36px',
      onClick: () => this.scene.start('LevelSelect'),
    });
  }
}
