import './ads.css';

/**
 * モック広告マネージャ（DOMオーバーレイ）。
 * 実際の広告ネットワークには一切接続しない。「広告付き」体験の再現用。
 * ?noads=1 で無効化できる（開発/デモ用）。
 */

interface Creative {
  icon: string;
  title: string;
  sub: string;
  cta: string;
  bg: string;
}

// 自作のダミー広告クリエイティブ（実在ブランドは使わない）
const CREATIVES: Creative[] = [
  { icon: '🧩', title: 'パズル王国', sub: '今すぐ無料で頭脳バトル！', cta: 'インストール', bg: 'linear-gradient(135deg,#7b2ff7,#f107a3)' },
  { icon: '⚔️', title: 'ドラゴンサーガ', sub: '伝説の冒険が、いま始まる', cta: 'プレイ', bg: 'linear-gradient(135deg,#11998e,#38ef7d)' },
  { icon: '🏰', title: '王国ビルダー', sub: 'あなただけの王国を築こう', cta: 'インストール', bg: 'linear-gradient(135deg,#f12711,#f5af19)' },
  { icon: '🐾', title: 'もふもふ牧場', sub: 'かわいい動物を育てよう', cta: 'ダウンロード', bg: 'linear-gradient(135deg,#2193b0,#6dd5ed)' },
  { icon: '🍬', title: 'スイーツマッチ3', sub: '甘いパズルにハマる！', cta: 'インストール', bg: 'linear-gradient(135deg,#ee0979,#ff6a00)' },
];

let creativeIdx = 0;
function nextCreative(): Creative {
  const c = CREATIVES[creativeIdx % CREATIVES.length];
  creativeIdx += 1;
  return c;
}

export class AdManager {
  static get enabled(): boolean {
    return !new URLSearchParams(window.location.search).has('noads');
  }

  /** 下部の常設バナーを設置し、一定間隔でクリエイティブを差し替える。 */
  static mountBanner(): void {
    const el = document.getElementById('ad-banner');
    if (!el) return;
    if (!this.enabled) {
      el.style.display = 'none';
      return;
    }
    this.refreshBanner(el);
    window.setInterval(() => this.refreshBanner(el), 8000);
  }

  private static refreshBanner(el: HTMLElement): void {
    const c = nextCreative();
    el.innerHTML = `
      <span class="ad-tag">広告</span>
      <div class="ad-banner-icon" style="background:${c.bg}">${c.icon}</div>
      <div class="ad-banner-body">
        <div class="ad-banner-title">${c.title}</div>
        <div class="ad-banner-sub">${c.sub}</div>
      </div>
      <button class="ad-banner-cta" type="button">${c.cta}</button>
    `;
  }

  /** 全画面インタースティシャル。閉じると onDone を呼ぶ。無効時は即 onDone。 */
  static showInterstitial(onDone: () => void): void {
    if (!this.enabled) {
      onDone();
      return;
    }
    const c = nextCreative();
    const overlay = document.createElement('div');
    overlay.className = 'ad-overlay';
    overlay.innerHTML = `
      <div class="ad-top">
        <span class="ad-tag">広告</span>
        <button class="ad-close" type="button" disabled>×</button>
      </div>
      <div class="ad-card" style="background:${c.bg}">
        <div class="ad-card-icon">${c.icon}</div>
        <div class="ad-card-title">${c.title}</div>
        <div class="ad-card-stars">★★★★★ <span>4.7</span></div>
        <div class="ad-card-sub">${c.sub}</div>
        <button class="ad-cta" type="button">${c.cta}</button>
      </div>
    `;
    document.body.appendChild(overlay);

    const closeBtn = overlay.querySelector('.ad-close') as HTMLButtonElement;
    let remain = 5;
    closeBtn.textContent = `× ${remain}`;
    const timer = window.setInterval(() => {
      remain -= 1;
      if (remain <= 0) {
        window.clearInterval(timer);
        closeBtn.disabled = false;
        closeBtn.textContent = '×';
      } else {
        closeBtn.textContent = `× ${remain}`;
      }
    }, 1000);

    const close = () => {
      window.clearInterval(timer);
      overlay.remove();
      onDone();
    };
    closeBtn.addEventListener('click', () => {
      if (!closeBtn.disabled) close();
    });
  }

  /**
   * 動画リワード広告。視聴完了後の報酬ボタンで onReward、途中閉じで onCancel。
   * 無効時は即 onReward（報酬付与）。
   */
  static showRewarded(opts: { label: string; onReward: () => void; onCancel?: () => void }): void {
    if (!this.enabled) {
      opts.onReward();
      return;
    }
    const c = nextCreative();
    const overlay = document.createElement('div');
    overlay.className = 'ad-overlay';
    overlay.innerHTML = `
      <div class="ad-top">
        <span class="ad-tag">動画広告</span>
        <button class="ad-close" type="button" disabled>×</button>
      </div>
      <div class="ad-video" style="background:${c.bg}">
        <div class="ad-card-icon">${c.icon}</div>
        <div class="ad-card-title">${c.title}</div>
        <div class="ad-reward-note">最後まで見ると「${opts.label}」</div>
        <div class="ad-progress"><div class="ad-progress-bar"></div></div>
      </div>
      <button class="ad-reward-btn" type="button" disabled>🎁 ${opts.label}</button>
    `;
    document.body.appendChild(overlay);

    const bar = overlay.querySelector('.ad-progress-bar') as HTMLElement;
    const rewardBtn = overlay.querySelector('.ad-reward-btn') as HTMLButtonElement;
    const closeBtn = overlay.querySelector('.ad-close') as HTMLButtonElement;

    // 進捗バーをアニメーション（CSSトランジション）
    window.requestAnimationFrame(() => {
      bar.style.width = '100%';
    });
    const doneTimer = window.setTimeout(() => {
      rewardBtn.disabled = false;
      closeBtn.disabled = false;
      closeBtn.textContent = '×';
    }, 4200);

    const cleanup = () => {
      window.clearTimeout(doneTimer);
      overlay.remove();
    };
    rewardBtn.addEventListener('click', () => {
      if (!rewardBtn.disabled) {
        cleanup();
        opts.onReward();
      }
    });
    closeBtn.addEventListener('click', () => {
      if (!closeBtn.disabled) {
        cleanup();
        opts.onCancel?.();
      }
    });
  }
}
