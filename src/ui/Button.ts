import Phaser from 'phaser';
import { Sfx } from '../audio/Sfx';

export interface ButtonOptions {
  width?: number;
  height?: number;
  color?: number;
  fontSize?: string;
  textColor?: string;
  onClick: () => void;
}

export interface Button {
  bg: Phaser.GameObjects.Rectangle;
  text: Phaser.GameObjects.Text;
  setLabel(label: string): void;
  disable(): void;
}

/**
 * 共通ボタン。
 * 背景の矩形そのものを当たり判定にすることで、ボタン全面で確実に反応する
 * （コンテナにヒット領域を設定する方式だと中央付近しか反応しないことがあるため避ける）。
 * クリック音とホバー拡大つき。
 */
export function makeButton(
  scene: Phaser.Scene,
  x: number,
  y: number,
  label: string,
  opts: ButtonOptions,
): Button {
  const w = opts.width ?? 320;
  const h = opts.height ?? 64;
  const color = opts.color ?? 0x3a3350;

  const bg = scene.add.rectangle(x, y, w, h, color).setStrokeStyle(2, 0xffffff, 0.2);
  const text = scene.add
    .text(x, y, label, {
      fontFamily: 'sans-serif',
      fontSize: opts.fontSize ?? '26px',
      color: opts.textColor ?? '#ffffff',
    })
    .setOrigin(0.5);

  let enabled = true;

  // 矩形(Rectangle)は既定で全面が当たり判定になる
  bg.setInteractive({ useHandCursor: true });
  bg.on(Phaser.Input.Events.POINTER_DOWN, () => {
    if (!enabled) return;
    Sfx.click();
    opts.onClick();
  });
  bg.on(Phaser.Input.Events.POINTER_OVER, () => {
    if (!enabled) return;
    bg.setScale(1.04);
    text.setScale(1.04);
  });
  bg.on(Phaser.Input.Events.POINTER_OUT, () => {
    bg.setScale(1);
    text.setScale(1);
  });

  return {
    bg,
    text,
    setLabel: (next: string) => text.setText(next),
    disable: () => {
      enabled = false;
      bg.disableInteractive();
      bg.setAlpha(0.5);
      text.setAlpha(0.5);
    },
  };
}
