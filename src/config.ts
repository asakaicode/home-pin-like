/** ゲーム全体の基本定数。レベルデータの座標はこのワールド寸法を基準にする。 */
export const GAME_WIDTH = 720;
export const GAME_HEIGHT = 1280;

/** 背景色（メニュー/ゲーム共通のベース）。 */
export const BG_COLOR = '#1a1626';

/** Matter 物理のデフォルト設定。 */
export const PHYSICS = {
  /** 下向き重力の強さ。 */
  gravityY: 1,
  /** ワイヤーフレームのデバッグ表示。実物の見た目を確認するため通常はfalse。 */
  debug: false,
} as const;
