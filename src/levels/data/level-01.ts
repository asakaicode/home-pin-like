import type { LevelData } from '../levelSchema';

/** Lv.1: 最初の一歩。ピンを抜くと宝石が真下のゴールへ落ちる。 */
export const level01: LevelData = {
  id: 1,
  name: 'はじめのピン',
  world: { width: 720, height: 1280, gravity: 1 },
  goal: { type: 'collectGems', count: 4 },
  hint: 'ピンをタップして宝石を下の受け皿へ',
  entities: [
    { type: 'gem', x: 360, y: 430, count: 4, spread: 46 },
    { type: 'pin', x: 360, y: 500, w: 320 },
    // 落下を導く左右の壁
    { type: 'wall', x: 130, y: 900, w: 22, h: 620 },
    { type: 'wall', x: 590, y: 900, w: 22, h: 620 },
    { type: 'goalZone', x: 360, y: 1150, w: 420, h: 130 },
  ],
};
