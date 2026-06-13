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

/** 共通のボタン（矩形＋テキストのコンテナ）。クリック音とホバー拡大付き。 */
export function makeButton(
  scene: Phaser.Scene,
  x: number,
  y: number,
  label: string,
  opts: ButtonOptions,
): Phaser.GameObjects.Container {
  const w = opts.width ?? 320;
  const h = opts.height ?? 64;
  const color = opts.color ?? 0x3a3350;

  const bg = scene.add.rectangle(0, 0, w, h, color).setStrokeStyle(2, 0xffffff, 0.2);
  const text = scene.add
    .text(0, 0, label, {
      fontFamily: 'sans-serif',
      fontSize: opts.fontSize ?? '26px',
      color: opts.textColor ?? '#ffffff',
    })
    .setOrigin(0.5);

  const container = scene.add.container(x, y, [bg, text]);
  container.setSize(w, h);
  container.setInteractive(
    new Phaser.Geom.Rectangle(-w / 2, -h / 2, w, h),
    Phaser.Geom.Rectangle.Contains,
  );
  container.on(Phaser.Input.Events.POINTER_DOWN, () => {
    Sfx.click();
    opts.onClick();
  });
  container.on(Phaser.Input.Events.POINTER_OVER, () => container.setScale(1.04));
  container.on(Phaser.Input.Events.POINTER_OUT, () => container.setScale(1));
  return container;
}

/** ボタンのラベル文字列を更新する（list[1] がテキスト）。 */
export function setButtonLabel(button: Phaser.GameObjects.Container, label: string): void {
  const text = button.list[1] as Phaser.GameObjects.Text | undefined;
  text?.setText(label);
}
