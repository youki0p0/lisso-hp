# SHISHA LISSO 管理者ページ セットアップ手順

管理者ページ（`/admin`）は Supabase をバックエンドに使います。
ログインは **メールにログインリンクを送るだけ（パスワード不要のマジックリンク）** です。
事前のユーザー作成は不要で、リンクを開くと自動でアカウント（`profiles` 行）が作成されます。

対象プロジェクト: `https://ykynfdrmtskmyvrrrwux.supabase.co`

---

## 1. テーブル作成（SQL）

Supabase ダッシュボード → **SQL Editor** で
[`database/lisso_admin_schema.sql`](./lisso_admin_schema.sql) を貼り付けて **Run**。

`lisso_` 接頭辞のテーブル・RLS・管理者用関数・初期データが作成されます。
既存の `profiles` 等には手を加えません（参照のみ）。

---

## 2. ログイン用URLの許可（1回だけ）

ダッシュボード → **Authentication → URL Configuration**:

- **Site URL**: `https://lisso-hp.vercel.app`
- **Redirect URLs** に追加: `https://lisso-hp.vercel.app/admin`
  （ローカルでも使う場合は `http://localhost:3000/admin` も追加）

> メールのログインリンクから戻る先を許可するための設定です。
> また **Authentication → Providers → Email** が有効（既定でON）であることをご確認ください。

---

## 3. ログイン

1. `https://lisso-hp.vercel.app/admin` を開く
2. メールアドレスを入力 →「ログインリンクを送信」
3. 届いたメールの「ログイン」リンクを開く → 自動で `/admin` に戻りログイン完了

初回ログイン時に `profiles` 行が自動作成されます（役割は既定で `user`）。

---

## 4. 最初の管理者を設定（SQLで1回だけ）

ゆうきが一度ログインしたあと、**SQL Editor** で管理者に昇格します（メールは実際のものに置換）。

```sql
update public.profiles set role = 'admin', display_name = 'ゆうき'
where id = (select id from auth.users where email = 'youki2227@gmail.com');
```

これ以降は、`/admin` の **「ユーザー管理」タブ**から画面操作で役割を割り当てできます:

- 既存ユーザーの区分（User / Staff / Admin）を変更
- まだログインしていないメールアドレスにも役割を事前紐付け（次回ログイン時に自動適用）

さおとめ（Staff）の時給は、本人がログイン後に「タイムカード」画面で設定できます
（管理者が「ユーザー管理」や SQL で設定することも可能）。

---

## 役割と権限（User / Staff / Admin）

| 機能 | Admin | Staff | User |
|------|:--:|:--:|:--:|
| 営業カレンダーの設定（定休日・個別上書き） | ✅ | 閲覧 | 閲覧 |
| 料金メニューの編集 | ✅ | 閲覧 | 閲覧 |
| カレンダー／メニューの PDF 印刷 | ✅ | ✅ | ✅ |
| 自分のタイムカード入力・時給設定 | ✅ | ✅ | ✕ |
| 全員のタイムカード閲覧 | ✅ | ✕（自分のみ） | ✕ |
| ユーザー管理（役割の割当） | ✅ | ✕ | ✕ |

## カレンダーの自動ルール

- **祝日**: 日本の祝日（[holidays-jp](https://holidays-jp.github.io/) API）を自動取得し日付を赤表示（営業状態は変えません）
- **定休日**: 月ごとに曜日で設定（例: 7月=水曜）。該当日はセルを暗く
- **毎月1日**: 自動で「店休日」（セルを暗く）
- **個別上書き**: 日付セルをクリックして、開店日/店休日・担当（ゆうき/さおとめ）・開店〜閉店（30分単位）を設定可能

## 補足

- 接続情報（URL・公開キー）は `apps/lisso-home/lib/supabase.ts` に設定済み。
  環境変数 `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` があればそちらを優先。
- パスワードでログインしたい場合は、ログイン画面の「パスワードでログイン」から切替できます
  （その場合は別途パスワード設定が必要）。
