/** ゲーム共通のカラーパレット（数値はPhaser用の0xRRGGBB、文字列はテキスト用）。 */
export const COLORS = {
  bg: 0x1a1626,
  pin: 0xffd34d,
  pinStroke: 0x7a5b00,
  gem: 0x4dd2ff,
  gemStroke: 0x1a6e8e,
  wall: 0x4a4366,
  wallStroke: 0x2a2540,
  goal: 0x53e08a,
  hazard: 0xff5a4d,
  // 液体・岩
  lava: 0xff7a2d,
  water: 0x2f6fe0,
  rock: 0x6b6b7a,
  rockStroke: 0x3f3f4a,
  // ヒーロー
  hero: 0xffe08a,
  heroStroke: 0xb38b2f,
  // UI
  panel: 0x241f33,
  textLight: '#ffffff',
  textDim: '#c8c0e0',
  accent: '#ffd34d',
  success: '#53e08a',
  danger: '#ff5a4d',
} as const;
