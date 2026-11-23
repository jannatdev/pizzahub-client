



/**
 * Envelope every backend endpoint answers with (`{ success, message, ... }`).
 * `T` is the payload: list/detail endpoints put it in `data`, while
 * `POST /api/orders` answers with `order`.
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  order?: T;
}

export type OrderStatus =
  | "Pending"
  | "Accepted"
  | "Rejected"
  | "Delivered"
  | "Cancelled";

export interface Order {
  _id: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  itemName: string;
  itemImage?: string;
  quantity: number;
  price: number;
  totalPrice: number;
  deliveryDate: string;
  deliveryAddress: string;
  additionalMessage?: string;
  status: OrderStatus;
}
export interface VendorOrdersResponse {
  success: boolean;
  message: string;
  total: number;
  data: Order[];
}
