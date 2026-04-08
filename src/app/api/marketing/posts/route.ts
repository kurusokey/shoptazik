// API Route — Dashboard marketing
// GET : liste les posts (queue, publiés, stats)
// POST : approuver/rejeter un post de la bibliothèque
// CORS : autorise la-mug.com et boutique.la-mug.com

import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { verifyToken } from "../auth/route";

const ALLOWED_ORIGINS = [
  "https://la-mug.com",
  "https://www.la-mug.com",
  "https://boutique.la-mug.com",
  "http://localhost:3000",
  "http://localhost:3001",
];

function corsHeaders(origin: string | null) {
  const allowed = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

function json(data: unknown, status: number, origin: string | null) {
  return NextResponse.json(data, { status, headers: corsHeaders(origin) });
}

export async function OPTIONS(request: Request) {
  const origin = request.headers.get("origin");
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function checkAuth(request: Request, origin: string | null): NextResponse | null {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401, headers: corsHeaders(origin) });
  }
  return null;
}

export async function GET(request: Request) {
  const origin = request.headers.get("origin");
  const denied = checkAuth(request, origin);
  if (denied) return denied;
  const { searchParams } = new URL(request.url);
  const view = searchParams.get("view") || "recent";
  const limit = Number(searchParams.get("limit")) || 20;
  const supabase = getSupabase();

  if (view === "recent") {
    const { data, error } = await supabase
      .from("marketing_posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) return json({ error: error.message }, 500, origin);
    return json({ posts: data }, 200, origin);
  }

  if (view === "library") {
    const { data, error } = await supabase
      .from("content_library")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) return json({ error: error.message }, 500, origin);
    return json({ items: data }, 200, origin);
  }

  if (view === "comments") {
    const { data, error } = await supabase
      .from("instagram_comments")
      .select("*")
      .eq("replied", false)
      .order("timestamp", { ascending: false })
      .limit(limit);
    if (error) return json({ error: error.message }, 500, origin);
    return json({ comments: data }, 200, origin);
  }

  if (view === "stats") {
    const { data: posts } = await supabase
      .from("marketing_posts")
      .select("platform, post_type, score, impressions, engagement, clicks")
      .gt("score", 0);

    const totalPosts = posts?.length || 0;
    const avgScore = totalPosts > 0
      ? posts!.reduce((s, p) => s + (p.score || 0), 0) / totalPosts
      : 0;
    const totalImpressions = posts?.reduce((s, p) => s + (p.impressions || 0), 0) || 0;
    const totalClicks = posts?.reduce((s, p) => s + (p.clicks || 0), 0) || 0;

    return json({ totalPosts, avgScore: Math.round(avgScore * 100) / 100, totalImpressions, totalClicks }, 200, origin);
  }

  return json({ error: "view invalide" }, 400, origin);
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const denied = checkAuth(request, origin);
  if (denied) return denied;
  const body = await request.json();
  const { action, id } = body;
  const supabase = getSupabase();

  if (action === "approve" && id) {
    const { error } = await supabase
      .from("content_library")
      .update({ approved: true, approved_at: new Date().toISOString() })
      .eq("id", id);
    if (error) return json({ error: error.message }, 500, origin);
    return json({ ok: true }, 200, origin);
  }

  if (action === "reject" && id) {
    const { error } = await supabase
      .from("content_library")
      .delete()
      .eq("id", id);
    if (error) return json({ error: error.message }, 500, origin);
    return json({ ok: true }, 200, origin);
  }

  return json({ error: "action invalide" }, 400, origin);
}
