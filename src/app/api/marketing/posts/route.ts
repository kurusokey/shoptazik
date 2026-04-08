// API Route — Dashboard marketing
// GET : liste les posts (queue, publiés, stats)
// POST : approuver/rejeter un post de la bibliothèque

import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(request: Request) {
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
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ posts: data });
  }

  if (view === "library") {
    const { data, error } = await supabase
      .from("content_library")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ items: data });
  }

  if (view === "comments") {
    const { data, error } = await supabase
      .from("instagram_comments")
      .select("*")
      .eq("replied", false)
      .order("timestamp", { ascending: false })
      .limit(limit);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ comments: data });
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

    return NextResponse.json({
      totalPosts,
      avgScore: Math.round(avgScore * 100) / 100,
      totalImpressions,
      totalClicks,
    });
  }

  return NextResponse.json({ error: "view invalide" }, { status: 400 });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { action, id } = body;
  const supabase = getSupabase();

  if (action === "approve" && id) {
    const { error } = await supabase
      .from("content_library")
      .update({ approved: true, approved_at: new Date().toISOString() })
      .eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  if (action === "reject" && id) {
    const { error } = await supabase
      .from("content_library")
      .delete()
      .eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "action invalide" }, { status: 400 });
}
