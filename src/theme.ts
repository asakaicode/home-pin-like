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
  panel: 0x241f33,
  // テキスト用（CSS文字列）
  textLight: '#ffffff',
  textDim: '#c8c0e0',
  accent: '#ffd34d',
  success: '#53e08a',
  danger: '#ff5a4d',
} as const;
