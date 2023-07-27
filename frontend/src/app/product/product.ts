import { Shop } from "../shop/shop";

export interface Product {
    id ?: number;
    name: string;
    price: number;
    description?: string;
    shop?: Shop;
  }