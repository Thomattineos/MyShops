import { Product } from "../product/product";

export interface Shop {
  id ?: number
  name: string;
  openingHours: string;
  closingHours: string;
  available: boolean;
  creationDate ?: string;
  numberOfProducts: number;
  products: Product[];
}