import type { LevelData } from '../levelSchema';

/**
 * Lv.4: 水と溶岩（水の入門）。
 * 左: 宝石ピンを抜くと宝石が真下のゴールへ（確実にクリアできる本筋）。
 * 右: 水ピンを抜くと水が溶岩に注がれ岩に変わる（任意の体験デモ。勝敗には影響しない）。
 * より歯ごたえのある「岩で橋を架ける」水パズルはフェーズ5で用意する。
 */
export const level04: LevelData = {
  id: 4,
  name: '水と溶岩',
  world: { width: 720, height: 1280, gravity: 1 },
  goal: { type: 'collectGems', count: 3 },
  hint: '水を溶岩に注ぐと岩になる！宝石は左のゴールへ',
  entities: [
    // 中央の仕切りと外壁
    { type: 'wall', x: 380, y: 730, w: 20, h: 900 },
    { type: 'wall', x: 80, y: 800, w: 20, h: 800 },
    { type: 'wall', x: 645, y: 800, w: 20, h: 800 },

    // 左: 宝石 → ゴール（本筋）
    { type: 'gem', x: 235, y: 360, count: 3, spread: 48 },
    { type: 'pin', x: 245, y: 430, w: 250 },
    { type: 'goalZone', x: 230, y: 1175, w: 280, h: 100 },

    // 右: 水→溶岩の体験デモ（カップで囲って外に出さない）
    { type: 'wall', x: 432, y: 900, w: 18, h: 130 }, // カップ左壁
    { type: 'wall', x: 610, y: 900, w: 18, h: 130 }, // カップ右壁
    { type: 'wall', x: 521, y: 962, w: 196, h: 28 }, // カップ底
    { type: 'lava', x: 521, y: 922, volume: 20 },
    { type: 'water', x: 521, y: 560, volume: 24 },
    { type: 'pin', x: 521, y: 620, w: 170 },
  ],
};
