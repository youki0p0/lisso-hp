"use client";

import React from "react";
import { supabase, type AdminUserRow } from "@/lib/supabase";

const ROLE_OPTIONS = [
  { value: "user", label: "User（一般・閲覧）" },
  { value: "staff", label: "Staff（スタッフ・タイムカード）" },
  { value: "admin", label: "Admin（管理者）" },
];

function roleLabel(r: string) {
  if (r === "admin") return "Admin";
  if (r === "staff") return "Staff";
  if (r === "curator") return "Curator";
  return "User";
}

export function UsersTab() {
  const [rows, setRows] = React.useState<AdminUserRow[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState<string | null>(null);
  const [grantEmail, setGrantEmail] = React.useState("");
  const [grantRole, setGrantRole] = React.useState("staff");
  const [msg, setMsg] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc("lisso_admin_list_users");
    if (error) setErr(error.message);
    else { setErr(null); setRows((data as AdminUserRow[]) ?? []); }
    setLoading(false);
  }, []);

  React.useEffect(() => { load(); }, [load]);

  const setRole = async (id: string, role: string) => {
    setRows((xs) => xs.map((x) => (x.id === id ? { ...x, role } : x)));
    const { error } = await supabase.rpc("lisso_admin_set_role", { p_id: id, p_role: role });
    if (error) { setErr(error.message); load(); }
  };

  const grant = async () => {
    setMsg(null); setErr(null);
    if (!grantEmail.trim()) return;
    const { error } = await supabase.rpc("lisso_admin_grant_email", {
      p_email: grantEmail.trim(), p_role: grantRole,
    });
    if (error) { setErr(error.message); return; }
    setMsg(`${grantEmail.trim()} を ${roleLabel(grantRole)} に紐付けました（未登録の場合は次回ログイン時に反映）。`);
    setGrantEmail("");
    load();
  };

  return (
    <div>
      <h2 className="la-section-title">ユーザー管理</h2>
      <p className="la-muted" style={{ marginBottom: "1rem" }}>
        区分は <b>User</b>（一般・閲覧のみ）／ <b>Staff</b>（タイムカード・時給）／ <b>Admin</b>（全設定）の3段階です。
      </p>

      {/* メールに役割を紐付け */}
      <div className="la-settings">
        <div className="la-field" style={{ flex: 1, minWidth: 220 }}>
          <label>メールアドレスに役割を紐付け</label>
          <input
            type="email"
            placeholder="example@mail.com"
            value={grantEmail}
            onChange={(e) => setGrantEmail(e.target.value)}
          />
        </div>
        <div className="la-field">
          <label>役割</label>
          <select value={grantRole} onChange={(e) => setGrantRole(e.target.value)}>
            {ROLE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <button className="la-btn primary" onClick={grant}>紐付け</button>
      </div>
      {msg && <p className="la-muted" style={{ color: "#9ccf9c", marginTop: "-.6rem", marginBottom: "1rem" }}>{msg}</p>}
      {err && <p className="la-err" style={{ textAlign: "left" }}>{err}</p>}

      {/* 既存ユーザー一覧 */}
      {loading ? (
        <p className="la-muted">読み込み中…</p>
      ) : (
        <table className="la-table">
          <thead>
            <tr>
              <th>メールアドレス</th>
              <th>表示名</th>
              <th style={{ width: "28%" }}>区分</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((u) => (
              <tr key={u.id}>
                <td>{u.email}</td>
                <td>{u.display_name}</td>
                <td>
                  <select value={["user", "staff", "admin"].includes(u.role) ? u.role : "user"} onChange={(e) => setRole(u.id, e.target.value)}>
                    {ROLE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={3} className="la-muted">ユーザーがいません。</td></tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
