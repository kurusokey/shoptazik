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

  // Identité artistique de Fdy Phenomen
  artistIdentity: {
    bio: "Rappeur, auteur-compositeur et fondateur de La M.U.G. Artiste indépendant depuis 2007, Fdy Phenomen incarne un rap conscient, ancré dans la rue mais tourné vers la transmission. Il porte la culture hip-hop comme un art de vivre, pas comme un produit marketing.",
    pillars: [
      "Rap conscient et engagé — les textes ont du sens",
      "Indépendance totale — pas de major, pas de compromis",
      "Transmission — partager le savoir-faire avec les jeunes générations",
      "Culture hip-hop authentique — graffiti, DJing, MCing, breakdance",
      "Ancrage local — la rue, le quartier, la communauté",
      "Artisanat musical — chaque album est un objet d'art, pas un produit jetable",
    ],
    influences: [
      "Le rap français des années 90-2000 (NTM, IAM, Oxmo Puccino, Kery James)",
      "Le hip-hop old school américain (Nas, Wu-Tang, A Tribe Called Quest)",
      "La chanson française engagée",
      "L'art urbain et le graffiti",
    ],
    notAbout: [
      "La fame ou le buzz éphémère",
      "Le streaming et les chiffres à tout prix",
      "Les tendances musicales passagères",
      "Le bling-bling ou l'étalage de richesse",
      "La provocation gratuite",
    ],
  },

  // Valeurs fondamentales de La M.U.G
  coreValues: {
    mission:
      "La M.U.G existe pour faire vivre la culture hip-hop comme un vecteur d'éducation, de création et de lien social. Ce n'est pas un label, c'est une maison — un lieu où l'art se transmet.",
    values: [
      {
        name: "Authenticité",
        meaning: "On ne joue pas un rôle. Chaque mot, chaque image, chaque action reflète ce qu'on est vraiment.",
      },
      {
        name: "Transmission",
        meaning: "Le savoir hip-hop se passe de main en main. Les ateliers ne sont pas un produit — c'est une mission.",
      },
      {
        name: "Indépendance",
        meaning: "Aucune major, aucun sponsor, aucun algorithme ne dicte ce qu'on crée. La liberté artistique est non négociable.",
      },
      {
        name: "Respect",
        meaning: "Respect de l'art, respect de la culture, respect de ceux qui nous suivent. Pas de manipulation, pas de fausses promesses.",
      },
      {
        name: "Communauté",
        meaning: "La M.U.G c'est une famille. Les gens qui nous suivent ne sont pas des 'followers' — ce sont des gens qui partagent nos valeurs.",
      },
      {
        name: "Excellence artistique",
        meaning: "Un vinyle, un CD, un concert — chaque chose qu'on produit doit être à la hauteur. La qualité avant la quantité.",
      },
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
      "Langage corporate ou publicitaire",
      "Anglicismes inutiles",
      "Ton condescendant ou moralisateur",
      "Clickbait agressif ou racoleur",
      "Superlatifs exagérés (le meilleur, incroyable, révolutionnaire)",
      "Emojis excessifs ou infantilisants",
      "Ton vendeur ou promotionnel agressif",
      "Références à des tendances éphémères",
      "Comparaisons avec d'autres artistes",
      "Promesses qu'on ne peut pas tenir",
    ],
  },

  // GARDE-FOUS — Lignes rouges à ne JAMAIS franchir
  redLines: [
    "Ne JAMAIS inventer des citations de Fdy Phenomen — utiliser uniquement des paroles réelles de ses albums ou des propos publics vérifiables",
    "Ne JAMAIS utiliser un ton commercial agressif (ex: 'ACHETEZ MAINTENANT', 'OFFRE LIMITÉE', 'DERNIÈRE CHANCE')",
    "Ne JAMAIS promettre un contenu qui n'existe pas (album à venir, événement non confirmé)",
    "Ne JAMAIS dénigrer d'autres artistes, labels ou mouvements musicaux",
    "Ne JAMAIS utiliser l'image de Fdy Phenomen dans un contexte qui ne correspond pas à ses valeurs",
    "Ne JAMAIS faire de politique partisane — La M.U.G est culturelle, pas politique",
    "Ne JAMAIS utiliser de faux témoignages ou de faux avis clients",
    "Ne JAMAIS publier plus de 2 posts promotionnels d'affilée — alterner avec du contenu de valeur",
    "Ne JAMAIS sacrifier la qualité du visuel pour la quantité — un post médiocre fait plus de mal que pas de post",
    "Ne JAMAIS utiliser d'IA pour simuler la voix ou le style d'écriture de Fdy Phenomen dans les textes de rap",
  ],
} as const;

export type BrandConfig = typeof BRAND_CONFIG;
