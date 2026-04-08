"use client";

import { useState, useEffect } from "react";

// ============================================
// Dashboard Marketing — Validation mobile
// /admin/marketing
// ============================================

interface Post {
  id: string;
  platform: string;
  post_type: string;
  text_content: string;
  image_url?: string;
  score: number;
  impressions: number;
  engagement: number;
  clicks: number;
  campaign?: string;
  content_category: string;
  created_at: string;
}

interface LibraryItem {
  id: string;
  type: string;
  title: string;
  content: string;
  platform: string;
  approved: boolean;
  tags: string[];
  created_at: string;
}

interface Comment {
  id: string;
  username: string;
  text_content: string;
  sentiment: string;
  timestamp: string;
  replied: boolean;
}

interface Stats {
  totalPosts: number;
  avgScore: number;
  totalImpressions: number;
  totalClicks: number;
}

type Tab = "dashboard" | "posts" | "library" | "comments";

export default function MarketingDashboard() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [posts, setPosts] = useState<Post[]>([]);
  const [library, setLibrary] = useState<LibraryItem[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tab === "dashboard") loadStats();
    if (tab === "posts") loadPosts();
    if (tab === "library") loadLibrary();
    if (tab === "comments") loadComments();
  }, [tab]);

  async function loadStats() {
    setLoading(true);
    try {
      const res = await fetch("/api/marketing/posts?view=stats");
      const data = await res.json();
      setStats(data);
    } catch { /* */ }
    setLoading(false);
  }

  async function loadPosts() {
    setLoading(true);
    try {
      const res = await fetch("/api/marketing/posts?view=recent");
      const data = await res.json();
      setPosts(data.posts || []);
    } catch { /* */ }
    setLoading(false);
  }

  async function loadLibrary() {
    setLoading(true);
    try {
      const res = await fetch("/api/marketing/posts?view=library");
      const data = await res.json();
      setLibrary(data.items || []);
    } catch { /* */ }
    setLoading(false);
  }

  async function loadComments() {
    setLoading(true);
    try {
      const res = await fetch("/api/marketing/posts?view=comments");
      const data = await res.json();
      setComments(data.comments || []);
    } catch { /* */ }
    setLoading(false);
  }

  async function approveItem(id: string) {
    await fetch("/api/marketing/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "approve", id }),
    });
    loadLibrary();
  }

  async function rejectItem(id: string) {
    if (!confirm("Supprimer ce contenu ?")) return;
    await fetch("/api/marketing/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reject", id }),
    });
    loadLibrary();
  }

  const sentimentEmoji: Record<string, string> = {
    positive: "💚",
    negative: "🔴",
    neutral: "⚪",
    question: "❓",
  };

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
      {/* Header */}
      <div style={{ textAlign: "center", padding: "20px 0", borderBottom: "2px solid #C8A050" }}>
        <h1 style={{ color: "#C8A050", fontSize: "20px", margin: 0 }}>La M.U.G — Marketing</h1>
        <p style={{ color: "#888", fontSize: "12px", margin: "4px 0 0" }}>Dashboard de gestion</p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "4px", padding: "12px 0", overflowX: "auto" }}>
        {(["dashboard", "posts", "library", "comments"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "8px 14px",
              borderRadius: "6px",
              border: "none",
              background: tab === t ? "#C8A050" : "#1A1A1A",
              color: tab === t ? "#0A0A0A" : "#888",
              fontWeight: tab === t ? "bold" : "normal",
              fontSize: "13px",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {t === "dashboard" ? "Tableau de bord" : t === "posts" ? "Posts" : t === "library" ? "Bibliothèque" : "Commentaires"}
          </button>
        ))}
      </div>

      {loading && <p style={{ textAlign: "center", color: "#888" }}>Chargement...</p>}

      {/* Dashboard */}
      {tab === "dashboard" && stats && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", paddingTop: "12px" }}>
          {[
            { label: "Posts", value: stats.totalPosts, color: "#C8A050" },
            { label: "Score moyen", value: `${stats.avgScore}%`, color: "#4CAF50" },
            { label: "Impressions", value: stats.totalImpressions.toLocaleString(), color: "#2196F3" },
            { label: "Clics", value: stats.totalClicks.toLocaleString(), color: "#FF9800" },
          ].map((card) => (
            <div key={card.label} style={{
              background: "#1A1A1A",
              borderRadius: "8px",
              padding: "16px",
              borderLeft: `3px solid ${card.color}`,
            }}>
              <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>{card.label}</p>
              <p style={{ color: card.color, fontSize: "24px", fontWeight: "bold", margin: "4px 0 0" }}>{card.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Posts */}
      {tab === "posts" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", paddingTop: "12px" }}>
          {posts.map((post) => (
            <div key={post.id} style={{
              background: "#1A1A1A",
              borderRadius: "8px",
              padding: "12px",
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
          {posts.length === 0 && !loading && <p style={{ color: "#888", textAlign: "center" }}>Aucun post enregistré.</p>}
        </div>
      )}

      {/* Library */}
      {tab === "library" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", paddingTop: "12px" }}>
          {library.map((item) => (
            <div key={item.id} style={{
              background: "#1A1A1A",
              borderRadius: "8px",
              padding: "12px",
              border: item.approved ? "1px solid #333" : "1px solid #C8A050",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#888" }}>
                <span style={{ background: "#333", padding: "2px 6px", borderRadius: "4px" }}>{item.type}</span>
                <span>{item.approved ? "✅ Approuvé" : "⏳ En attente"}</span>
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
          {library.length === 0 && !loading && <p style={{ color: "#888", textAlign: "center" }}>Bibliothèque vide.</p>}
        </div>
      )}

      {/* Comments */}
      {tab === "comments" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", paddingTop: "12px" }}>
          {comments.map((c) => (
            <div key={c.id} style={{
              background: "#1A1A1A",
              borderRadius: "8px",
              padding: "12px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#888" }}>
                <span>{sentimentEmoji[c.sentiment] || "💬"} @{c.username}</span>
                <span>{new Date(c.timestamp).toLocaleDateString("fr-FR")}</span>
              </div>
              <p style={{ margin: "8px 0 0", fontSize: "14px", lineHeight: "1.4" }}>
                &ldquo;{c.text_content}&rdquo;
              </p>
            </div>
          ))}
          {comments.length === 0 && !loading && <p style={{ color: "#888", textAlign: "center" }}>Aucun commentaire en attente.</p>}
        </div>
      )}
    </div>
  );
}
