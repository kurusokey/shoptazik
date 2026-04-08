// ============================================
// Configuration marque La M.U.G
// Données injectées dans le contexte de l'agent
// ============================================

export const BRAND_CONFIG = {
  name: "La M.U.G",
  fullName: "La Maison Urbaine Générale",
  founder: "Fdy Phenomen",
  type: "Association culturelle hip-hop",
  description:
    "Association fondée par le rappeur Fdy Phenomen, dédiée à la culture hip-hop, à la transmission artistique et à la musique indépendante.",

  // Écosystème de sites
  sites: {
    main: { url: "https://la-mug.com", label: "Site vitrine de l'association" },
    art: { url: "https://fdy.art", label: "Univers artistique de Fdy Phenomen" },
    shop: {
      url: "https://boutique.la-mug.com",
      label: "Boutique en ligne — vinyles, CD, digital",
    },
  },

  // Identité visuelle
  palette: {
    gold: "#C8A050",
    darkGold: "#8B6914",
    cream: "#F5E6C8",
    black: "#0A0A0A",
    darkBrown: "#1A1207",
  },

  // Réseaux sociaux (à créer/unifier)
  social: {
    instagram: "@lamug_officiel",
    tiktok: "@lamug_officiel",
    youtube: "La M.U.G",
    facebook: "La M.U.G - Association",
    twitter: "@LaMUG_officiel",
    spotify: "Fdy Phenomen",
  },

  // Discographie disponible en boutique
  discography: [
    {
      title: "Chanteur de Rap",
      year: 2024,
      type: "Album",
      formats: ["Vinyle Premium", "Vinyle Classic", "CD"],
      highlight: true,
    },
    {
      title: "Flamboyant",
      year: 2020,
      type: "Album",
      formats: ["CD", "Digital"],
    },
    {
      title: "Qui Peut Tuer ?",
      year: 2017,
      type: "Album",
      formats: ["CD", "Digital"],
    },
    {
      title: "Ça D'vait Arriver",
      year: 2014,
      type: "Album",
      formats: ["CD", "Digital"],
    },
    {
      title: "Tropikal",
      year: 2012,
      type: "Album",
      formats: ["CD", "Digital"],
    },
    {
      title: "The Prequel",
      year: 2010,
      type: "Mixtape",
      formats: ["Digital"],
    },
    {
      title: "Rimeurs à Gages",
      year: 2007,
      type: "Album",
      formats: ["CD", "Digital"],
    },
    {
      title: "Hors Série",
      year: 2023,
      type: "Compilation",
      formats: ["Digital"],
    },
  ],

  // Activités de l'association
  activities: [
    "Ateliers d'écriture rap",
    "Ateliers MAO (Musique Assistée par Ordinateur)",
    "Ateliers graffiti / art urbain",
    "Événements culturels et concerts",
    "Transmission et éducation artistique",
  ],

  // Hashtags permanents
  hashtags: {
    permanent: ["#LaMUG", "#FdyPhenomen", "#RapFrançais", "#HipHopFR"],
    music: [
      "#RapConscient",
      "#VinyleRap",
      "#MusiqueUrbaine",
      "#CultureHipHop",
      "#RapOldSchool",
      "#RapIndépendant",
      "#MadeInFrance",
    ],
    shop: ["#BoutiqueRap", "#VinyleCollector", "#CDRap"],
    association: [
      "#AtelierMusique",
      "#AssociationCulturelle",
      "#ArtUrbain",
    ],
  },

  // Ton et voix de la marque
  tone: {
    style: "Authentique, passionné, accessible, old-school hip-hop",
    language: "Français, tutoiement accepté sur réseaux, vouvoiement en email",
    values: [
      "Authenticité",
      "Transmission",
      "Culture hip-hop",
      "Indépendance",
      "Communauté",
    ],
    avoid: [
      "Langage corporate",
      "Anglicismes inutiles",
      "Ton condescendant",
      "Clickbait agressif",
    ],
  },
} as const;

export type BrandConfig = typeof BRAND_CONFIG;
