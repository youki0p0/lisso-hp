"use client";

import React from "react";
import "./admin.css";
import { supabase, type Profile } from "@/lib/supabase";
import { Login } from "@/components/admin/Login";
import { CalendarTab } from "@/components/admin/CalendarTab";
import { MenuTab } from "@/components/admin/MenuTab";
import { TimecardTab } from "@/components/admin/TimecardTab";
import { UsersTab } from "@/components/admin/UsersTab";
import { PrintView, type PrintPayload } from "@/components/admin/PrintView";

type Tab = "calendar" | "menu" | "timecard" | "users";

export default function AdminPage() {
  const [ready, setReady] = React.useState(false);
  const [userId, setUserId] = React.useState<string | null>(null);
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [profiles, setProfiles] = React.useState<Profile[]>([]);
  const [tab, setTab] = React.useState<Tab>("calendar");
  const [print, setPrint] = React.useState<PrintPayload>(null);
  const [noProfile, setNoProfile] = React.useState(false);

  // 認証状態の購読
  React.useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUserId(data.session?.user.id ?? null);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUserId(session?.user.id ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // プロフィール読み込み
  React.useEffect(() => {
    if (!userId) { setProfile(null); return; }
    (async () => {
      const me = await supabase.from("profiles").select("id, display_name, role").eq("id", userId).maybeSingle();
      if (!me.data) { setNoProfile(true); return; }
      setNoProfile(false);
      setProfile(me.data as Profile);
      const all = await supabase.from("profiles").select("id, display_name, role").order("role");
      setProfiles((all.data as Profile[]) ?? []);
      const r = (me.data as Profile).role;
      if (r === "staff") setTab("timecard");
      else setTab("calendar");
    })();
  }, [userId]);

  const doPrint = (p: PrintPayload) => {
    setPrint(p);
    requestAnimationFrame(() => setTimeout(() => window.print(), 60));
  };

  const logout = async () => { await supabase.auth.signOut(); setProfile(null); };

  const staffNames = profiles.length ? profiles.map((p) => p.display_name) : ["ゆうき", "さおとめ"];

  if (!ready) return <div className="lisso-admin"><div className="la-wrap"><p className="la-muted">読み込み中…</p></div></div>;
  if (!userId) return <div className="lisso-admin"><Login /></div>;

  if (noProfile)
    return (
      <div className="lisso-admin"><div className="la-wrap">
        <div className="la-hint" style={{ marginTop: "3rem" }}>
          このアカウントにはプロフィールが未登録です。<br />
          Supabase の <code>public.profiles</code> にこのユーザーの行（display_name と role）が
          あるかご確認ください（通常は新規ユーザー作成時に自動作成されます）。
          <div style={{ marginTop: ".8rem" }}>
            <button className="la-btn sm" onClick={logout}>ログアウト</button>
          </div>
        </div>
      </div></div>
    );

  if (!profile) return <div className="lisso-admin"><div className="la-wrap"><p className="la-muted">読み込み中…</p></div></div>;

  const isAdmin = profile.role === "admin";
  const isStaff = profile.role === "staff";
  const canTimecard = isAdmin || isStaff;

  return (
    <div className="lisso-admin">
      {/* 画面表示 */}
      <div className="la-screen"><div className="la-wrap">
        <div className="la-top">
          <div className="la-brand">SHISHA LISSO<small>ADMIN</small></div>
          <div className="la-spacer" />
          <div className="la-who">
            <b>{profile.display_name}</b>{" "}
            <span className={`la-pill ${isAdmin ? "admin" : ""}`}>
              {isAdmin ? "Admin" : isStaff ? "Staff" : "User"}
            </span>
          </div>
          <button className="la-btn sm ghost" onClick={logout}>ログアウト</button>
        </div>

        <div className="la-tabs">
          <button className={`la-tab ${tab === "calendar" ? "active" : ""}`} onClick={() => setTab("calendar")}>営業カレンダー</button>
          <button className={`la-tab ${tab === "menu" ? "active" : ""}`} onClick={() => setTab("menu")}>料金メニュー</button>
          {canTimecard && (
            <button className={`la-tab ${tab === "timecard" ? "active" : ""}`} onClick={() => setTab("timecard")}>タイムカード</button>
          )}
          {isAdmin && (
            <button className={`la-tab ${tab === "users" ? "active" : ""}`} onClick={() => setTab("users")}>ユーザー管理</button>
          )}
        </div>

        {tab === "calendar" && <CalendarTab profile={profile} staffNames={staffNames} onPrint={(m) => doPrint({ type: "calendar", ...m })} />}
        {tab === "menu" && <MenuTab profile={profile} onPrint={(items) => doPrint({ type: "menu", items })} />}
        {tab === "timecard" && canTimecard && <TimecardTab profile={profile} profiles={profiles.length ? profiles : [profile]} />}
        {tab === "users" && isAdmin && <UsersTab />}
      </div></div>

      {/* 印刷専用 */}
      <div className="la-print"><PrintView payload={print} /></div>
    </div>
  );
}
