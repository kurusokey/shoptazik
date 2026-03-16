// Mapping titre → YouTube video ID
// Clé = titre du morceau en minuscule (ou début du titre)
// On fait un match souple : si le titre de la tracklist contient la clé, on retourne l'ID

const youtubeIds: Record<string, string> = {
  // === Chanteur de Rap ===
  "patate de mike": "cNe0Mnnx98g",
  "og country club": "gVvjXiU485w",
  "chanteur de rap": "I7W2vTPFheI",
  "borderline": "N7M1GsEIlQg",
  "denis": "Ovus8Crmjys",
  "interlude frero prod": "LtSHe2ZCrrA",
  "toutes les femmes de ma vie": "DcVQMrH6Mfc",
  "j'n'aime pas comment tu m'aimes": "e3YTIzDta7c",
  "ya pas": "wkKJFTwThxs",
  "iam": "28ZlgFlOp7w",

  // === Flamboyant ===
  "nécessaire": "_FjToHvLvBc",
  "necessaire": "_FjToHvLvBc",

  // === Qui Peut Tuer la Rage d'un Assassin ===
  "trop près": "g6ftPTKcgko",
  "trop pres": "g6ftPTKcgko",

  // === Divers ===
  "viens pas me compliquer": "mmkZ3wC3nWw",
};

export function getYouTubeId(trackTitle: string): string | null {
  const lower = trackTitle.toLowerCase();
  for (const [key, id] of Object.entries(youtubeIds)) {
    if (lower.includes(key)) {
      if (id.length === 11) return id;
    }
  }
  return null;
}
