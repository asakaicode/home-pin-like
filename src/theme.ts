/** ゲーム共通のカラーパレット（数値はPhaser用の0xRRGGBB、文字列はテキスト用）。 */
export const COLORS = {
  bg: 0x1a1626,
  pin: 0xc99a4e,
  pinStroke: 0x6e4a13,
  pinCap: 0xf2c14e,
  gem: 0x4dd2ff,
  gemStroke: 0x1a6e8e,
  wall: 0x5b3d28,
  wallStroke: 0x3a2618,
  // 本家風の家・背景
  exterior: 0x6b4a8a,
  exteriorDark: 0x4e3568,
  roof: 0x7a4a2a,
  roofDark: 0x5c3720,
  houseWall: 0x6b4630,
  houseInterior: 0x3a2820,
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

/** 宝石（お宝）の色バリエーション。宝の山のように色とりどりにする。 */
export const TREASURE_COLORS = [0xffd34d, 0x9b6bff, 0x4dd2ff, 0x53e08a, 0xff6b8a, 0xffa64d];
