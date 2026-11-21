

export type OrderStatus =
  | "Pending"
  | "Accepted"
  | "Rejected"
  | "Cancelled";

export interface Order {
  _id: string;
  menuId: string;

  customerId: string;
  customerName: string;
  customerEmail: string;

  vendorId: string;
  vendorName: string;
  vendorEmail: string;

  itemName: string;
  itemImage: string;

  price: number;
  quantity: number;
  totalPrice: number;

  deliveryDate: string;
  deliveryAddress: string;

  status: OrderStatus;
  customerMessage?: string;

  createdAt: string;
  updatedAt: string;
}

export interface VendorOrdersResponse {
  success: boolean;
  message: string;
  total: number;
  data: Order[];
}
