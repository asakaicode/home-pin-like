/**
 * レベルデータのスキーマ（型）。
 * 座標はすべて「中心(x, y)」基準のワールド座標。yは下向きが正。
 */

export interface WorldConfig {
  width: number;
  height: number;
  /** 下向き重力の強さ。 */
  gravity: number;
}

export interface GoalConfig {
  type: 'collectGems';
  /** クリアに必要な回収数。 */
  count: number;
}

export interface WallEntity {
  type: 'wall';
  x: number;
  y: number;
  w: number;
  h: number;
  /** 度数法の傾き（任意）。 */
  angle?: number;
}

export interface PinEntity {
  type: 'pin';
  x: number;
  y: number;
  w?: number;
  h?: number;
  /** 度数法の傾き（任意）。傾いたピンは台として宝石を転がせる。 */
  angle?: number;
}

export interface GemEntity {
  type: 'gem';
  x: number;
  y: number;
  /** まとめて生成する数（既定1）。xを中心に spread 間隔で横に並ぶ。 */
  count?: number;
  spread?: number;
  /** 半径（既定18）。 */
  r?: number;
}

export interface GoalZoneEntity {
  type: 'goalZone';
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface HazardZoneEntity {
  type: 'hazardZone';
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface HeroEntity {
  type: 'hero';
  x: number;
  y: number;
}

export type EntityData =
  | WallEntity
  | PinEntity
  | GemEntity
  | GoalZoneEntity
  | HazardZoneEntity
  | HeroEntity;

export interface LevelData {
  id: number;
  name: string;
  world: WorldConfig;
  goal: GoalConfig;
  entities: EntityData[];
  hint?: string;
}
