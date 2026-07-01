# Shisha MONSTER 発注アプリ (`monster-order`)

シーシャモンスター（Shopify）向けの発注支援アプリ。ShishaOS とは独立。

## できること
1. **棚写真OCR → 在庫化** — 在庫棚を撮影 → Google Cloud Vision で文字抽出 → カタログに突き合わせて在庫登録。
2. **発注履歴の取込** — CSV/テキスト（`日付,商品名,数量`、Shopify注文エクスポート可）を取り込み、消費周期を学習。
3. **発注レコメンド → ワンタップでカート** — 在庫状況＋過去の発注周期から発注数を提案。Shopify の
   **カートパーマリンク** (`/cart/{variantId}:{qty},…`) で、**スマホ（iOS Safari 含む）でもワンタップ**でカート投入。
4. **撮影の誘導（任意）** — 発注履歴が無い場合、1週間後・2週間後に在庫を撮るよう促す（強制なし）。

## 技術
- Next.js 15 / React 19（App Router、プレーンCSS）。
- 状態は端末の `localStorage` に保存（MVP・DB不要）。将来 `lib/store.ts` を差し替えれば DB 化可能。
- OCR は `POST /api/ocr`（Google Cloud Vision、`MONSTER_OCR_API_KEY`）。
- カタログは `GET /api/catalog`（対象ストアの `/products.json` を server 側でプロキシ）。

## 環境変数（`.env.example` 参照）
- `NEXT_PUBLIC_MONSTER_SHOP_DOMAIN` — 対象Shopifyドメイン。既定 `newemoshisha.com`（公開中で検証可）。
  シーシャモンスター公開後は `shisha-monster.com` に変更。
- `MONSTER_OCR_API_KEY` — Google Cloud Vision の APIキー（サーバー側のみ）。未設定でも手入力は可能。

## 開発
```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck
npm run build
```

## メモ
- シーシャモンスターは現在パスワード保護（未公開）。カタログ/カートは公開後に有効化。機構検証は公開中の
  同一Shopify（NEWEMO）で実施済み（`/cart/{variantId}:1` → カート投入を確認）。
- カートに入れられるのは「カタログにマッチした（変数IDが付いた）」品目のみ。
