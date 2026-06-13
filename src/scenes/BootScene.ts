import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config';

/**
 * フェーズ0: スキャフォールド確認用の最小シーン。
 * タイトル表示と、物理が動いていることを示すサンプルの落下ボールを置く。
 * 後続フェーズで Boot → Menu → Game などへ拡張する。
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  create(): void {
    const cx = GAME_WIDTH / 2;

    this.add
      .text(cx, 220, 'HOME PIN LIKE', {
        fontFamily: 'sans-serif',
        fontSize: '64px',
        color: '#ffd34d',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    this.add
      .text(cx, 300, 'Phase 0 — scaffold OK', {
        fontFamily: 'sans-serif',
        fontSize: '28px',
        color: '#ffffff',
      })
      .setOrigin(0.5);

    // 物理が動作していることの確認: 弾むボールを落とす。
    this.matter.world.setBounds(0, 0, GAME_WIDTH, GAME_HEIGHT);
    this.matter.add.circle(cx, 460, 30, { restitution: 0.85, friction: 0.02 });
  }
}
