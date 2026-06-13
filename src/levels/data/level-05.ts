import type { LevelData } from '../levelSchema';

/** Lv.5: すべり台。ピンを抜くと宝石が急な坂を滑り降りて右下のゴールへ。 */
export const level05: LevelData = {
  id: 5,
  name: 'すべり台',
  world: { width: 720, height: 1280, gravity: 1 },
  goal: { type: 'collectGems', count: 3 },
  hint: 'ピンを抜いて坂を滑らせよう',
  entities: [
    { type: 'gem', x: 180, y: 300, count: 3, spread: 42 },
    { type: 'pin', x: 180, y: 370, w: 230 },

    // 一本の急なすべり台
    { type: 'wall', x: 380, y: 780, w: 680, h: 26, angle: 32 },
    { type: 'wall', x: 75, y: 640, w: 20, h: 560 },

    // 右下のゴール（坂の末端＝宝石が滑り着く位置に重ねる）
    { type: 'wall', x: 685, y: 1050, w: 20, h: 340 },
    { type: 'goalZone', x: 600, y: 990, w: 260, h: 220 },
  ],
};
