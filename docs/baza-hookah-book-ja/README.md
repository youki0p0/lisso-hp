# БАЗА — シーシャ（水たばこ）についての本 ｜ 日本語全訳

パーヴェル・サヴィノフ（Павел Савинов）著の専門書
**『БАЗА. КНИГА ПРО КАЛЬЯНЫ』**（БАЗА ＝「ベース／基礎」、シーシャに関する本）の
ロシア語原文を、専門用語を判断したうえで日本語へ全文翻訳したものです。

ロシアのシーシャ業界のオープンな知識ベースとして、独立した参照資料として保存することを目的としています。

## この翻訳について

- **底本**: ロシア語版『БАЗА』（OCR取り込みテキスト、全9章・約51,000語）
- **方針**: 要約・省略をせず、原文を完全かつ忠実に翻訳。専門用語は[用語集](用語集-glossary.md)に従い統一。
- **OCRノイズの扱い**: 単独のページ番号・柱（ランニングヘッダー）・判読不能な文字化け断片は、本文ではないため訳出していません。意味のある文・見出し・固有名詞はすべて訳出しています。
- **注記**: 原文の判読が困難な箇所には `[原文ママ: …]` の注記を付している場合があります。
- **図版**: 原書から抽出した図版76枚を [`figures/`](figures/) に収録し、各章の本文中の対応位置（原書の該当ページ）に挿入しています。ファイル名は元書籍の印刷ページ番号（例 `figures/p063.jpg` ＝ 原書63ページ）。各図には日本語キャプションを付しています。

> 本書はシーシャという嗜好品（喫煙関連製品）を扱う業界専門書です。内容は原著の記述の忠実な翻訳であり、喫煙を推奨するものではありません。

## Web版（ブラウザで通読）

本書を1冊の本としてブラウザで読める静的リーダーを用意しています。表紙・目次・章ナビゲーション（前/次）・図版表示・モバイル対応を備えています。

- ソース: [`apps/lisso-home/public/baza/`](../../apps/lisso-home/public/baza/)（`index.html` を起点に各章HTML＋`style.css`＋`figures/`）
- 公開パス（デプロイ時）: サイトの **`/baza/`**（例: `https://<デプロイ先>/baza/`）
- ローカル確認: `apps/lisso-home/public/baza/index.html` をブラウザで開く
- 再生成: マークダウンを更新したら `pip install markdown && python scripts/build_baza_reader.py`（章別MD → 静的HTML。図版も `public/baza/figures/` へコピーされます）

## 目次

| 章 | ファイル | 内容 |
|----|----------|------|
| — | [00-introduction.md](00-introduction.md) | 序章・目次・はじめに（ВВЕДЕНИЕ） |
| 1 | [01-history-and-etiquette.md](01-history-and-etiquette.md) | シーシャの歴史とエチケット |
| 2 | [02-tobacco-raw-materials.md](02-tobacco-raw-materials.md) | シーシャ用タバコの原料と成分（バージニア・バーレー・ニコチン・タバコの製造） |
| 3 | [03-modern-hookahs.md](03-modern-hookahs.md) | 現代のシーシャ。その進化。 |
| 4 | [04-bowls.md](04-bowls.md) | シーシャ用ボウル |
| 5 | [05-charcoal.md](05-charcoal.md) | シーシャ用の炭 |
| 6 | [06-mixology.md](06-mixology.md) | ミクソロジーとは何か |
| 7 | [07-service-and-sales.md](07-service-and-sales.md) | サービス・接客・オーダーテイク・販売 |
| 8 | [08-masters-and-owners.md](08-masters-and-owners.md) | シーシャマスターとシーシャラウンジのオーナー |
| 9 | [09-marketing-research.md](09-marketing-research.md) | マーケティング調査「私たちは何者か」 |

- 全章を1ファイルにまとめたもの: [BAZA-full-ja.md](BAZA-full-ja.md)
- 翻訳ガイド・専門用語統一表: [用語集-glossary.md](用語集-glossary.md)

## 原典情報

- 著者: パーヴェル・サヴィノフ（Павел Савинов）／テレグラムチャンネル「Savinov Says」
- 関連サイト: waterpipe.pro
