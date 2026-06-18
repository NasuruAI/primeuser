export type ImageUrls = { thumb: string; card: string; detail: string };

export type ProductImage = {
  id: string;
  alt_text: string;
  position: number;
  is_primary: boolean;
  variant: string | null;
  urls: ImageUrls;
};

export type Category = {
  id: number;
  name: string;
  slug: string;
  parent: number | null;
  position: number;
};

export type Brand = { id: number; name: string; slug: string };

export type MoneyDisplay = {
  base_amount: string;
  base_currency: string;
  currency: string;
  amount: string;
  formatted: string;
  rate: string;
  converted: boolean;
};

export type OptionValue = { id: number; value: string; position: number };
export type OptionType = {
  id: number;
  name: string;
  position: number;
  values: OptionValue[];
};

export type Variant = {
  id: string;
  sku: string;
  price: string;
  is_default: boolean;
  options_key: string;
  option_value_ids: number[];
  fulfillment_type: "internal" | "dropship";
  available: number;
  in_stock: boolean;
  images: ProductImage[];
  price_display: MoneyDisplay | null;
  /** Original (pre-discount) price, shown struck-through. Null when not discounted. */
  compare_at_display: MoneyDisplay | null;
  discount_percent: string;
};

export type ProductListItem = {
  id: string;
  title: string;
  slug: string;
  short_id: string;
  category: Category | null;
  brand: Brand | null;
  price_from: string | null;
  price_from_display: MoneyDisplay | null;
  compare_at_from_display: MoneyDisplay | null;
  discount_percent: string;
  primary_image: ImageUrls | null;
  share_path: string;
  has_options: boolean;
  default_variant: string | null;
};

export type ProductDetail = {
  id: string;
  title: string;
  slug: string;
  short_id: string;
  description: string;
  category: Category | null;
  brand: Brand | null;
  fulfillment_type: string;
  option_types: OptionType[];
  variants: Variant[];
  images: ProductImage[];
  share_path: string;
};

export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};
