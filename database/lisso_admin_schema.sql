-- =====================================================================
--  SHISHA LISSO 店舗管理 スキーマ（接頭辞 lisso_）
--  Supabase の SQL Editor に貼り付けて実行してください。
--  既存の他テーブルには影響しません（lisso_ 接頭辞 + RLS で分離）。
-- =====================================================================

create extension if not exists pgcrypto;

-- ---- プロフィール（auth.users と 1:1。ロール・時給を保持）----
create table if not exists public.lisso_profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  name        text not null,
  role        text not null default 'staff' check (role in ('admin','staff')),
  hourly_wage integer not null default 0,
  created_at  timestamptz not null default now()
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
  closed_weekday smallint check (closed_weekday between 0 and 6), -- null=定休日なし
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

-- ---- タイムカード ----
create table if not exists public.lisso_timecards (
  id            uuid primary key default gen_random_uuid(),
  profile_id    uuid not null references public.lisso_profiles(id) on delete cascade,
  work_date     date not null,
  clock_in      text not null,            -- 'HH:MM'
  clock_out     text not null,            -- 'HH:MM'
  break_minutes integer not null default 0,
  note          text,
  created_at    timestamptz not null default now()
);

-- =====================================================================
--  ヘルパー関数 / トリガー
-- =====================================================================

create or replace function public.lisso_is_admin()
returns boolean language sql security definer stable
set search_path = public as $$
  select exists (
    select 1 from public.lisso_profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

-- auth.users 追加時に自動でプロフィールを作成
create or replace function public.lisso_handle_new_user()
returns trigger language plpgsql security definer
set search_path = public as $$
begin
  insert into public.lisso_profiles (id, name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'staff')
  )
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists lisso_on_auth_user_created on auth.users;
create trigger lisso_on_auth_user_created
  after insert on auth.users
  for each row execute function public.lisso_handle_new_user();

-- =====================================================================
--  RLS
-- =====================================================================
alter table public.lisso_profiles        enable row level security;
alter table public.lisso_weekday_defaults enable row level security;
alter table public.lisso_month_settings   enable row level security;
alter table public.lisso_day_overrides    enable row level security;
alter table public.lisso_menu_items       enable row level security;
alter table public.lisso_timecards        enable row level security;

-- profiles: 認証ユーザは全員参照可、自分のみ更新可（時給設定）、管理者は全権
drop policy if exists lisso_profiles_sel       on public.lisso_profiles;
drop policy if exists lisso_profiles_upd_own   on public.lisso_profiles;
drop policy if exists lisso_profiles_admin_all on public.lisso_profiles;
create policy lisso_profiles_sel       on public.lisso_profiles for select to authenticated using (true);
create policy lisso_profiles_upd_own   on public.lisso_profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy lisso_profiles_admin_all on public.lisso_profiles for all    to authenticated using (public.lisso_is_admin()) with check (public.lisso_is_admin());

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

-- timecards: 本人は自分の分を全操作可、管理者は全件
drop policy if exists lisso_tc_own   on public.lisso_timecards;
drop policy if exists lisso_tc_admin on public.lisso_timecards;
create policy lisso_tc_own   on public.lisso_timecards for all to authenticated using (profile_id = auth.uid()) with check (profile_id = auth.uid());
create policy lisso_tc_admin on public.lisso_timecards for all to authenticated using (public.lisso_is_admin()) with check (public.lisso_is_admin());

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

-- メニュー初期サンプル（あとから管理画面で編集できます）
insert into public.lisso_menu_items (category, name, price, sort_order) values
  ('シーシャ', 'シーシャ（1台）', 2500, 10),
  ('シーシャ', 'フレーバー追加', 500, 20),
  ('ドリンク', 'ソフトドリンク', 600, 30),
  ('ドリンク', 'アルコール', 800, 40)
on conflict do nothing;
