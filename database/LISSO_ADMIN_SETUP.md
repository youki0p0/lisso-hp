# SHISHA LISSO 管理者ページ セットアップ手順

管理者ページ（`/admin`）は Supabase をバックエンドに使います。下記をSupabaseのダッシュボードでX1回だけ行えば利用開始できます。

対象プロジェクト: `https://ykynfdrmtskmyvrrrwux.supabase.co`

---

## 1. テーブル作成（SQL）

1. Supabase ダッシュボード → 左メニュー **SQL Editor** を開く
2. [`database/lisso_admin_schema.sql`](./lisso_admin_schema.sql) の中身を全部貼り付けて **Run**
3. テーブル `lisso_profiles` などが作成され、初期データ（曜日既定の営業時間・7月の定休日=水曜・サンプルメニュー）が入ります

> 既存の他テーブルには影響しません（すべて `lisso_` 接頭辞 + RLS で分離）。

---

## 2. アカウント作成（2名）

ダッシュボード → **Authentication → Users → Add user** で2人作成します。
それぞれ **「Auto Confirm User」をオン**にしてください（オンにしないとログインできません）。

| 表示名 | 役割 | 例: メール | パスワード |
|--------|------|-----------|-----------|
| ゆうき | 管理者(admin) | 任意（例: youki2227@gmail.com） | 任意 |
| さおとめ | 一般(staff) | 任意（例: saotome@shisha-lisso.jp） | 任意 |

作成後、**SQL Editor** で下記を実行して名前と役割を設定します
（メールアドレスは上で作成したものに置き換えてください）。

```sql
-- ゆうき = 管理者
update public.lisso_profiles
set name = 'ゆうき', role = 'admin'
where id = (select id from auth.users where email = 'ここにゆうきのメール');

-- さおとめ = 一般（時給は任意。あとで本人が画面から変更可）
update public.lisso_profiles
set name = 'さおとめ', role = 'staff', hourly_wage = 1200
where id = (select id from auth.users where email = 'ここにさおとめのメール');
```

> ユーザー作成時にトリガーが自動で `lisso_profiles` 行を作るので、上のSQLは
> その行の名前・役割・時給を上書きするだけです。

---

## 3. ログイン

`https://<デプロイ先>/admin`（ローカルは `http://localhost:3000/admin`）を開き、
作成したメール／パスワードでログインします。

---

## 役割と権限

| 機能 | ゆうき（管理者） | さおとめ（一般） |
|------|:--:|:--:|
| 営業カレンダーの設定（定休日・個別上書き） | ✅ | 閲覧のみ |
| 料金メニューの編集 | ✅ | 閲覧のみ |
| カレンダー／メニューの PDF 印刷 | ✅ | ✅ |
| 自分のタイムカード入力・時給設定 | ✅ | ✅ |
| 全員のタイムカード閲覧 | ✅ | ✕（自分のみ） |

## カレンダーの自動ルール

- **祝日**: 日本の祝日（[holidays-jp](https://holidays-jp.github.io/) API）を自動取得し、日付を赤表示（営業状態は変えません）
- **定休日**: 月ごとに曜日で設定（例: 7月=水曜）。該当日はセルを暗く表示
- **毎月1日**: 自動で「店休日」（セルを暗く）
- **個別上書き**: 日付セルをクリックして、開店日/店休日・担当（ゆうき/さおとめ）・開店〜閉店（30分単位）を設定可能。「既定に戻す」で上書きを解除

## 補足

- 接続情報（URL・公開キー）は `apps/lisso-home/lib/supabase.ts` に設定済み。
  環境変数 `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` を設定すればそちらが優先されます。
- 公開（publishable）キーはクライアントに露出して問題ないキーです。データ保護は RLS で行っています。
