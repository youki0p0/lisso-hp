"use client";

import React from "react";
import { supabase } from "@/lib/supabase";

export function Login() {
  const [mode, setMode] = React.useState<"link" | "password">("link");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [err, setErr] = React.useState<string | null>(null);
  const [sent, setSent] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  const sendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    const redirect =
      typeof window !== "undefined" ? window.location.origin + window.location.pathname : undefined;
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: redirect },
    });
    setBusy(false);
    if (error) setErr("リンクの送信に失敗しました。メールアドレスをご確認ください。");
    else setSent(true);
  };

  const passwordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) setErr("ログインに失敗しました。メールアドレスとパスワードをご確認ください。");
  };

  return (
    <div className="la-login">
      <h1>SHISHA LISSO</h1>
      <p className="sub">管理者ページ</p>

      {sent ? (
        <div>
          <div className="la-hint" style={{ marginTop: 0 }}>
            <b>{email}</b> にログインリンクを送信しました。📧<br />
            メールを開いて「ログイン」リンクをタップすると、このページに戻ってログインが完了します。
            （メールが届かない場合は迷惑メールもご確認ください）
          </div>
          <div style={{ marginTop: "1rem", textAlign: "center" }}>
            <button className="la-btn sm ghost" onClick={() => { setSent(false); setErr(null); }}>
              別のメールアドレスで送り直す
            </button>
          </div>
        </div>
      ) : mode === "link" ? (
        <form onSubmit={sendLink}>
          <label>メールアドレス</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="you@example.com"
            required
          />
          {err && <div className="la-err">{err}</div>}
          <div style={{ marginTop: "1.2rem" }}>
            <button className="la-btn primary" style={{ width: "100%" }} disabled={busy}>
              {busy ? "送信中…" : "ログインリンクを送信"}
            </button>
          </div>
          <p className="la-note" style={{ textAlign: "center" }}>
            パスワードは不要です。届いたリンクを開くだけでログインできます。
          </p>
          <div style={{ textAlign: "center" }}>
            <button type="button" className="la-btn sm ghost" onClick={() => { setMode("password"); setErr(null); }}>
              パスワードでログイン
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={passwordLogin}>
          <label>メールアドレス</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            required
          />
          <label>パスワード</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
          {err && <div className="la-err">{err}</div>}
          <div style={{ marginTop: "1.2rem" }}>
            <button className="la-btn primary" style={{ width: "100%" }} disabled={busy}>
              {busy ? "ログイン中…" : "ログイン"}
            </button>
          </div>
          <div style={{ textAlign: "center", marginTop: ".4rem" }}>
            <button type="button" className="la-btn sm ghost" onClick={() => { setMode("link"); setErr(null); }}>
              メールのリンクでログイン
            </button>
          </div>
        </form>
      )}

      <div className="la-hint">
        初回セットアップ: Supabase で <code>database/lisso_admin_schema.sql</code> を実行し、
        最初の管理者だけ <code>profiles</code> で <code>{"role='admin'"}</code> に設定すれば、
        あとは「ユーザー管理」画面からメールアドレスに役割を割り当てできます。
      </div>
    </div>
  );
}
