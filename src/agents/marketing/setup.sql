-- ============================================
-- MUG Marketing Agent — Tables Supabase
-- Exécuter dans Supabase SQL Editor (Dashboard → SQL)
-- ============================================

-- 1. Posts marketing (tracking de chaque publication)
CREATE TABLE IF NOT EXISTS marketing_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  platform TEXT NOT NULL,
  post_type TEXT NOT NULL,
  text_content TEXT NOT NULL,
  hashtags TEXT[] DEFAULT '{}',
  image_url TEXT,
  buffer_post_id TEXT,
  buffer_channel_id TEXT,
  scheduled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  target_site TEXT,
  campaign TEXT,
  content_category TEXT DEFAULT 'valeur' CHECK (content_category IN ('valeur', 'communaute', 'promo')),
  -- Stats (mises à jour après publication)
  impressions INTEGER DEFAULT 0,
  reach INTEGER DEFAULT 0,
  engagement INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  saves INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  score REAL DEFAULT 0,
  notes TEXT,
  -- Recyclage
  recycled_from UUID REFERENCES marketing_posts(id),
  recycle_count INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_mp_platform ON marketing_posts(platform);
CREATE INDEX IF NOT EXISTS idx_mp_campaign ON marketing_posts(campaign);
CREATE INDEX IF NOT EXISTS idx_mp_created ON marketing_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mp_score ON marketing_posts(score DESC);
CREATE INDEX IF NOT EXISTS idx_mp_category ON marketing_posts(content_category);

-- 2. Abonnés newsletter
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  active BOOLEAN DEFAULT true,
  source TEXT DEFAULT 'manual',
  subscribed_at TIMESTAMPTZ DEFAULT now(),
  unsubscribed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_ns_active ON newsletter_subscribers(active);
CREATE INDEX IF NOT EXISTS idx_ns_email ON newsletter_subscribers(email);

-- 3. Liens UTM (tracking de chaque lien partagé)
CREATE TABLE IF NOT EXISTS utm_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  original_url TEXT NOT NULL,
  utm_url TEXT NOT NULL,
  source TEXT NOT NULL,
  medium TEXT NOT NULL,
  campaign TEXT NOT NULL,
  content TEXT,
  term TEXT,
  marketing_post_id UUID REFERENCES marketing_posts(id),
  click_count INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_ul_campaign ON utm_links(campaign);
CREATE INDEX IF NOT EXISTS idx_ul_source ON utm_links(source);

-- 4. Bibliothèque de contenus approuvés
CREATE TABLE IF NOT EXISTS content_library (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  type TEXT NOT NULL CHECK (type IN ('text', 'image', 'template', 'hashtag_set', 'bio', 'cta')),
  platform TEXT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  tags TEXT[] DEFAULT '{}',
  approved BOOLEAN DEFAULT false,
  approved_at TIMESTAMPTZ,
  usage_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMPTZ,
  performance_score REAL DEFAULT 0,
  notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_cl_type ON content_library(type);
CREATE INDEX IF NOT EXISTS idx_cl_approved ON content_library(approved);
CREATE INDEX IF NOT EXISTS idx_cl_tags ON content_library USING GIN(tags);

-- 5. Collecte de stats (historique des snapshots)
CREATE TABLE IF NOT EXISTS stats_snapshots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  collected_at TIMESTAMPTZ DEFAULT now(),
  marketing_post_id UUID REFERENCES marketing_posts(id),
  buffer_post_id TEXT,
  impressions INTEGER DEFAULT 0,
  reach INTEGER DEFAULT 0,
  engagement INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  saves INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_ss_post ON stats_snapshots(marketing_post_id);
CREATE INDEX IF NOT EXISTS idx_ss_collected ON stats_snapshots(collected_at DESC);

-- 6. Coûts API (suivi des dépenses)
CREATE TABLE IF NOT EXISTS api_costs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recorded_at TIMESTAMPTZ DEFAULT now(),
  service TEXT NOT NULL CHECK (service IN ('anthropic', 'openai', 'buffer', 'resend')),
  operation TEXT NOT NULL,
  tokens_input INTEGER DEFAULT 0,
  tokens_output INTEGER DEFAULT 0,
  estimated_cost_usd REAL DEFAULT 0,
  metadata JSONB DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_ac_service ON api_costs(service);
CREATE INDEX IF NOT EXISTS idx_ac_recorded ON api_costs(recorded_at DESC);

-- 7. Commentaires Instagram (cache local)
CREATE TABLE IF NOT EXISTS instagram_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  fetched_at TIMESTAMPTZ DEFAULT now(),
  ig_comment_id TEXT UNIQUE,
  ig_media_id TEXT,
  marketing_post_id UUID REFERENCES marketing_posts(id),
  username TEXT,
  text_content TEXT NOT NULL,
  timestamp TIMESTAMPTZ,
  like_count INTEGER DEFAULT 0,
  sentiment TEXT CHECK (sentiment IN ('positive', 'negative', 'neutral', 'question')),
  replied BOOLEAN DEFAULT false,
  reply_text TEXT,
  replied_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_ic_post ON instagram_comments(marketing_post_id);
CREATE INDEX IF NOT EXISTS idx_ic_replied ON instagram_comments(replied);
CREATE INDEX IF NOT EXISTS idx_ic_sentiment ON instagram_comments(sentiment);

-- 8. RLS (Row Level Security) — désactivé pour le service role
-- Les tables sont accessibles uniquement via SUPABASE_SERVICE_ROLE_KEY
ALTER TABLE marketing_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE utm_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE stats_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE instagram_comments ENABLE ROW LEVEL SECURITY;

-- Policies pour le service role (accès complet)
CREATE POLICY "service_role_all" ON marketing_posts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all" ON newsletter_subscribers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all" ON utm_links FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all" ON content_library FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all" ON stats_snapshots FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all" ON api_costs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all" ON instagram_comments FOR ALL USING (true) WITH CHECK (true);
