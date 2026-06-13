/** 進捗・コイン・設定を localStorage に永続化する。 */
export interface SaveData {
  /** 解放済みの最大レベルインデックス（0始まり）。 */
  unlocked: number;
  coins: number;
  /** クリア済みレベルインデックスの一覧。 */
  cleared: number[];
  soundOn: boolean;
}

const KEY = 'home-pin-like-save-v1';
const DEFAULTS: SaveData = { unlocked: 0, coins: 0, cleared: [], soundOn: true };

export class SaveManager {
  private static data: SaveData = SaveManager.read();

  private static read(): SaveData {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return { ...DEFAULTS };
      return { ...DEFAULTS, ...(JSON.parse(raw) as Partial<SaveData>) };
    } catch {
      return { ...DEFAULTS };
    }
  }

  private static write(): void {
    try {
      localStorage.setItem(KEY, JSON.stringify(this.data));
    } catch {
      /* ストレージ不可でも無視 */
    }
  }

  static get coins(): number {
    return this.data.coins;
  }
  static addCoins(n: number): void {
    this.data.coins += n;
    this.write();
  }

  static get unlocked(): number {
    return this.data.unlocked;
  }
  static isUnlocked(idx: number): boolean {
    return idx <= this.data.unlocked;
  }
  static unlockUpTo(idx: number): void {
    if (idx > this.data.unlocked) {
      this.data.unlocked = idx;
      this.write();
    }
  }

  static isCleared(idx: number): boolean {
    return this.data.cleared.includes(idx);
  }
  /** クリア登録。初クリアなら true を返す。 */
  static markCleared(idx: number): boolean {
    const first = !this.data.cleared.includes(idx);
    if (first) {
      this.data.cleared.push(idx);
      this.write();
    }
    return first;
  }

  static get soundOn(): boolean {
    return this.data.soundOn;
  }
  static toggleSound(): boolean {
    this.data.soundOn = !this.data.soundOn;
    this.write();
    return this.data.soundOn;
  }
}
