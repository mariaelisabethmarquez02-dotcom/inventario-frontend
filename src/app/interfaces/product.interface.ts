export interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  supplier: string;
  available: boolean;
}