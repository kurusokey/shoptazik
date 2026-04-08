// API Route — Authentification dashboard marketing
// Simplifié : pas de crypto Node.js (compatible Edge + Serverless)

import { NextResponse } from "next/server";

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

export async function OPTIONS(request: Request) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(request.headers.get("origin")) });
}

// Token = base64("mug-admin:{expiry}:{simple-hash}")
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit int
  }
  return Math.abs(hash).toString(36);
}

function generateToken(): string {
  const secret = process.env.ADMIN_TOKEN_SECRET || "fallback";
  const expiry = Date.now() + 24 * 60 * 60 * 1000;
  const payload = `mug-admin:${expiry}`;
  const sig = simpleHash(payload + secret);
  return btoa(`${payload}:${sig}`);
}

export function verifyToken(token: string): boolean {
  try {
    const secret = process.env.ADMIN_TOKEN_SECRET || "fallback";
    const decoded = atob(token);
    const parts = decoded.split(":");
    if (parts.length !== 3) return false;

    const [prefix, expiryStr, sig] = parts;
    if (prefix !== "mug-admin") return false;
    if (Date.now() > Number(expiryStr)) return false;

    const expectedSig = simpleHash(`${prefix}:${expiryStr}` + secret);
    return sig === expectedSig;
  } catch {
    return false;
  }
}

// POST — login
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const headers = corsHeaders(origin);

  try {
    const body = await request.json();
    const { username, password } = body;

    const validUser = process.env.ADMIN_USERNAME || "admin";
    const validPass = process.env.ADMIN_PASSWORD || "";

    if (username === validUser && password === validPass) {
      const token = generateToken();
      return NextResponse.json({ ok: true, token }, { headers });
    }

    return NextResponse.json({ ok: false, error: "Identifiants incorrects" }, { status: 401, headers });
  } catch {
    return NextResponse.json({ ok: false, error: "Requête invalide" }, { status: 400, headers });
  }
}

// GET — vérifier token
export async function GET(request: Request) {
  const origin = request.headers.get("origin");
  const headers = corsHeaders(origin);
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token || !verifyToken(token)) {
    return NextResponse.json({ ok: false }, { status: 401, headers });
  }

  return NextResponse.json({ ok: true }, { headers });
}
