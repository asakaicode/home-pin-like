# Home Pin Like 🧩

ピン抜きパズル（いわゆる *Pull the Pin* 系）を **Web アプリ**として再現した、広告付き体験つきのブラウザゲームです。ピンを正しい順番で抜き、重力と液体（溶岩・水）の挙動を読んで宝石をゴールへ運びます。

> ⚠️ これはゲームの**メカニクスのクローン（学習・再現目的）**です。実在ブランドの画像・音声・商標は使用せず、アートはすべてオリジナルのプレースホルダ、広告は実ネットワークに接続しないモックです。

## 遊び方

- **ピンをタップ／クリック**して抜く。支えを失った物体は重力で落下します。
- **宝石（青）** を **ゴール（緑の枠）** に全部入れるとクリア。
- **溶岩（オレンジ）** はヒーローや宝石に触れると失敗。**水（青）** を当てると **岩** に変わって無害化できます。
- 抜く順番がカギ。失敗したらリトライ。

## 技術スタック

- [Phaser 4](https://phaser.io/)（Matter.js 物理）/ TypeScript / [Vite](https://vitejs.dev/)
- 液体は粒子ベース、溶岩×水→岩を衝突判定で変換
- 効果音は Web Audio による手続き生成（素材不使用）
- 広告（バナー／インタースティシャル／リワード）は DOM オーバーレイのモック

## 開発

```bash
pnpm install
pnpm dev        # 開発サーバー (http://localhost:5173)
pnpm build      # 型チェック + 本番ビルド (dist/)
pnpm preview    # ビルド結果をプレビュー
pnpm typecheck  # 型チェックのみ
```

### 開発用URLパラメータ

- `?level=N` … N番目のレベルから開始（例: `?level=3`）
- `?noads=1` … 広告を無効化

### スモーク検証（Playwright）

```bash
node scripts/screenshot.mjs <url> <out.png> [waitMs]
node scripts/click-test.mjs <url> <out.png> "x1,y1;x2,y2" [perClickWaitMs] [initialWaitMs]
```

## デプロイ

GitHub Pages で公開しています → **https://asakaicode.github.io/home-pin-like/**

ビルド結果（`dist/`）を `gh-pages` ブランチへ公開する方式です:

```bash
pnpm build
pnpm dlx gh-pages -d dist   # dist を gh-pages ブランチへ公開
```

Vite の `base` は相対パス（`./`）なのでプロジェクトページのサブパスでも動作します。

### GitHub Actions で自動デプロイにしたい場合

`.github/deploy-workflow.example.yml` をそのまま `.github/workflows/deploy.yml` に置けば、`main` への push で自動ビルド＆公開できます（push 時に gh の認証へ `workflow` スコープが必要: `gh auth refresh -s workflow`）。

## ライセンス

MIT（コード）。アセットはオリジナル。
