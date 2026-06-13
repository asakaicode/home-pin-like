import type { LevelData } from '../levelSchema';

/**
 * Lv.3: 溶岩からヒーローを守れ。
 * 正解: 左の宝石ピンだけを抜く → 宝石が真下のゴールへ。
 * 失敗: 右の溶岩ピンを抜くと、溶岩がヒーローに落ちてミス。
 * 中央の高い仕切りで左右の縦穴を完全に分け、溶岩が宝石側へ漏れないようにする。
 */
export const level03: LevelData = {
  id: 3,
  name: '溶岩からヒーローを守れ',
  world: { width: 720, height: 1280, gravity: 1 },
  goal: { type: 'collectGems', count: 3 },
  hint: '溶岩のピンは罠！ヒーローに溶岩を当てないように',
  entities: [
    // 中央の高い仕切り（溶岩プールより上から下まで＝左右を完全分離）
    { type: 'wall', x: 380, y: 730, w: 20, h: 900 },
    // 外壁
    { type: 'wall', x: 80, y: 800, w: 20, h: 800 },
    { type: 'wall', x: 645, y: 800, w: 20, h: 800 },

    // 左: 宝石 → 真下のゴール（ピン右端は仕切り左端に接する）
    { type: 'gem', x: 235, y: 360, count: 3, spread: 48 },
    { type: 'pin', x: 245, y: 430, w: 250 },
    { type: 'goalZone', x: 230, y: 1175, w: 280, h: 100 },

    // 右: 溶岩（罠ピン）→ ヒーローへ（ピン左端は仕切り右端に接する）
    { type: 'lava', x: 512, y: 330, volume: 36 },
    { type: 'pin', x: 512, y: 400, w: 244 },
    { type: 'hero', x: 512, y: 1120 },
  ],
};
