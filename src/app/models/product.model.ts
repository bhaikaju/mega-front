export interface ProductModelServer {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  quantity: number;
  images: string;
}

export interface ServerResponse {
  count: number;
  products: ProductModelServer[];
}
