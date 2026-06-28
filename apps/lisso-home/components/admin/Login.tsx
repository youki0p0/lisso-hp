"use client";

import React from "react";
import { supabase } from "@/lib/supabase";

export function Login() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [err, setErr] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) setErr("ログインに失敗しました。メールアドレスとパスワードをご確認ください。");
  };

  return (
    <div className="la-login">
      <h1>SHISHA LISSO</h1>
      <p className="sub">管理者ページ</p>
      <form onSubmit={submit}>
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
      </form>
      <div className="la-hint">
        初回セットアップ: Supabase で <code>database/lisso_admin_schema.sql</code> を実行し、
        既存の <code>profiles</code> でゆうき=admin / さおとめ=user の役割を設定してください。
        詳しい手順は <code>database/LISSO_ADMIN_SETUP.md</code> を参照。
      </div>
    </div>
  );
}
