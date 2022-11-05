export interface Book {
  id: string;
  title: string;
  description: string;
  authorName: string;
  price: number;
  imageUrl?: string;
  sellerId: string;
  createdAt: Date;
  orderId?: string;
}
