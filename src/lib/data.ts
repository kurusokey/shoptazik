import { Artist, Project, Product, ProductVariant } from "@/types";

// ============================================
// Données locales pour le MVP
// À remplacer par des requêtes Supabase
// ============================================

export const artists: Artist[] = [
  {
    id: "a1000000-0000-0000-0000-000000000001",
    name: "Fdy Phenomen",
    slug: "fdy-phenomen",
    bio: "Fdy Phenomen est un rappeur et auteur français reconnu pour son écriture ciselée et son rap d'auteur. Artiste complet, il incarne une vision du rap francophone exigeante, mêlant storytelling, introspection et punchlines avec une authenticité rare. Sa discographie riche traverse les époques et les styles, du rap brut au rap mélodique, toujours avec la plume comme arme principale.",
    image_url: "/images/artists/fdy-phenomen.svg",
    banner_url: "/images/artists/fdy-phenomen-banner.svg",
    created_at: "2024-01-01T00:00:00Z",
  },
];

export const projects: Project[] = [
  {
    id: "b1000000-0000-0000-0000-000000000001",
    artist_id: "a1000000-0000-0000-0000-000000000001",
    title: "Chanteur de Rap",
    slug: "chanteur-de-rap",
    description:
      "Chanteur de Rap est l'album manifeste de Fdy Phenomen. Un projet de 10 titres qui explore la dimension d'auteur du rap français : écriture, storytelling, introspection et connexion entre les générations du hip-hop. Un album pour ceux qui considèrent le rap comme un art d'écriture à part entière.",
    cover_url: "/images/projects/chanteur-de-rap.svg",
    release_year: 2024,
    tracklist: [
      "Intro - Le chanteur",
      "Plume & Micro",
      "Rue d'auteur",
      "Encre noire",
      "Génération texte",
      "L'art de dire",
      "Freestyle d'âme",
      "Portraits",
      "Héritage",
      "Outro - Rideau",
    ],
    type: "album",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "b1000000-0000-0000-0000-000000000002",
    artist_id: "a1000000-0000-0000-0000-000000000001",
    title: "Flamboyant",
    slug: "flamboyant",
    description:
      "Flamboyant est un album ambitieux où Fdy Phenomen déploie tout son talent d'écriture sur des productions riches et variées.",
    cover_url: "/images/projects/flamboyant.svg",
    release_year: 2022,
    tracklist: [
      "Flamboyant (Intro)",
      "Feu sacré",
      "Au sommet",
      "Lumières",
      "Sans filtre",
      "Le parcours",
      "Flammes",
      "Éclat",
      "Brasier",
      "Flamboyant (Outro)",
    ],
    type: "album",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "b1000000-0000-0000-0000-000000000003",
    artist_id: "a1000000-0000-0000-0000-000000000001",
    title: "Qui Peut Tuer la Rage d'un Assassin",
    slug: "qui-peut-tuer-la-rage-dun-assassin",
    description:
      "Un projet brut et viscéral. Fdy Phenomen y livre un rap sans concession, entre rage contenue et lucidité tranchante.",
    cover_url: "/images/projects/qui-peut-tuer.svg",
    release_year: 2020,
    tracklist: [
      "La rage",
      "Assassin",
      "Territoire",
      "Sang froid",
      "Verdict",
      "Instinct",
      "Survie",
      "Le prix",
    ],
    type: "album",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "b1000000-0000-0000-0000-000000000004",
    artist_id: "a1000000-0000-0000-0000-000000000001",
    title: "Hors Série",
    slug: "hors-serie",
    description:
      "Hors Série, c'est le projet en marge des formats classiques. Des morceaux hors cadre, des collaborations inattendues, du Fdy en roue libre.",
    cover_url: "/images/projects/hors-serie.svg",
    release_year: 2019,
    tracklist: [
      "Hors piste",
      "Série noire",
      "Carte blanche",
      "Freestyle",
      "Bonus track",
    ],
    type: "ep",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "b1000000-0000-0000-0000-000000000005",
    artist_id: "a1000000-0000-0000-0000-000000000001",
    title: "Tropikal",
    slug: "tropikal",
    description:
      "Tropikal amène le rap de Fdy Phenomen sous le soleil. Des sonorités chaudes, des flows ensoleillés, mais toujours cette plume acérée.",
    cover_url: "/images/projects/tropikal.svg",
    release_year: 2018,
    tracklist: [
      "Tropikal (Intro)",
      "Soleil noir",
      "Île de France",
      "Chaleur",
      "Brise",
      "Tropikal (Outro)",
    ],
    type: "album",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "b1000000-0000-0000-0000-000000000006",
    artist_id: "a1000000-0000-0000-0000-000000000001",
    title: "The Prequel",
    slug: "the-prequel",
    description:
      "The Prequel raconte les origines. Avant la lumière, avant la scène : le parcours qui a forgé Fdy Phenomen.",
    cover_url: "/images/projects/the-prequel.svg",
    release_year: 2017,
    tracklist: [
      "Genesis",
      "Premier souffle",
      "La base",
      "Origines",
      "Prélude",
      "Foundation",
      "The Beginning",
    ],
    type: "mixtape",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "b1000000-0000-0000-0000-000000000007",
    artist_id: "a1000000-0000-0000-0000-000000000001",
    title: "Charcutier",
    slug: "charcutier",
    description:
      "Charcutier, c'est Fdy qui découpe. Des instrus taillées au couteau, des flows chirurgicaux, du rap qui tranche.",
    cover_url: "/images/projects/charcutier.svg",
    release_year: 2016,
    tracklist: [
      "Billot",
      "Lame",
      "Tranchant",
      "Couperet",
      "Filet",
      "Découpe",
    ],
    type: "album",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "b1000000-0000-0000-0000-000000000008",
    artist_id: "a1000000-0000-0000-0000-000000000001",
    title: "Ça D'vait Arriver",
    slug: "ca-dvait-arriver",
    description:
      "Un album inévitable. Ça D'vait Arriver sonne comme une évidence : Fdy Phenomen livre un projet abouti, mature et sincère.",
    cover_url: "/images/projects/ca-dvait-arriver.svg",
    release_year: 2015,
    tracklist: [
      "Inévitable",
      "Destin",
      "Le moment",
      "À l'heure",
      "Patience",
      "L'attente",
      "Ça devait arriver",
    ],
    type: "album",
    created_at: "2024-01-01T00:00:00Z",
  },
];

export const products: Product[] = [
  {
    id: "d1000000-0000-0000-0000-000000000001",
    project_id: "b1000000-0000-0000-0000-000000000001",
    artist_id: "a1000000-0000-0000-0000-000000000001",
    name: 'Vinyle "Chanteur de Rap" – Classic Edition',
    slug: "vinyle-chanteur-de-rap-classic",
    description:
      "Vinyle 33 tours, pressage classic edition en tirage limité. Pochette cartonnée avec livret 8 pages incluant les textes. Un objet de collection pour les amateurs de rap d'auteur.",
    price: 2990,
    image_url: "/images/products/vinyle-chanteur-de-rap.svg",
    category: "vinyle",
    stock: 150,
    is_limited: true,
    edition_info: "Tirage limité à 300 exemplaires",
    shipping_delay: "5-7 jours ouvrés",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "d1000000-0000-0000-0000-000000000002",
    project_id: "b1000000-0000-0000-0000-000000000001",
    artist_id: "a1000000-0000-0000-0000-000000000001",
    name: 'CD "Chanteur de Rap"',
    slug: "cd-chanteur-de-rap",
    description:
      "CD digipack avec livret complet. Tous les textes, crédits et remerciements. Le format classique pour profiter de l'album en qualité optimale.",
    price: 1490,
    image_url: "/images/products/cd-chanteur-de-rap.svg",
    category: "cd",
    stock: 500,
    is_limited: false,
    shipping_delay: "3-5 jours ouvrés",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "d1000000-0000-0000-0000-000000000003",
    project_id: "b1000000-0000-0000-0000-000000000001",
    artist_id: "a1000000-0000-0000-0000-000000000001",
    name: 'T-shirt "Chanteur de Rap"',
    slug: "tshirt-chanteur-de-rap",
    description:
      'T-shirt 100% coton bio, sérigraphie "Chanteur de Rap" sur le devant avec le visuel de l\'album. Coupe unisexe, disponible du S au XXL.',
    price: 2490,
    image_url: "/images/products/tshirt-chanteur-de-rap.svg",
    category: "tshirt",
    stock: 200,
    is_limited: false,
    shipping_delay: "3-5 jours ouvrés",
    created_at: "2024-01-01T00:00:00Z",
  },
];

export const productVariants: ProductVariant[] = [
  { id: "v1", product_id: "d1000000-0000-0000-0000-000000000003", label: "S", type: "size", stock: 40, price_modifier: 0 },
  { id: "v2", product_id: "d1000000-0000-0000-0000-000000000003", label: "M", type: "size", stock: 50, price_modifier: 0 },
  { id: "v3", product_id: "d1000000-0000-0000-0000-000000000003", label: "L", type: "size", stock: 50, price_modifier: 0 },
  { id: "v4", product_id: "d1000000-0000-0000-0000-000000000003", label: "XL", type: "size", stock: 35, price_modifier: 0 },
  { id: "v5", product_id: "d1000000-0000-0000-0000-000000000003", label: "XXL", type: "size", stock: 25, price_modifier: 0 },
];

// ============================================
// Fonctions d'accès aux données (local)
// ============================================

export function getArtists(): Artist[] {
  return artists;
}

export function getArtistBySlug(slug: string): Artist | undefined {
  return artists.find((a) => a.slug === slug);
}

export function getProjectsByArtist(artistId: string): Project[] {
  return projects
    .filter((p) => p.artist_id === artistId)
    .sort((a, b) => b.release_year - a.release_year);
}

export function getProjectBySlug(
  artistSlug: string,
  projectSlug: string
): (Project & { artist: Artist }) | undefined {
  const artist = getArtistBySlug(artistSlug);
  if (!artist) return undefined;
  const project = projects.find(
    (p) => p.artist_id === artist.id && p.slug === projectSlug
  );
  if (!project) return undefined;
  return { ...project, artist };
}

export function getProductsByProject(projectId: string): Product[] {
  return products.filter((p) => p.project_id === projectId);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getVariantsByProduct(productId: string): ProductVariant[] {
  return productVariants.filter((v) => v.product_id === productId);
}

export function getFeaturedProject(): (Project & { artist: Artist; products: Product[] }) | undefined {
  const project = projects[0];
  if (!project) return undefined;
  const artist = artists.find((a) => a.id === project.artist_id);
  if (!artist) return undefined;
  const projectProducts = getProductsByProject(project.id);
  return { ...project, artist, products: projectProducts };
}
