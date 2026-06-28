-- =====================================================================
--  SHISHA LISSO 店舗管理 スキーマ（接頭辞 lisso_）
--  ※ 既存の ShishaOS マイグレーション（public.profiles / role=user|curator|admin /
--     handle_new_user トリガー）が適用済みの前提。profiles はそのまま流用します。
--  Supabase の SQL Editor に貼り付けて実行してください。
-- =====================================================================

create extension if not exists pgcrypto;

-- ---- 管理者判定（既存 profiles.role = 'admin' を管理者とみなす）----
create or replace function public.lisso_is_admin()
returns boolean language sql security definer stable
set search_path = public as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

-- ---- スタッフの時給（profiles を直接変更せず別テーブルで保持）----
create table if not exists public.lisso_staff_wage (
  profile_id  uuid primary key references public.profiles(id) on delete cascade,
  hourly_wage integer not null default 0,
  updated_at  timestamptz not null default now()
);

-- ---- 曜日ごとの既定営業時間（0=日 .. 6=土）----
create table if not exists public.lisso_weekday_defaults (
  weekday    smallint primary key check (weekday between 0 and 6),
  is_open    boolean not null default true,
  open_time  text not null default '16:00',
  close_time text not null default '23:00'
);

-- ---- 月ごとの設定（定休日の曜日。例: 7月=水曜=3）----
create table if not exists public.lisso_month_settings (
  year           smallint not null,
  month          smallint not null check (month between 1 and 12),
  closed_weekday smallint check (closed_weekday between 0 and 6),
  primary key (year, month)
);

-- ---- 個別オーバーライド（特定日付の上書き）----
create table if not exists public.lisso_day_overrides (
  d          date primary key,
  status     text not null check (status in ('open','closed')),
  open_time  text,
  close_time text,
  staff_name text,
  note       text,
  updated_at timestamptz not null default now()
);

-- ---- 料金メニュー ----
create table if not exists public.lisso_menu_items (
  id         uuid primary key default gen_random_uuid(),
  category   text not null default '',
  name       text not null,
  price      integer not null default 0,
  sort_order integer not null default 0
);

-- ---- タイムカード（profiles を参照）----
create table if not exists public.lisso_timecards (
  id            uuid primary key default gen_random_uuid(),
  profile_id    uuid not null references public.profiles(id) on delete cascade,
  work_date     date not null,
  clock_in      text not null,            -- 'HH:MM'
  clock_out     text not null,            -- 'HH:MM'
  break_minutes integer not null default 0,
  note          text,
  created_at    timestamptz not null default now()
);

-- =====================================================================
--  RLS
-- =====================================================================
alter table public.lisso_staff_wage       enable row level security;
alter table public.lisso_weekday_defaults  enable row level security;
alter table public.lisso_month_settings    enable row level security;
alter table public.lisso_day_overrides     enable row level security;
alter table public.lisso_menu_items        enable row level security;
alter table public.lisso_timecards         enable row level security;

-- 時給: 本人は自分の分を参照/更新、管理者は全件
drop policy if exists lisso_wage_own   on public.lisso_staff_wage;
drop policy if exists lisso_wage_admin on public.lisso_staff_wage;
create policy lisso_wage_own   on public.lisso_staff_wage for all to authenticated
  using (profile_id = auth.uid()) with check (profile_id = auth.uid());
create policy lisso_wage_admin on public.lisso_staff_wage for all to authenticated
  using (public.lisso_is_admin()) with check (public.lisso_is_admin());

-- スケジュール/メニュー系: 認証ユーザは参照可、書き込みは管理者のみ
do $$
declare t text;
begin
  foreach t in array array['lisso_weekday_defaults','lisso_month_settings','lisso_day_overrides','lisso_menu_items']
  loop
    execute format('drop policy if exists %1$s_sel on public.%1$s;', t);
    execute format('drop policy if exists %1$s_admin on public.%1$s;', t);
    execute format('create policy %1$s_sel on public.%1$s for select to authenticated using (true);', t);
    execute format('create policy %1$s_admin on public.%1$s for all to authenticated using (public.lisso_is_admin()) with check (public.lisso_is_admin());', t);
  end loop;
end $$;

-- タイムカード: 本人は自分の分を全操作、管理者は全件
drop policy if exists lisso_tc_own   on public.lisso_timecards;
drop policy if exists lisso_tc_admin on public.lisso_timecards;
create policy lisso_tc_own   on public.lisso_timecards for all to authenticated
  using (profile_id = auth.uid()) with check (profile_id = auth.uid());
create policy lisso_tc_admin on public.lisso_timecards for all to authenticated
  using (public.lisso_is_admin()) with check (public.lisso_is_admin());

-- =====================================================================
--  初期データ
-- =====================================================================
-- 曜日既定（参考カレンダー: 月〜金 16:00-23:00 / 土 13:00-21:00 / 日 13:00-23:00）
insert into public.lisso_weekday_defaults (weekday, is_open, open_time, close_time) values
  (0, true, '13:00', '23:00'),
  (1, true, '16:00', '23:00'),
  (2, true, '16:00', '23:00'),
  (3, true, '16:00', '23:00'),
  (4, true, '16:00', '23:00'),
  (5, true, '16:00', '23:00'),
  (6, true, '13:00', '21:00')
on conflict (weekday) do nothing;

-- 2026年7月の定休日 = 水曜(3)
insert into public.lisso_month_settings (year, month, closed_weekday) values (2026, 7, 3)
on conflict (year, month) do nothing;

-- メニュー初期サンプル
insert into public.lisso_menu_items (category, name, price, sort_order) values
  ('シーシャ', 'シーシャ（1台）', 2500, 10),
  ('シーシャ', 'フレーバー追加', 500, 20),
  ('ドリンク', 'ソフトドリンク', 600, 30),
  ('ドリンク', 'アルコール', 800, 40)
on conflict do nothing;

-- =====================================================================
--  役割の設定（メールアドレスを置き換えて実行）
--  ※ アカウントは既存の認証フロー / ダッシュボードで作成済みのものを使います。
-- =====================================================================
-- ゆうき = 管理者
-- update public.profiles set role = 'admin', display_name = 'ゆうき'
--   where id = (select id from auth.users where email = 'ゆうきのメール');
-- さおとめ = 一般 + 時給
-- update public.profiles set role = 'user', display_name = 'さおとめ'
--   where id = (select id from auth.users where email = 'さおとめのメール');
-- insert into public.lisso_staff_wage (profile_id, hourly_wage)
--   select id, 1200 from auth.users where email = 'さおとめのメール'
--   on conflict (profile_id) do update set hourly_wage = excluded.hourly_wage;
