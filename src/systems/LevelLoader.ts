import Phaser from 'phaser';
import type { LevelData } from '../levels/levelSchema';
import { Pin } from '../objects/Pin';
import { Gem } from '../objects/Gem';
import { Wall } from '../objects/Wall';
import { GoalZone } from '../objects/GoalZone';
import { HazardZone } from '../objects/HazardZone';
import { Hero } from '../objects/Hero';
import type { LiquidSystem } from './LiquidSystem';

export interface LoadedLevel {
  gems: Gem[];
  pins: Pin[];
}

/** レベルデータからシーンへ全エンティティを生成する。 */
export function loadLevel(scene: Phaser.Scene, level: LevelData, liquid: LiquidSystem): LoadedLevel {
  const gems: Gem[] = [];
  const pins: Pin[] = [];

  for (const e of level.entities) {
    switch (e.type) {
      case 'wall':
        new Wall(scene, e.x, e.y, e.w, e.h, e.angle ?? 0);
        break;
      case 'pin':
        pins.push(new Pin(scene, e.x, e.y, { width: e.w, height: e.h, angle: e.angle }));
        break;
      case 'gem': {
        const count = e.count ?? 1;
        const spread = e.spread ?? 44;
        const r = e.r ?? 18;
        const startX = e.x - ((count - 1) * spread) / 2;
        for (let i = 0; i < count; i++) {
          gems.push(new Gem(scene, startX + i * spread, e.y, r));
        }
        break;
      }
      case 'goalZone':
        new GoalZone(scene, e.x, e.y, e.w, e.h);
        break;
      case 'hazardZone':
        new HazardZone(scene, e.x, e.y, e.w, e.h);
        break;
      case 'lava':
        liquid.spawnPool(e.x, e.y, 'lava', e.volume ?? 40);
        break;
      case 'water':
        liquid.spawnPool(e.x, e.y, 'water', e.volume ?? 40);
        break;
      case 'hero':
        new Hero(scene, e.x, e.y);
        break;
    }
  }

  return { gems, pins };
}
