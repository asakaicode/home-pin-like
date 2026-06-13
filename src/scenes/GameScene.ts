import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config';
import { Pin } from '../objects/Pin';
import { Gem } from '../objects/Gem';

/**
 * フェーズ1: 物理サンドボックス。
 * ピンの上に宝石を乗せ、ピンをタップして抜くと宝石が落下することを確認する。
 * 後続フェーズで LevelLoader 駆動の本格的なパズルへ置き換える。
 */
export class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  create(): void {
    this.matter.world.setBounds(0, 0, GAME_WIDTH, GAME_HEIGHT, 64);

    this.add
      .text(GAME_WIDTH / 2, 70, 'Phase 1 — ピンをタップして抜こう', {
        fontFamily: 'sans-serif',
        fontSize: '30px',
        color: '#ffffff',
      })
      .setOrigin(0.5);

    // 上段: ピンの上に宝石クラスタが乗っている
    new Pin(this, 360, 520, { width: 320 });
    for (let i = 0; i < 6; i++) {
      new Gem(this, 250 + i * 44, 440 - (i % 2) * 26);
    }

    // 下段: 落ちた宝石を受け止める段差ピン
    new Pin(this, 250, 820, { width: 260 });
    new Pin(this, 520, 1000, { width: 220 });
  }
}
