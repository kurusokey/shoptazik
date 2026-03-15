-- ===========================================
-- SHOPTAZIK — Schéma de base de données
-- ===========================================

-- Artistes
CREATE TABLE artists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  bio TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL DEFAULT '',
  banner_url TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Projets (albums, EPs, mixtapes)
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  cover_url TEXT NOT NULL DEFAULT '',
  release_year INT NOT NULL,
  tracklist TEXT[] NOT NULL DEFAULT '{}',
  type TEXT NOT NULL CHECK (type IN ('album', 'ep', 'mixtape', 'single')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(artist_id, slug)
);

-- Produits (vinyles, CD, K7, merch)
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price INT NOT NULL, -- en centimes
  image_url TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL CHECK (category IN ('vinyle', 'cd', 'k7', 'tshirt', 'hoodie', 'poster', 'other')),
  stock INT NOT NULL DEFAULT 0,
  is_limited BOOLEAN NOT NULL DEFAULT false,
  edition_info TEXT,
  shipping_delay TEXT NOT NULL DEFAULT '3-5 jours ouvrés',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(project_id, slug)
);

-- Variantes de produit (taille, couleur pour le merch)
CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('size', 'color')),
  stock INT NOT NULL DEFAULT 0,
  price_modifier INT NOT NULL DEFAULT 0
);

-- Commandes
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  total INT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'shipped', 'delivered', 'cancelled')),
  stripe_session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Lignes de commande
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  variant_id UUID REFERENCES product_variants(id),
  quantity INT NOT NULL DEFAULT 1,
  unit_price INT NOT NULL
);

-- Index pour les requêtes fréquentes
CREATE INDEX idx_projects_artist ON projects(artist_id);
CREATE INDEX idx_products_project ON products(project_id);
CREATE INDEX idx_products_artist ON products(artist_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_orders_status ON orders(status);

-- ===========================================
-- SEED DATA : Fdy Phenomen
-- ===========================================

INSERT INTO artists (id, name, slug, bio, image_url, banner_url)
VALUES (
  'a1000000-0000-0000-0000-000000000001',
  'Fdy Phenomen',
  'fdy-phenomen',
  'Fdy Phenomen est un rappeur et auteur français reconnu pour son écriture ciselée et son rap d''auteur. Artiste complet, il incarne une vision du rap francophone exigeante, mêlant storytelling, introspection et punchlines avec une authenticité rare. Sa discographie riche traverse les époques et les styles, du rap brut au rap mélodique, toujours avec la plume comme arme principale.',
  '/images/artists/fdy-phenomen.svg',
  '/images/artists/fdy-phenomen-banner.svg'
);

-- Projets
INSERT INTO projects (id, artist_id, title, slug, description, cover_url, release_year, tracklist, type) VALUES
('b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001',
 'Chanteur de Rap', 'chanteur-de-rap',
 'Chanteur de Rap est l''album manifeste de Fdy Phenomen. Un projet de 10 titres qui explore la dimension d''auteur du rap français : écriture, storytelling, introspection et connexion entre les générations du hip-hop. Un album pour ceux qui considèrent le rap comme un art d''écriture à part entière.',
 '/images/projects/chanteur-de-rap.svg', 2024,
 ARRAY['Intro - Le chanteur', 'Plume & Micro', 'Rue d''auteur', 'Encre noire', 'Génération texte', 'L''art de dire', 'Freestyle d''âme', 'Portraits', 'Héritage', 'Outro - Rideau'],
 'album'),

('b1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001',
 'Flamboyant', 'flamboyant',
 'Flamboyant est un album ambitieux où Fdy Phenomen déploie tout son talent d''écriture sur des productions riches et variées. Un projet flamboyant, à la hauteur de son nom.',
 '/images/projects/flamboyant.svg', 2022,
 ARRAY['Flamboyant (Intro)', 'Feu sacré', 'Au sommet', 'Lumières', 'Sans filtre', 'Le parcours', 'Flammes', 'Éclat', 'Brasier', 'Flamboyant (Outro)'],
 'album'),

('b1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000001',
 'Qui Peut Tuer la Rage d''un Assassin', 'qui-peut-tuer-la-rage-dun-assassin',
 'Un projet brut et viscéral. Fdy Phenomen y livre un rap sans concession, entre rage contenue et lucidité tranchante.',
 '/images/projects/qui-peut-tuer.svg', 2020,
 ARRAY['La rage', 'Assassin', 'Territoire', 'Sang froid', 'Verdict', 'Instinct', 'Survie', 'Le prix'],
 'album'),

('b1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000001',
 'Hors Série', 'hors-serie',
 'Hors Série, c''est le projet en marge des formats classiques. Des morceaux hors cadre, des collaborations inattendues, du Fdy en roue libre.',
 '/images/projects/hors-serie.svg', 2019,
 ARRAY['Hors piste', 'Série noire', 'Carte blanche', 'Freestyle', 'Bonus track'],
 'ep'),

('b1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000001',
 'Tropikal', 'tropikal',
 'Tropikal amène le rap de Fdy Phenomen sous le soleil. Des sonorités chaudes, des flows ensoleillés, mais toujours cette plume acérée.',
 '/images/projects/tropikal.svg', 2018,
 ARRAY['Tropikal (Intro)', 'Soleil noir', 'Île de France', 'Chaleur', 'Brise', 'Tropikal (Outro)'],
 'album'),

('b1000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000001',
 'The Prequel', 'the-prequel',
 'The Prequel raconte les origines. Avant la lumière, avant la scène : le parcours qui a forgé Fdy Phenomen.',
 '/images/projects/the-prequel.svg', 2017,
 ARRAY['Genesis', 'Premier souffle', 'La base', 'Origines', 'Prélude', 'Foundation', 'The Beginning'],
 'mixtape'),

('b1000000-0000-0000-0000-000000000007', 'a1000000-0000-0000-0000-000000000001',
 'Charcutier', 'charcutier',
 'Charcutier, c''est Fdy qui découpe. Des instrus taillées au couteau, des flows chirurgicaux, du rap qui tranche.',
 '/images/projects/charcutier.svg', 2016,
 ARRAY['Billot', 'Lame', 'Tranchant', 'Couperet', 'Filet', 'Découpe'],
 'album'),

('b1000000-0000-0000-0000-000000000008', 'a1000000-0000-0000-0000-000000000001',
 'Ça D''vait Arriver', 'ca-dvait-arriver',
 'Un album inévitable. Ça D''vait Arriver sonne comme une évidence : Fdy Phenomen livre un projet abouti, mature et sincère.',
 '/images/projects/ca-dvait-arriver.svg', 2015,
 ARRAY['Inévitable', 'Destin', 'Le moment', 'À l''heure', 'Patience', 'L''attente', 'Ça devait arriver'],
 'album');

-- Produits pour "Chanteur de Rap"
INSERT INTO products (id, project_id, artist_id, name, slug, description, price, image_url, category, stock, is_limited, edition_info, shipping_delay) VALUES
('d1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001',
 'Vinyle "Chanteur de Rap" – Classic Edition', 'vinyle-chanteur-de-rap-classic',
 'Vinyle 33 tours, pressage classic edition en tirage limité. Pochette cartonnée avec livret 8 pages incluant les textes. Un objet de collection pour les amateurs de rap d''auteur.',
 2990, '/images/products/vinyle-chanteur-de-rap.svg', 'vinyle', 150, true, 'Tirage limité à 300 exemplaires', '5-7 jours ouvrés'),

('d1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001',
 'CD "Chanteur de Rap"', 'cd-chanteur-de-rap',
 'CD digipack avec livret complet. Tous les textes, crédits et remerciements. Le format classique pour profiter de l''album en qualité optimale.',
 1490, '/images/products/cd-chanteur-de-rap.svg', 'cd', 500, false, NULL, '3-5 jours ouvrés'),

('d1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001',
 'T-shirt "Chanteur de Rap"', 'tshirt-chanteur-de-rap',
 'T-shirt 100% coton bio, sérigraphie "Chanteur de Rap" sur le devant avec le visuel de l''album. Coupe unisexe, disponible du S au XXL.',
 2490, '/images/products/tshirt-chanteur-de-rap.svg', 'tshirt', 200, false, NULL, '3-5 jours ouvrés');

-- Variantes pour le T-shirt
INSERT INTO product_variants (id, product_id, label, type, stock, price_modifier) VALUES
('e1000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000003', 'S', 'size', 40, 0),
('e1000000-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000003', 'M', 'size', 50, 0),
('e1000000-0000-0000-0000-000000000003', 'd1000000-0000-0000-0000-000000000003', 'L', 'size', 50, 0),
('e1000000-0000-0000-0000-000000000004', 'd1000000-0000-0000-0000-000000000003', 'XL', 'size', 35, 0),
('e1000000-0000-0000-0000-000000000005', 'd1000000-0000-0000-0000-000000000003', 'XXL', 'size', 25, 0);
