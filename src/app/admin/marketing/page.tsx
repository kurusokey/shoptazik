"use client";

import { useState, useEffect, useCallback } from "react";

// ============================================
// Dashboard Marketing — Protégé par login
// /admin/marketing
// ============================================

const API_BASE = "/api/marketing";

interface Post {
  id: string;
  platform: string;
  post_type: string;
  text_content: string;
  score: number;
  impressions: number;
  clicks: number;
  content_category: string;
  created_at: string;
}

interface LibraryItem {
  id: string;
  type: string;
  title: string;
  content: string;
  approved: boolean;
  created_at: string;
}

interface Comment {
  id: string;
  username: string;
  text_content: string;
  sentiment: string;
  timestamp: string;
}

interface Stats {
  totalPosts: number;
  avgScore: number;
  totalImpressions: number;
  totalClicks: number;
}

type Tab = "dashboard" | "posts" | "library" | "comments";

// ---- Auth helpers ----

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("mug-admin-token");
}

function setToken(token: string) {
  localStorage.setItem("mug-admin-token", token);
}

function clearToken() {
  localStorage.removeItem("mug-admin-token");
}

async function authFetch(url: string, opts?: RequestInit) {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(opts?.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (opts?.method === "POST") headers["Content-Type"] = "application/json";

  const res = await fetch(url, { ...opts, headers });
  if (res.status === 401) {
    clearToken();
    window.location.reload();
    throw new Error("Non autorisé");
  }
  return res;
}

// ---- Login Screen ----

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (data.ok && data.token) {
        setToken(data.token);
        onLogin();
      } else {
        setError(data.error || "Identifiants incorrects");
      }
    } catch {
      setError("Erreur de connexion");
    }
    setLoading(false);
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0A0A0A",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
    }}>
      <form onSubmit={handleSubmit} style={{
        background: "#1A1A1A",
        borderRadius: "12px",
        padding: "32px",
        width: "100%",
        maxWidth: "360px",
        border: "1px solid #333",
      }}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <h1 style={{ color: "#C8A050", fontSize: "20px", margin: "0 0 4px" }}>La M.U.G</h1>
          <p style={{ color: "#888", fontSize: "13px" }}>Dashboard Marketing</p>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", color: "#888", fontSize: "12px", marginBottom: "6px" }}>Identifiant</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              background: "#0A0A0A",
              border: "1px solid #333",
              borderRadius: "8px",
              color: "#F5E6C8",
              fontSize: "14px",
              outline: "none",
            }}
            autoFocus
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", color: "#888", fontSize: "12px", marginBottom: "6px" }}>Mot de passe</label>
          <div style={{ position: "relative" }}>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 40px 10px 12px",
              background: "#0A0A0A",
              border: "1px solid #333",
              borderRadius: "8px",
              color: "#F5E6C8",
              fontSize: "14px",
              outline: "none",
            }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              color: "#888",
              cursor: "pointer",
              fontSize: "18px",
              padding: "4px",
            }}
          >
            {showPassword ? "\u{1F648}" : "\u{1F441}"}
          </button>
          </div>
        </div>

        {error && (
          <p style={{ color: "#f44336", fontSize: "13px", marginBottom: "12px", textAlign: "center" }}>{error}</p>
        )}

        <button type="submit" disabled={loading} style={{
          width: "100%",
          padding: "12px",
          background: "#C8A050",
          color: "#0A0A0A",
          border: "none",
          borderRadius: "8px",
          fontWeight: "bold",
          fontSize: "14px",
          cursor: loading ? "wait" : "pointer",
          opacity: loading ? 0.7 : 1,
        }}>
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
}

// ---- Dashboard ----

export default function MarketingDashboard() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [tab, setTab] = useState<Tab>("dashboard");
  const [posts, setPosts] = useState<Post[]>([]);
  const [library, setLibrary] = useState<LibraryItem[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);

  // Check auth on mount
  useEffect(() => {
    const token = getToken();
    if (!token) { setAuthed(false); return; }
    fetch(`${API_BASE}/auth`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => { setAuthed(r.ok); if (!r.ok) clearToken(); })
      .catch(() => { setAuthed(false); clearToken(); });
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      if (tab === "dashboard") {
        const res = await authFetch(`${API_BASE}/posts?view=stats`);
        setStats(await res.json());
      } else if (tab === "posts") {
        const res = await authFetch(`${API_BASE}/posts?view=recent`);
        const data = await res.json();
        setPosts(data.posts || []);
      } else if (tab === "library") {
        const res = await authFetch(`${API_BASE}/posts?view=library`);
        const data = await res.json();
        setLibrary(data.items || []);
      } else if (tab === "comments") {
        const res = await authFetch(`${API_BASE}/posts?view=comments`);
        const data = await res.json();
        setComments(data.comments || []);
      }
    } catch { /* auth redirect handled by authFetch */ }
    setLoading(false);
  }, [tab]);

  useEffect(() => { if (authed) loadData(); }, [authed, loadData]);

  if (authed === null) return <div style={{ minHeight: "100vh", background: "#0A0A0A" }} />;
  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;

  const sentimentEmoji: Record<string, string> = { positive: "💚", negative: "🔴", neutral: "⚪", question: "❓" };

  async function approveItem(id: string) {
    await authFetch(`${API_BASE}/posts`, { method: "POST", body: JSON.stringify({ action: "approve", id }) });
    loadData();
  }

  async function rejectItem(id: string) {
    if (!confirm("Supprimer ce contenu ?")) return;
    await authFetch(`${API_BASE}/posts`, { method: "POST", body: JSON.stringify({ action: "reject", id }) });
    loadData();
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0A0A0A",
      color: "#F5E6C8",
      fontFamily: "system-ui, sans-serif",
      padding: "16px",
      maxWidth: "600px",
      margin: "0 auto",
    }}>
      <div style={{ textAlign: "center", padding: "20px 0", borderBottom: "2px solid #C8A050" }}>
        <h1 style={{ color: "#C8A050", fontSize: "20px", margin: 0 }}>La M.U.G — Marketing</h1>
        <p style={{ color: "#888", fontSize: "12px", margin: "4px 0 0" }}>
          Dashboard de gestion
          <button onClick={() => { clearToken(); setAuthed(false); }} style={{
            background: "none", border: "none", color: "#666", marginLeft: "12px", cursor: "pointer", fontSize: "11px",
          }}>Déconnexion</button>
        </p>
      </div>

      <div style={{ display: "flex", gap: "4px", padding: "12px 0", overflowX: "auto" }}>
        {(["dashboard", "posts", "library", "comments"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "8px 14px", borderRadius: "6px", border: "none",
              background: tab === t ? "#C8A050" : "#1A1A1A",
              color: tab === t ? "#0A0A0A" : "#888",
              fontWeight: tab === t ? "bold" : "normal",
              fontSize: "13px", cursor: "pointer", whiteSpace: "nowrap",
            }}
          >
            {t === "dashboard" ? "Tableau de bord" : t === "posts" ? "Posts" : t === "library" ? "Bibliothèque" : "Commentaires"}
          </button>
        ))}
      </div>

      {loading && <p style={{ textAlign: "center", color: "#888", padding: "40px 0" }}>Chargement...</p>}

      {/* Dashboard */}
      {tab === "dashboard" && stats && !loading && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", paddingTop: "12px" }}>
          {[
            { label: "Posts", value: stats.totalPosts, color: "#C8A050" },
            { label: "Score moyen", value: `${stats.avgScore}%`, color: "#4CAF50" },
            { label: "Impressions", value: stats.totalImpressions.toLocaleString(), color: "#2196F3" },
            { label: "Clics", value: stats.totalClicks.toLocaleString(), color: "#FF9800" },
          ].map((card) => (
            <div key={card.label} style={{ background: "#1A1A1A", borderRadius: "8px", padding: "16px", borderLeft: `3px solid ${card.color}` }}>
              <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>{card.label}</p>
              <p style={{ color: card.color, fontSize: "24px", fontWeight: "bold", margin: "4px 0 0" }}>{card.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Posts */}
      {tab === "posts" && !loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", paddingTop: "12px" }}>
          {posts.map((post) => (
            <div key={post.id} style={{
              background: "#1A1A1A", borderRadius: "8px", padding: "12px",
              borderLeft: `3px solid ${post.content_category === "promo" ? "#FF9800" : post.content_category === "communaute" ? "#4CAF50" : "#C8A050"}`,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#888" }}>
                <span>{post.platform} / {post.post_type}</span>
                <span>{new Date(post.created_at).toLocaleDateString("fr-FR")}</span>
              </div>
              <p style={{ margin: "8px 0", fontSize: "14px", lineHeight: "1.4" }}>
                {post.text_content.slice(0, 150)}{post.text_content.length > 150 ? "..." : ""}
              </p>
              {post.score > 0 && (
                <div style={{ display: "flex", gap: "12px", fontSize: "11px", color: "#888" }}>
                  <span>Score: {post.score}%</span>
                  <span>Impressions: {post.impressions}</span>
                  <span>Clics: {post.clicks}</span>
                </div>
              )}
            </div>
          ))}
          {posts.length === 0 && <p style={{ color: "#888", textAlign: "center" }}>Aucun post enregistré.</p>}
        </div>
      )}

      {/* Library */}
      {tab === "library" && !loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", paddingTop: "12px" }}>
          {library.map((item) => (
            <div key={item.id} style={{
              background: "#1A1A1A", borderRadius: "8px", padding: "12px",
              border: item.approved ? "1px solid #333" : "1px solid #C8A050",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#888" }}>
                <span style={{ background: "#333", padding: "2px 6px", borderRadius: "4px" }}>{item.type}</span>
                <span>{item.approved ? "✅" : "⏳"}</span>
              </div>
              <p style={{ fontWeight: "bold", margin: "8px 0 4px", fontSize: "14px" }}>{item.title}</p>
              <p style={{ margin: 0, fontSize: "13px", color: "#aaa", lineHeight: "1.4" }}>
                {item.content.slice(0, 120)}{item.content.length > 120 ? "..." : ""}
              </p>
              {!item.approved && (
                <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                  <button onClick={() => approveItem(item.id)} style={{
                    flex: 1, padding: "8px", border: "none", borderRadius: "6px",
                    background: "#4CAF50", color: "#fff", fontWeight: "bold", cursor: "pointer",
                  }}>Approuver</button>
                  <button onClick={() => rejectItem(item.id)} style={{
                    flex: 1, padding: "8px", border: "none", borderRadius: "6px",
                    background: "#f44336", color: "#fff", fontWeight: "bold", cursor: "pointer",
                  }}>Rejeter</button>
                </div>
              )}
            </div>
          ))}
          {library.length === 0 && <p style={{ color: "#888", textAlign: "center" }}>Bibliothèque vide.</p>}
        </div>
      )}

      {/* Comments */}
      {tab === "comments" && !loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", paddingTop: "12px" }}>
          {comments.map((c) => (
            <div key={c.id} style={{ background: "#1A1A1A", borderRadius: "8px", padding: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#888" }}>
                <span>{sentimentEmoji[c.sentiment] || "💬"} @{c.username}</span>
                <span>{new Date(c.timestamp).toLocaleDateString("fr-FR")}</span>
              </div>
              <p style={{ margin: "8px 0 0", fontSize: "14px", lineHeight: "1.4" }}>&ldquo;{c.text_content}&rdquo;</p>
            </div>
          ))}
          {comments.length === 0 && <p style={{ color: "#888", textAlign: "center" }}>Aucun commentaire en attente.</p>}
        </div>
      )}
    </div>
  );
}
