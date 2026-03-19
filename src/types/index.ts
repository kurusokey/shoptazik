export interface Artist {
  id: string;
  name: string;
  slug: string;
  bio: string;
  image_url: string;
  banner_url: string;
  created_at: string;
}

export interface Project {
  id: string;
  artist_id: string;
  title: string;
  slug: string;
  description: string;
  cover_url: string;
  release_year: number;
  tracklist: string[];
  type: "album" | "ep" | "mixtape" | "single";
  parent_project_id?: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  project_id: string;
  artist_id: string;
  name: string;
  slug: string;
  description: string;
  price: number; // en centimes
  image_url: string;
  category: "vinyle" | "cd" | "k7" | "tshirt" | "hoodie" | "poster" | "other";
  stock: number;
  is_limited: boolean;
  edition_info?: string;
  shipping_delay: string;
  created_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  label: string; // ex: "Taille M", "Noir"
  type: "size" | "color";
  stock: number;
  price_modifier: number; // en centimes, ajouté au prix de base
}

export interface CartItem {
  product: Product;
  variant?: ProductVariant;
  quantity: number;
}

export interface Order {
  id: string;
  customer_email: string;
  customer_name: string;
  shipping_address: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  stripe_session_id?: string;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id?: string;
  quantity: number;
  unit_price: number;
}

export interface Atelier {
  id: string;
  title: string;
  slug: string;
  description: string;
  duration: string;
  max_participants: number;
  price: number; // en centimes
  category: "rap" | "enregistrement" | "clip" | "debat" | "sur-mesure";
  image_url: string | null;
  published: boolean;
  created_at: string;
}

export type ProjectWithProducts = Project & { products: Product[] };
export type ArtistWithProjects = Artist & { projects: Project[] };
