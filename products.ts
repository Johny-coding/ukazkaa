export const CATEGORIES = [
  "Pečivo",
  "Mléčné výrobky",
  "Uzeniny",
  "Ovoce a zelenina",
] as const;

export type ProductCategory = (typeof CATEGORIES)[number];

export interface Product {
  id: string;
  title: string;
  price: number;
  category: ProductCategory;
  image_url: string;
  is_action: boolean;
  in_stock: boolean;
  stock_count: number;
}

export type ProductFormValues = Omit<Product, "id">;

/**
 * Ověřené obrázky z Unsplash CDN. Všechny adresy vracejí přímo obrazový soubor,
 * takže je lze použít také později v `image_url` u databázového záznamu.
 */
export const CATEGORY_IMAGES: Record<ProductCategory, string> = {
  Pečivo:
    "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=85",
  "Mléčné výrobky":
    "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=1200&q=85",
  Uzeniny:
    "https://images.unsplash.com/photo-1524438418049-ab2acb7aa48f?auto=format&fit=crop&w=1200&q=85",
  "Ovoce a zelenina":
    "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=1200&q=85",
};

export const HERO_IMAGE =
  "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1400&q=85";

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "8d273d4e-0634-4bc1-8b69-4f8b36f3ae01",
    title: "Křupavý rohlík",
    price: 3,
    category: "Pečivo",
    image_url: CATEGORY_IMAGES["Pečivo"],
    is_action: false,
    in_stock: true,
    stock_count: 150,
  },
  {
    id: "8d273d4e-0634-4bc1-8b69-4f8b36f3ae02",
    title: "Farmářské máslo 250g",
    price: 49,
    category: "Mléčné výrobky",
    image_url: CATEGORY_IMAGES["Mléčné výrobky"],
    is_action: true,
    in_stock: true,
    stock_count: 20,
  },
  {
    id: "8d273d4e-0634-4bc1-8b69-4f8b36f3ae03",
    title: "Výběrová šunka 100g",
    price: 34,
    category: "Uzeniny",
    image_url: CATEGORY_IMAGES.Uzeniny,
    is_action: false,
    in_stock: true,
    stock_count: 12,
  },
  {
    id: "8d273d4e-0634-4bc1-8b69-4f8b36f3ae04",
    title: "Jablka Gala 1kg",
    price: 39,
    category: "Ovoce a zelenina",
    image_url: CATEGORY_IMAGES["Ovoce a zelenina"],
    is_action: true,
    in_stock: false,
    stock_count: 0,
  },
];

export function isProductAvailable(product: Pick<Product, "in_stock" | "stock_count">) {
  return product.in_stock && product.stock_count > 0;
}
