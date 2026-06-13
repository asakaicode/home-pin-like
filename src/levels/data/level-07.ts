import type { LevelData } from '../levelSchema';

/**
 * Lv.7: 溶岩の番人。
 * 正解: 左の上ピン→下ピンの順に抜いて宝石をゴールへ。
 * 失敗: 右の溶岩ピンを抜くとヒーローに溶岩が落ちてミス。
 */
export const level07: LevelData = {
  id: 7,
  name: '溶岩の番人',
  world: { width: 720, height: 1280, gravity: 1 },
  goal: { type: 'collectGems', count: 3 },
  hint: '左を上から順に。溶岩のピンは触らない',
  entities: [
    { type: 'wall', x: 380, y: 730, w: 20, h: 900 },
    { type: 'wall', x: 80, y: 800, w: 20, h: 800 },
    { type: 'wall', x: 645, y: 800, w: 20, h: 800 },

    // 左: 宝石＋2段のピン → ゴール
    { type: 'gem', x: 230, y: 300, count: 3, spread: 46 },
    { type: 'pin', x: 230, y: 370, w: 240 },
    { type: 'pin', x: 230, y: 640, w: 240 },
    { type: 'goalZone', x: 230, y: 1175, w: 280, h: 100 },

    // 右: 溶岩の罠＋ヒーロー
    { type: 'lava', x: 512, y: 320, volume: 36 },
    { type: 'pin', x: 512, y: 400, w: 244 },
    { type: 'hero', x: 512, y: 1120 },
  ],
};
