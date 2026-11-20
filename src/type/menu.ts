export interface Menu {
  _id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  location: string;
  description?: string;
  status: string;
  isActive: boolean;
  vendor: {
    name: string;
    email?: string;
    image?: string;
  };
}