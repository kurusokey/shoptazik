export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

export function categoryLabel(category: string): string {
  const labels: Record<string, string> = {
    vinyle: "Vinyle",
    cd: "CD",
    k7: "K7",
    tshirt: "T-shirt",
    hoodie: "Hoodie",
    poster: "Poster",
    other: "Autre",
  };
  return labels[category] ?? category;
}

export function projectTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    album: "Album",
    ep: "EP",
    mixtape: "Mixtape",
    single: "Single",
  };
  return labels[type] ?? type;
}
