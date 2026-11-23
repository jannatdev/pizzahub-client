

export type OrderStatus =
  | "Pending"
  | "Accepted"
  | "Rejected"
  | "Delivered";


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

export interface Order {
  _id: string;
  status: "Pending" | "Accepted" | "Rejected" | "Delivered";
  createdAt: string;

  customerName: string;
  customerEmail: string;

  itemName: string;
  itemImage?: string; // Add this
  quantity: number;
  price: number;
  totalPrice: number;

  deliveryDate: string;
  deliveryAddress: string;
  additionalMessage?: string;
}

export interface VendorOrdersResponse {
  success: boolean;
  message: string;
  total: number;
  data: Order[];
}
