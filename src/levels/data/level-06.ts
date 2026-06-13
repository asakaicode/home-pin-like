import type { LevelData } from '../levelSchema';

/** Lv.6: ふたつのたから。左右両方のピンを抜いて、6個すべてを中央のゴールへ。 */
export const level06: LevelData = {
  id: 6,
  name: 'ふたつのたから',
  world: { width: 720, height: 1280, gravity: 1 },
  goal: { type: 'collectGems', count: 6 },
  hint: '両方のピンを抜いて全部集めよう',
  entities: [
    { type: 'gem', x: 230, y: 300, count: 3, spread: 44 },
    { type: 'pin', x: 230, y: 370, w: 240 },
    { type: 'gem', x: 490, y: 300, count: 3, spread: 44 },
    { type: 'pin', x: 490, y: 370, w: 240 },

    // 上部だけ仕切る縦壁（下はゴールを共有）
    { type: 'wall', x: 360, y: 560, w: 20, h: 380 },
    { type: 'wall', x: 90, y: 720, w: 20, h: 800 },
    { type: 'wall', x: 630, y: 720, w: 20, h: 800 },
    { type: 'goalZone', x: 360, y: 1175, w: 480, h: 110 },
  ],
};
