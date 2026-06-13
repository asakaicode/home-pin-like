import Phaser from 'phaser';

/**
 * 起動シーン。?level=N が付いていれば開発/ディープリンクとして直接ゲームへ、
 * そうでなければメニューへ。
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  create(): void {
    const hasLevelParam = new URLSearchParams(window.location.search).has('level');
    this.scene.start(hasLevelParam ? 'Game' : 'Menu');
  }
}
