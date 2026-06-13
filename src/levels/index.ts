import type { LevelData } from './levelSchema';
import { level01 } from './data/level-01';
import { level02 } from './data/level-02';
import { level03 } from './data/level-03';
import { level04 } from './data/level-04';

/** プレイ順のレベル一覧。 */
export const LEVELS: LevelData[] = [level01, level02, level03, level04];
