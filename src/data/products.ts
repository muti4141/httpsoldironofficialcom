export type Product = {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  type: "apparel" | "supplement";
  price: number;
  image: string;
  video?: string;
  videoPoster?: string;
  badge?: string;
  description: string;
  subtitle: string;
  flavors?: string[];
  weights?: string[];
  servings?: number;
  originalPrice?: number;
  freeShipping?: boolean;
};

// Fallback-Bilder, falls das Produktbild nicht geladen werden kann
export const APPAREL_PLACEHOLDER = "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80";
export const SUPPLEMENT_PLACEHOLDER = "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800&q=80";

export const products: Product[] = [
  {
    id: "iron-tee",
    name: "Oversize Tee 'Iron'",
    category: "tops",
    categoryLabel: "Oberteile",
    type: "apparel",
    price: 24.90,
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80",
    video: "/videos/iron-tee.mp4",
    badge: "Bald erhältlich",
    subtitle: "Heavyweight Oversize · 300 gsm",
    description: "Der ultimative Pump Cover. Aus 300 g/m² Heavyweight-Baumwolle gefertigt, für maximale Haltbarkeit und Tragekomfort. Für Athleten, die im Gym keine Kompromisse eingehen. Athletic Oversize Fit, kastige Silhouette, tief angesetzte Ärmel.",
  },
  {
    id: "stringer-hustle",
    name: "Stringer 'Hustle'",
    category: "tops",
    categoryLabel: "Oberteile",
    type: "apparel",
    price: 17.90,
    image: "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=800&q=80",
    video: "/videos/stringer-hustle.mp4",
    subtitle: "Classic Cut · Anthrazit",
    description: "Tief ausgeschnittene Armöffnungen. Schwerer Stoff. Maximale Bewegungsfreiheit im Gym. Klassischer Stringer-Schnitt für kompromisslose Trainingssessions.",
  },
];

export const findProduct = (id: string) => products.find((p) => p.id === id);
