export type Product = {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  price: number;
  image: string;
  badge?: string;
  description: string;
  subtitle: string;
};

export const products: Product[] = [
  {
    id: "iron-tee",
    name: "Oversized Tee 'Iron'",
    category: "tops",
    categoryLabel: "Oberteile",
    price: 49.9,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDoX_FBqhWDcebtTIAaXVwx8QkcSXLMNKBE2Cd1hUndxKSrsAZxlGpx57gDLcccigHC--sYKhCjYwQuy8uXi5U_envAlkMjJH1hvkyfkh2yHRZ5YLwuUiZ9hsiAFvJIApi7yOmwKR1DfDY0jQtk_ss9wOcK2rQx9IH2pNSgbI-z3JcqgZO3yZha5_2FNtdp5GLlt1bzme8ntTjmsT9cUDQFOlj4jfyqZc6ZNZ6DWk7xFsPmP8NrHDDh5SCjWNn-eSLE53edCKaXnCA",
    badge: "Bestseller",
    subtitle: "Heavy Cotton Oversized",
    description: "Der ultimative Pump-Cover. Gefertigt aus schwerer 300gsm Baumwolle für maximale Strapazierfähigkeit und Komfort. Designed für Athleten, die im Gym keine Kompromisse eingehen.",
  },
  {
    id: "stringer-hustle",
    name: "Stringer 'Hustle'",
    category: "tops",
    categoryLabel: "Oberteile",
    price: 34.9,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBA7JSDohkLHUhKePu-LuIVNjGeTG1uYVf6nspubBNi9mlYsprcF3GjlOvdmyTLysZxHjBb-jEA7uruUipLPmji-jbYSzwQlcP8JTcIMxLMdNanExU7CXE0lCWBgSaYxMUMW03EhMPQtUn_9TgPmMM294MKsqhVCibWW_wqIMJ_lYYYWSAjKcUr5Hgi9qJQQhCMvdioPfVPwMGhHIBMZ-dyOPu9h373c-MIsoxtvFgSJd-uCQbcKD-c_ZrC5w8Ksv_7GHHIwQG8n6I",
    subtitle: "Classic Cut Charcoal",
    description: "Tiefer Armausschnitt. Schwerer Stoff. Maximale Bewegungsfreiheit im Gym.",
  },
  {
    id: "training-shorts",
    name: "Training Shorts V1",
    category: "bottoms",
    categoryLabel: "Unterteile",
    price: 39.9,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDrUGSqZ9Mmzuu8hLddfgdojjLItJS90S0EkR0AlYJflc0VSBPhiJ_pq9w-B4tEoal4xFd-NRYnJka3nGavfhXEQzM7YS2CcOj2uDeYqfIfEiOjy87UgOFWd_NMfZOSzvhlQvMSnPwCdDpgeh75eNNsDJgv13SOQn3HNmboPyAjPcvW4PzDH974-r2B_8cxmPlPnzSypOFfzEbKuwbiH6WGZKzSxWRkTilikxYo7_oPwcNc-6k-pZkr64Xfvg-HjryD3TFqV9nIDwI",
    subtitle: "Blackout Edition",
    description: "Premium Mesh. Mattes silbernes Branding. Für brutale Sessions geschnitten.",
  },
  {
    id: "oversized-hoodie",
    name: "Oversized Hoodie",
    category: "tops",
    categoryLabel: "Oberteile",
    price: 74.9,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAiX4X-GHLErKszBNvw9XiXXFwd_iMv23Q9b0lNevyheUOSbltGKfbBCp8IQ5Yo0vjdsToZdpvAFB8Dv3A38KsAxysqdB45PDHpbNppE1efO2SSJvmN5sb46pqT2juFCnv6e6porgAclfg_1zCpGe1tNUUCTzYb8Fm_tLZlikpm7PzK8P6YOVioNsNEULzJNCWa4Fx0rLoWyEWoP1KfbeHuelSNJEDJhr-18xmT01rONoOnj3bxDRlBJvVd5z2Ltcg7cP5I6OrLdqY",
    subtitle: "Heavyweight Charcoal",
    description: "300gsm Baumwolle. Drop-Shoulder. Kangaroo-Pocket. Der wärmste Schatten im Gym.",
  },
  {
    id: "steel-bag",
    name: "Steel Bag 40L",
    category: "accessories",
    categoryLabel: "Accessoires",
    price: 89.9,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuArgCwVx3sGVn_vhkOvzn-wsXWtbCj6AtlU_-eRbqt8ypI2MK3lhsAPxmj9EYjlcVhchrQ8GeiFDCotObBFqVKqL5SHlDc9HCdJpjytjo4NEWEGt3Hdm5MKhz5T8oFoP6xeQoD1BLaVy9kzWu8GxxLAxr0NCnay_57F-iQA_1SkL07DNB9u3lSf61STm_kHvMENEj--CNMlLMcJIqBYalS8PW2h0swCCXOv5hdblcm4PaWR4wDRE17fqJvPhJYoYgOPC8UN2UcOP2A",
    badge: "Bestseller",
    subtitle: "Industrial Duffle",
    description: "40 Liter. Verstärkte Nähte. Chromhardware. Für jede Session und jede Reise.",
  },
  {
    id: "lifting-straps",
    name: "Lifting Straps Pro",
    category: "accessories",
    categoryLabel: "Training",
    price: 19.9,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDUo33pj-kBNshGtcXKdYPOrMrKPfZl8CMBLg1uulOwvSx__z885QyrtzD1O3mPfyOHxNcCWF3DxE6IqDrTOT3rzQLPWtumHlGCZEZEa86E-nchgwmjzPYULwfnl25m-CeDtJ9SdpoAi1lw0uIisUQFqtk9_YcbSMsaMakrnTjrY8HPQtRIKnawwDeGzRRvChHtBicfjczERejFwUlBO3Mjhz5QLD0dbAHzId6iEnmMGkkzcCbMxw9azDk3bK654YEdHqFboAVNmd8",
    subtitle: "Reinforced Canvas",
    description: "Verstärkter Canvas. Matte Hardware. Halten, wenn du loslassen willst.",
  },
];

export const findProduct = (id: string) => products.find((p) => p.id === id);
