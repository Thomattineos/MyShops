import { Product } from "../product/product";

export interface Category {
    id ?: number,
    name: string,
    products: Product[] | null;
  }