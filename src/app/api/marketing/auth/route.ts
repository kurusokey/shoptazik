// API Route — Authentification dashboard marketing
// POST : login → retourne un token
// GET : vérifier un token

import { NextResponse } from "next/server";
import crypto from "crypto";

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

// Génère un token signé (valide 24h)
function generateToken(): string {
  const secret = process.env.ADMIN_TOKEN_SECRET || "fallback-secret";
  const expiry = Date.now() + 24 * 60 * 60 * 1000; // 24h
  const payload = `mug-admin:${expiry}`;
  const signature = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  // token = base64(payload:signature)
  return Buffer.from(`${payload}:${signature}`).toString("base64");
}

// Vérifie un token
export function verifyToken(token: string): boolean {
  try {
    const secret = process.env.ADMIN_TOKEN_SECRET || "fallback-secret";
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const parts = decoded.split(":");
    if (parts.length !== 3) return false;

    const [prefix, expiryStr, signature] = parts;
    const payload = `${prefix}:${expiryStr}`;
    const expectedSig = crypto.createHmac("sha256", secret).update(payload).digest("hex");

    if (signature !== expectedSig) return false;
    if (Date.now() > Number(expiryStr)) return false;

    return true;
  } catch {
    return false;
  }
}

// POST /api/marketing/auth — login
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const headers = corsHeaders(origin);

  const body = await request.json();
  const { username, password } = body;

  const validUser = process.env.ADMIN_USERNAME || "admin";
  const validPass = process.env.ADMIN_PASSWORD || "";

  if (username === validUser && password === validPass) {
    const token = generateToken();
    return NextResponse.json({ ok: true, token }, { headers });
  }

  return NextResponse.json({ ok: false, error: "Identifiants incorrects" }, { status: 401, headers });
}

// GET /api/marketing/auth — vérifier token
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
