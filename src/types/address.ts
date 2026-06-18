export type Address = {
  id: string;
  label: string;
  name: string;
  line1: string;
  line2: string;
  city: string;
  region: string;
  postal_code: string;
  country: string;
  phone: string;
  is_default: boolean;
  created_at: string;
};

export type AddressInput = {
  label?: string;
  name: string;
  line1: string;
  line2?: string;
  city: string;
  region?: string;
  postal_code?: string;
  country: string;
  phone?: string;
  is_default?: boolean;
};
