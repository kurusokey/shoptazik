// Thèmes visuels par page — utilisé par Header et Footer
// pour s'adapter à l'univers de chaque album

export interface PageTheme {
  headerBg: string;
  headerBorder: string;
  logo: string;
  linkColor: string;
  linkHover: string;
  accentName: string;
  accentHref: string;
  accentColor: string;
  cartBg: string;
  cartBorder: string;
  badgeBg: string;
  badgeText: string;
  footerBg: string;
  footerBorder: string;
  footerText: string;
  footerMuted: string;
}

const themes: Record<string, PageTheme> = {
  // Page Flamboyant — mauve/bordeaux
  flamboyant: {
    headerBg: "rgba(26,14,20,0.92)",
    headerBorder: "1px solid rgba(90,32,64,0.2)",
    logo: "#C07088",
    linkColor: "rgba(192,112,136,0.5)",
    linkHover: "white",
    accentName: "Flamboyant",
    accentHref: "/artists/fdy-phenomen/flamboyant",
    accentColor: "#C07088",
    cartBg: "rgba(90,48,69,0.2)",
    cartBorder: "1px solid rgba(90,32,64,0.25)",
    badgeBg: "linear-gradient(135deg, #8B3050, #5A2040)",
    badgeText: "white",
    footerBg: "#150a10",
    footerBorder: "1px solid rgba(90,32,64,0.15)",
    footerText: "#9A7080",
    footerMuted: "rgba(90,32,64,0.3)",
  },
  // Page Qui Peut Tuer — noir/rouge
  "qui-peut-tuer-la-rage-dun-assassin": {
    headerBg: "rgba(10,10,10,0.92)",
    headerBorder: "1px solid rgba(212,25,32,0.1)",
    logo: "#D41920",
    linkColor: "rgba(255,255,255,0.35)",
    linkHover: "white",
    accentName: "Qui Peut Tuer...",
    accentHref: "/artists/fdy-phenomen/qui-peut-tuer-la-rage-dun-assassin",
    accentColor: "#D41920",
    cartBg: "rgba(212,25,32,0.08)",
    cartBorder: "1px solid rgba(212,25,32,0.12)",
    badgeBg: "#D41920",
    badgeText: "white",
    footerBg: "#080808",
    footerBorder: "1px solid rgba(212,25,32,0.1)",
    footerText: "rgba(255,255,255,0.35)",
    footerMuted: "rgba(212,25,32,0.15)",
  },
  // Page Ça D'vait Arriver — noir/or
  "ca-dvait-arriver": {
    headerBg: "rgba(12,10,8,0.92)",
    headerBorder: "1px solid rgba(200,160,80,0.1)",
    logo: "#C8A050",
    linkColor: "rgba(255,255,255,0.35)",
    linkHover: "white",
    accentName: "Ça D'vait Arriver",
    accentHref: "/artists/fdy-phenomen/ca-dvait-arriver",
    accentColor: "#C8A050",
    cartBg: "rgba(200,160,80,0.08)",
    cartBorder: "1px solid rgba(200,160,80,0.12)",
    badgeBg: "#C8A050",
    badgeText: "black",
    footerBg: "#0a0908",
    footerBorder: "1px solid rgba(200,160,80,0.1)",
    footerText: "rgba(255,255,255,0.35)",
    footerMuted: "rgba(200,160,80,0.15)",
  },
  // Tropikal F — orange tropical
  tropikal: {
    headerBg: "rgba(42,21,0,0.92)",
    headerBorder: "1px solid rgba(232,112,32,0.15)",
    logo: "#E87020",
    linkColor: "rgba(255,255,255,0.4)",
    linkHover: "white",
    accentName: "Tropikal F",
    accentHref: "/artists/fdy-phenomen/tropikal",
    accentColor: "#E87020",
    cartBg: "rgba(232,112,32,0.1)",
    cartBorder: "1px solid rgba(232,112,32,0.15)",
    badgeBg: "#E87020",
    badgeText: "white",
    footerBg: "#1a0e00",
    footerBorder: "1px solid rgba(232,112,32,0.1)",
    footerText: "rgba(255,255,255,0.35)",
    footerMuted: "rgba(232,112,32,0.15)",
  },
  // The Prequel — gris/rouge sang
  "the-prequel": {
    headerBg: "rgba(26,26,24,0.92)",
    headerBorder: "1px solid rgba(139,26,26,0.15)",
    logo: "#8B1A1A",
    linkColor: "rgba(255,255,255,0.35)",
    linkHover: "white",
    accentName: "The Prequel",
    accentHref: "/artists/fdy-phenomen/the-prequel",
    accentColor: "#8B1A1A",
    cartBg: "rgba(139,26,26,0.08)",
    cartBorder: "1px solid rgba(139,26,26,0.12)",
    badgeBg: "#8B1A1A",
    badgeText: "white",
    footerBg: "#141412",
    footerBorder: "1px solid rgba(139,26,26,0.1)",
    footerText: "rgba(255,255,255,0.35)",
    footerMuted: "rgba(139,26,26,0.15)",
  },
  // Le Charcutier — rouge vif/noir
  charcutier: {
    headerBg: "rgba(26,8,8,0.92)",
    headerBorder: "1px solid rgba(212,25,32,0.15)",
    logo: "#D41920",
    linkColor: "rgba(255,255,255,0.4)",
    linkHover: "white",
    accentName: "Le Charcutier",
    accentHref: "/artists/fdy-phenomen/charcutier",
    accentColor: "#D41920",
    cartBg: "rgba(212,25,32,0.1)",
    cartBorder: "1px solid rgba(212,25,32,0.15)",
    badgeBg: "#D41920",
    badgeText: "white",
    footerBg: "#120606",
    footerBorder: "1px solid rgba(212,25,32,0.1)",
    footerText: "rgba(255,255,255,0.35)",
    footerMuted: "rgba(212,25,32,0.15)",
  },
  // Rimeurs à Gages — jaune vif / bleu marine
  "rimeurs-a-gages": {
    headerBg: "rgba(200,176,32,0.95)",
    headerBorder: "1px solid rgba(10,42,106,0.15)",
    logo: "#0A2A6A",
    linkColor: "rgba(10,42,106,0.5)",
    linkHover: "#0A2A6A",
    accentName: "Rimeurs à Gages",
    accentHref: "/artists/fdy-phenomen/rimeurs-a-gages",
    accentColor: "#0A2A6A",
    cartBg: "rgba(10,42,106,0.1)",
    cartBorder: "1px solid rgba(10,42,106,0.2)",
    badgeBg: "#0A2A6A",
    badgeText: "#D4B830",
    footerBg: "#A89018",
    footerBorder: "1px solid rgba(10,42,106,0.15)",
    footerText: "rgba(10,42,106,0.6)",
    footerMuted: "rgba(10,42,106,0.15)",
  },
  // Hors Série — terracotta/or
  "hors-serie": {
    headerBg: "rgba(26,16,10,0.92)",
    headerBorder: "1px solid rgba(212,160,48,0.12)",
    logo: "#D4A030",
    linkColor: "rgba(255,255,255,0.4)",
    linkHover: "white",
    accentName: "H(or)s-Série",
    accentHref: "/artists/fdy-phenomen/hors-serie",
    accentColor: "#D4A030",
    cartBg: "rgba(212,160,48,0.08)",
    cartBorder: "1px solid rgba(212,160,48,0.12)",
    badgeBg: "#D4A030",
    badgeText: "black",
    footerBg: "#140C06",
    footerBorder: "1px solid rgba(212,160,48,0.1)",
    footerText: "rgba(255,255,255,0.35)",
    footerMuted: "rgba(212,160,48,0.1)",
  },
};

// Thème par défaut — page accueil / Chanteur de Rap — ambre/or chaud
const defaultTheme: PageTheme = {
  headerBg: "rgba(26,22,16,0.92)",
  headerBorder: "1px solid rgba(200,160,80,0.1)",
  logo: "#C8A050",
  linkColor: "rgba(255,255,255,0.4)",
  linkHover: "white",
  accentName: "Chanteur de Rap",
  accentHref: "/artists/fdy-phenomen/chanteur-de-rap",
  accentColor: "#C8A050",
  cartBg: "rgba(200,160,80,0.08)",
  cartBorder: "1px solid rgba(200,160,80,0.12)",
  badgeBg: "#C8A050",
  badgeText: "black",
  footerBg: "#141210",
  footerBorder: "1px solid rgba(200,160,80,0.1)",
  footerText: "rgba(255,255,255,0.3)",
  footerMuted: "rgba(200,160,80,0.1)",
};

export function getPageTheme(pathname: string): PageTheme {
  for (const [slug, theme] of Object.entries(themes)) {
    if (pathname.includes(slug)) return theme;
  }
  return defaultTheme;
}
