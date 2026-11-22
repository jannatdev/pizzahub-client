

export type OrderStatus =
  | "Pending"
  | "Accepted"
  | "Rejected"
  | "Cancelled";

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
  menuId: string;

  customerId: string;
  customerName: string;
  customerEmail: string;

  vendorId: string;
  vendorName: string;
  vendorEmail: string;

  itemName: string;
  imageUrl: string;

  price: number;
  quantity: number;
  totalPrice: number;

  deliveryDate: string;
  deliveryAddress: string;

  status: OrderStatus;
  /**
   * Free-text note the customer added at checkout. The backend stores it as
   * `additionalMessage` (see pizzahub-server order controller), so the client
   * must use the same name or the value silently reads as undefined.
   */
  additionalMessage?: string;

  createdAt: string;
  updatedAt: string;
}

export interface VendorOrdersResponse {
  success: boolean;
  message: string;
  total: number;
  data: Order[];
}
