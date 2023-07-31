import { Shop } from "../shop/shop";
import { Category } from "../category/category";

export interface Product {
    id ?: number;
    name: string;
    price: number;
    description?: string;
    shop: Shop | null;
    categories: Category[] | null;
  }