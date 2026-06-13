import type { LevelData } from '../levelSchema';

/**
 * Lv.2: わなを避けて。
 * 正解: 傾いた台(下のピン)を先に抜いてから上のピンを抜く → 宝石は真下のゴールへ。
 * 失敗: 上のピンを先に抜くと、宝石が傾いた台に落ちて左へ転がり、危険地帯へ。
 */
export const level02: LevelData = {
  id: 2,
  name: 'わなを避けて',
  world: { width: 720, height: 1280, gravity: 1 },
  goal: { type: 'collectGems', count: 4 },
  hint: '落とす順番に注意。傾いた台は先に外そう',
  entities: [
    { type: 'gem', x: 400, y: 470, count: 4, spread: 44 },
    // 上のピン: 宝石を保持
    { type: 'pin', x: 400, y: 540, w: 300 },
    // 下のピン: 左へ傾いた「わなの台」（先に外すのが正解）
    { type: 'pin', x: 400, y: 770, w: 360, angle: -14 },
    // 中央の仕切り（ゴールと危険地帯を分ける）
    { type: 'wall', x: 285, y: 1110, w: 20, h: 240 },
    // 右: ゴール / 左: 危険地帯
    { type: 'goalZone', x: 430, y: 1185, w: 250, h: 120 },
    { type: 'hazardZone', x: 150, y: 1185, w: 230, h: 120 },
  ],
};
