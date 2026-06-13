import { SaveManager } from '../state/SaveManager';

/**
 * 効果音。素材は使わず Web Audio で手続き的に生成する軽量SFX。
 * 設定がOFFのときは鳴らさない。AudioContext は初回操作で起動/再開する。
 */
export class Sfx {
  private static ctx: AudioContext | null = null;

  private static get context(): AudioContext {
    if (!this.ctx) this.ctx = new AudioContext();
    if (this.ctx.state === 'suspended') void this.ctx.resume();
    return this.ctx;
  }

  private static tone(
    freq: number,
    dur: number,
    type: OscillatorType,
    gain: number,
    slideTo?: number,
  ): void {
    if (!SaveManager.soundOn) return;
    const ctx = this.context;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const amp = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (slideTo) osc.frequency.linearRampToValueAtTime(slideTo, now + dur);
    amp.gain.setValueAtTime(gain, now);
    amp.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    osc.connect(amp);
    amp.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + dur);
  }

  static click(): void {
    this.tone(520, 0.05, 'square', 0.08);
  }
  static pin(): void {
    this.tone(320, 0.12, 'square', 0.12, 200);
  }
  static collect(): void {
    this.tone(880, 0.12, 'sine', 0.16, 1250);
  }
  static coin(): void {
    this.tone(1100, 0.07, 'square', 0.1, 1500);
  }
  static lose(): void {
    this.tone(320, 0.45, 'sawtooth', 0.16, 70);
  }
  static win(): void {
    [523, 659, 784, 1047].forEach((f, i) => {
      window.setTimeout(() => this.tone(f, 0.18, 'triangle', 0.15), i * 110);
    });
  }
}
