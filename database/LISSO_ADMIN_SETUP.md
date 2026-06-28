# SHISHA LISSO 管理者ページ セットアップ手順

管理者ページ（`/admin`）は Supabase をバックエンドに使います。
**既存の ShishaOS マイグレーション（`public.profiles` / role = user|curator|admin /
新規ユーザー自動作成トリガー）が適用済みのプロジェクトをそのまま流用**します。

対象プロジェクト: `https://ykynfdrmtskmyvrrrwux.supabase.co`

---

## 1. 追加テーブルの作成（SQL）

1. Supabase ダッシュボード → **SQL Editor**
2. [`database/lisso_admin_schema.sql`](./lisso_admin_schema.sql) を貼り付けて **Run**

これで `lisso_` 接頭辞のテーブル（時給・曜日既定・月設定・個別上書き・メニュー・タイムカード）と
RLS・管理者判定関数 `lisso_is_admin()`・初期データが作成されます。
**既存の `profiles` などには手を加えません**（参照するだけ）。

---

## 2. アカウントと役割

アカウントは既存の認証フロー（サインアップ）または **Authentication → Users → Add user**
（**Auto Confirm User** をオン）で用意します。`profiles` 行はトリガーで自動作成されます。

作成後、**SQL Editor** で役割と時給を設定します（メールは実際のものに置換）。

```sql
-- ゆうき = 管理者
update public.profiles set role = 'admin', display_name = 'ゆうき'
where id = (select id from auth.users where email = 'ゆうきのメール');

-- さおとめ = 一般
update public.profiles set role = 'user', display_name = 'さおとめ'
where id = (select id from auth.users where email = 'さおとめのメール');

-- さおとめ の時給（本人が画面からも変更可）
insert into public.lisso_staff_wage (profile_id, hourly_wage)
select id, 1200 from auth.users where email = 'さおとめのメール'
on conflict (profile_id) do update set hourly_wage = excluded.hourly_wage;
```

> `role = 'admin'` のユーザーが管理者（全設定可）。それ以外（user / curator）は一般です。

---

## 3. ログイン

`https://<デプロイ先>/admin`（ローカルは `http://localhost:3000/admin`）を開き、
メール／パスワードでログインします。

---

## 役割と権限（User / Staff / Admin の3段階）

| 機能 | Admin | Staff | User |
|------|:--:|:--:|:--:|
| 営業カレンダーの設定（定休日・個別上書き） | ✅ | 閲覧 | 閲覧 |
| 料金メニューの編集 | ✅ | 閲覧 | 閲覧 |
| カレンダー／メニューの PDF 印刷 | ✅ | ✅ | ✅ |
| 自分のタイムカード入力・時給設定 | ✅ | ✅ | ✕ |
| 全員のタイムカード閲覧 | ✅ | ✕（自分のみ） | ✕ |
| ユーザー管理（役割の割当） | ✅ | ✕ | ✕ |

> 例: ゆうき=**Admin**、さおとめ=**Staff**。`role='admin'` が管理者です。

## ユーザー管理（あとから役割を割り当て）

ログイン後、Admin には **「ユーザー管理」タブ**が表示されます。ここで:

- 既存ユーザーの一覧（**メールアドレス**・表示名・区分）を表示し、区分を **User / Staff / Admin** から選んで変更できます。
- **メールアドレスに役割を事前紐付け**できます（まだ登録していないメールでも可。次回そのメールでログインしたとき自動で役割が反映されます）。

そのため、初回に手で `update profiles ...` を実行しなくても、最初の Admin を1人だけ SQL で設定すれば、あとは画面から割り当てできます。

## カレンダーの自動ルール

- **祝日**: 日本の祝日（[holidays-jp](https://holidays-jp.github.io/) API）を自動取得し、日付を赤表示（営業状態は変えません）
- **定休日**: 月ごとに曜日で設定（例: 7月=水曜）。該当日はセルを暗く
- **毎月1日**: 自動で「店休日」（セルを暗く）
- **個別上書き**: 日付セルをクリックして、開店日/店休日・担当（ゆうき/さおとめ）・開店〜閉店（30分単位）を設定可能。「既定に戻す」で解除

## 補足

- 接続情報（URL・公開キー）は `apps/lisso-home/lib/supabase.ts` に設定済み。
  環境変数 `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` があればそちらを優先。
- 公開（publishable）キーはクライアントに露出して問題ないキーです。保護は RLS で行います。
